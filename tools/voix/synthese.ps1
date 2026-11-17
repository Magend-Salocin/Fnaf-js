# Synthétise chaque segment de segments.json en WAV (seg_00.wav, seg_01.wav...).
# Appelé par generer_voix.js, qui prépare le dossier et les paramètres.
param(
    [string]$Dir,
    [string]$Voice,
    [string]$Rate,
    [string]$Pitch,
    [string]$Pause,
    [int]$SampleRate
)

Add-Type -AssemblyName System.Speech
$segments = Get-Content -Raw -Encoding UTF8 (Join-Path $Dir 'segments.json') | ConvertFrom-Json
$format = New-Object System.Speech.AudioFormat.SpeechAudioFormatInfo(
    $SampleRate,
    [System.Speech.AudioFormat.AudioBitsPerSample]::Sixteen,
    [System.Speech.AudioFormat.AudioChannel]::Mono)

$index = 0
foreach ($segment in $segments) {
    $synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
    $synth.SelectVoice($Voice)
    $synth.SetOutputToWaveFile((Join-Path $Dir ('seg_{0:D2}.wav' -f $index)), $format)
    $text = [System.Security.SecurityElement]::Escape($segment.text) -replace '\.\.\.', ('<break time="' + $Pause + '"/>')
    $ssml = '<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="fr-FR">' +
            '<prosody pitch="' + $Pitch + '" rate="' + $Rate + '">' + $text + '</prosody></speak>'
    $synth.SpeakSsml($ssml)
    $synth.Dispose()
    $index++
}
