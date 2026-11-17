# Synthèse avec les voix Windows "Desktop" (System.Speech), ex. Hortense.
# Lit segments.json : [{ fichier, voix, vitesse, hauteur, texte }]. Appelé par generer_voix.js.
param([string]$Dir, [string]$Pause, [int]$SampleRate)

Add-Type -AssemblyName System.Speech
$segments = Get-Content -Raw -Encoding UTF8 (Join-Path $Dir 'segments.json') | ConvertFrom-Json
$format = New-Object System.Speech.AudioFormat.SpeechAudioFormatInfo(
    $SampleRate,
    [System.Speech.AudioFormat.AudioBitsPerSample]::Sixteen,
    [System.Speech.AudioFormat.AudioChannel]::Mono)

foreach ($segment in $segments) {
    $synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
    $synth.SelectVoice($segment.voix)
    $synth.SetOutputToWaveFile((Join-Path $Dir $segment.fichier), $format)
    $text = [System.Security.SecurityElement]::Escape($segment.texte) -replace '\.\.\.', ('<break time="' + $Pause + '"/>')
    $ssml = '<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="fr-FR">' +
            '<prosody pitch="' + $segment.hauteur + '" rate="' + $segment.vitesse + '">' + $text + '</prosody></speak>'
    $synth.SpeakSsml($ssml)
    $synth.Dispose()
}
