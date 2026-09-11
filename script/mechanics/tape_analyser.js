/**
 * Analyse du son reellement joue par le lecteur de cassettes.
 *
 * Les instruments de la scene VX-90 (oscilloscope, analyseur de frequence,
 * VU-metres) etaient de simples decors figes. Ils sont maintenant alimentes
 * par le signal de la bande en cours de lecture.
 *
 * Le son du jeu passe par des balises <audio> : on les branche sur un
 * AudioContext via createMediaElementSource(). Attention, cet appel
 * detourne DEFINITIVEMENT la sortie de l'element vers le graphe — d'ou le
 * branchement systematique vers context.destination, sans quoi la cassette
 * deviendrait muette. Un element ne peut etre branche qu'une fois, d'ou le
 * cache attachedSources.
 */
const TapeAnalyser = (() => {

  const FFT_SIZE = 1024;
  // En dessous, on considere qu'il n'y a plus de signal : les aiguilles
  // retombent au lieu de rester collees au dernier niveau.
  const SILENCE_DB = -60;
  // Frontiere grave/aigu pour la mesure de bruit, en Hz.
  const NOISE_CUTOFF_HZ = 6000;

  let audioContext = null;
  let spectrumAnalyser = null;
  let leftAnalyser = null;
  let rightAnalyser = null;
  let frequencyBins = null;
  let waveformBins = null;
  let channelBins = null;
  let unavailable = false;

  /** Sources deja creees, par element audio : l'API interdit d'en creer deux. */
  const attachedSources = new Map();

  /**
   * Construit le graphe audio au premier branchement.
   * @returns {boolean} Vrai si le graphe est utilisable
   */
  function ensureGraph() {
    if (audioContext) return true;
    if (unavailable) return false;

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      console.warn("[TapeAnalyser] Web Audio indisponible : les instruments resteront au repos.");
      unavailable = true;
      return false;
    }

    audioContext = new AudioContextClass();

    spectrumAnalyser = audioContext.createAnalyser();
    spectrumAnalyser.fftSize = FFT_SIZE;
    spectrumAnalyser.smoothingTimeConstant = 0.75;
    spectrumAnalyser.connect(audioContext.destination);

    // Les deux voies sont mesurees separement pour les VU-metres G et D.
    const splitter = audioContext.createChannelSplitter(2);
    leftAnalyser = audioContext.createAnalyser();
    rightAnalyser = audioContext.createAnalyser();
    leftAnalyser.fftSize = FFT_SIZE;
    rightAnalyser.fftSize = FFT_SIZE;
    splitter.connect(leftAnalyser, 0);
    splitter.connect(rightAnalyser, 1);

    // Un noeud a gain nul termine la branche de mesure : un analyseur qui ne
    // mene nulle part n'est pas garanti d'etre alimente par le graphe.
    const silentSink = audioContext.createGain();
    silentSink.gain.value = 0;
    leftAnalyser.connect(silentSink);
    rightAnalyser.connect(silentSink);
    silentSink.connect(audioContext.destination);

    frequencyBins = new Uint8Array(spectrumAnalyser.frequencyBinCount);
    waveformBins = new Uint8Array(spectrumAnalyser.fftSize);
    channelBins = new Uint8Array(leftAnalyser.fftSize);

    audioContext._tapeSplitter = splitter;
    return true;
  }

  /**
   * Branche un element audio sur l'analyseur. A appeler au demarrage d'une
   * lecture : l'AudioContext ne peut demarrer qu'a la suite d'une action du
   * joueur, et inserer une cassette en est une.
   * @param {HTMLAudioElement} audioElement - Element de la cassette jouee
   * @returns {boolean} Vrai si le signal est analysable
   */
  function attach(audioElement) {
    if (!audioElement || !ensureGraph()) return false;

    if (audioContext.state === 'suspended') {
      audioContext.resume().catch(() => {});
    }

    if (attachedSources.has(audioElement)) return true;

    try {
      const source = audioContext.createMediaElementSource(audioElement);
      source.connect(spectrumAnalyser);
      source.connect(audioContext._tapeSplitter);
      attachedSources.set(audioElement, source);
      return true;
    } catch (err) {
      console.warn("[TapeAnalyser] Branchement impossible, instruments au repos.", err);
      return false;
    }
  }

  /**
   * Niveau efficace d'une voie, en decibels pleine echelle.
   * @param {AnalyserNode} analyser - Analyseur de la voie
   * @returns {number} Niveau en dBFS, plancher a SILENCE_DB
   */
  function readChannelDb(analyser) {
    analyser.getByteTimeDomainData(channelBins);

    let sumSquares = 0;
    for (let i = 0; i < channelBins.length; i++) {
      const sample = (channelBins[i] - 128) / 128;
      sumSquares += sample * sample;
    }

    const rms = Math.sqrt(sumSquares / channelBins.length);
    if (rms <= 0) return SILENCE_DB;
    return Math.max(SILENCE_DB, 20 * Math.log10(rms));
  }

  /**
   * Regroupe le spectre en bandes espacees logarithmiquement, comme la
   * graduation 20 Hz - 20 kHz affichee sous l'analyseur.
   * @param {number} bandCount - Nombre de barres voulues
   * @returns {number[]} Niveaux de 0 a 1
   */
  function readBands(bandCount) {
    spectrumAnalyser.getByteFrequencyData(frequencyBins);

    const nyquist = audioContext.sampleRate / 2;
    const minHz = 20;
    const maxHz = Math.min(20000, nyquist);
    const bands = [];

    for (let i = 0; i < bandCount; i++) {
      const fromHz = minHz * Math.pow(maxHz / minHz, i / bandCount);
      const toHz = minHz * Math.pow(maxHz / minHz, (i + 1) / bandCount);
      const fromBin = Math.floor((fromHz / nyquist) * frequencyBins.length);
      const toBin = Math.max(fromBin + 1, Math.ceil((toHz / nyquist) * frequencyBins.length));

      let peak = 0;
      for (let bin = fromBin; bin < toBin && bin < frequencyBins.length; bin++) {
        if (frequencyBins[bin] > peak) peak = frequencyBins[bin];
      }
      bands.push(peak / 255);
    }

    return bands;
  }

  /**
   * Part de l'energie situee au-dessus de NOISE_CUTOFF_HZ : c'est ce que la
   * scene affiche comme taux de bruit de la bande.
   * @returns {number} Rapport de 0 a 1
   */
  function readNoiseRatio() {
    const nyquist = audioContext.sampleRate / 2;
    const cutoffBin = Math.floor((NOISE_CUTOFF_HZ / nyquist) * frequencyBins.length);

    let total = 0;
    let high = 0;
    for (let bin = 0; bin < frequencyBins.length; bin++) {
      total += frequencyBins[bin];
      if (bin >= cutoffBin) high += frequencyBins[bin];
    }

    return total > 0 ? high / total : 0;
  }

  /**
   * Frequence de la bande la plus energique, affichee comme frequence
   * dominante de la bande magnetique.
   * @returns {number} Frequence en Hz
   */
  function readDominantHz() {
    let peakBin = 0;
    let peak = 0;
    for (let bin = 0; bin < frequencyBins.length; bin++) {
      if (frequencyBins[bin] > peak) { peak = frequencyBins[bin]; peakBin = bin; }
    }

    return (peakBin / frequencyBins.length) * (audioContext.sampleRate / 2);
  }

  /**
   * Amplitude crete de l'onde, de 0 a 1.
   * @returns {number} Amplitude normalisee
   */
  function readWaveformPeak() {
    let peak = 0;
    for (let i = 0; i < waveformBins.length; i++) {
      const amplitude = Math.abs(waveformBins[i] - 128) / 128;
      if (amplitude > peak) peak = amplitude;
    }
    return peak;
  }

  /**
   * Mesure instantanee du signal.
   * @param {number} bandCount - Nombre de bandes de frequence voulues
   * @returns {{active: boolean, left: number, right: number, bands: number[], waveform: Uint8Array, noiseRatio: number}|null} Mesures, ou null si l'analyse est indisponible
   */
  function read(bandCount) {
    if (!audioContext || !spectrumAnalyser) return null;

    const left = readChannelDb(leftAnalyser);
    const right = readChannelDb(rightAnalyser);
    spectrumAnalyser.getByteTimeDomainData(waveformBins);
    const bands = readBands(bandCount);

    return {
      active: left > SILENCE_DB || right > SILENCE_DB,
      left,
      right,
      bands,
      waveform: waveformBins,
      noiseRatio: readNoiseRatio(),
      dominantHz: readDominantHz(),
      peak: readWaveformPeak()
    };
  }

  return { attach, read, SILENCE_DB };

})();
