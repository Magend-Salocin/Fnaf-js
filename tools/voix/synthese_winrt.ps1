# Synthèse avec les voix Windows modernes (Windows.Media.SpeechSynthesis), ex. Julie, Paul.
# Lit segments.json : [{ fichier, voix, vitesse, texte }]. Appelé par generer_voix.js.
param([string]$Dir, [string]$Pause)

Add-Type -AssemblyName System.Runtime.WindowsRuntime
$null = [Windows.Media.SpeechSynthesis.SpeechSynthesizer, Windows.Media.SpeechSynthesis, ContentType = WindowsRuntime]
$null = [Windows.Storage.Streams.DataReader, Windows.Storage.Streams, ContentType = WindowsRuntime]

$asTask = [System.WindowsRuntimeSystemExtensions].GetMethods() |
    Where-Object { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1' } |
    Select-Object -First 1

function Await($operation, [Type]$resultType) {
    $task = $asTask.MakeGenericMethod($resultType).Invoke($null, @($operation))
    $task.Wait() | Out-Null
    $task.Result
}

$segments = Get-Content -Raw -Encoding UTF8 (Join-Path $Dir 'segments.json') | ConvertFrom-Json
$voices = [Windows.Media.SpeechSynthesis.SpeechSynthesizer]::AllVoices

foreach ($segment in $segments) {
    $synth = New-Object Windows.Media.SpeechSynthesis.SpeechSynthesizer
    $synth.Voice = $voices | Where-Object { $_.DisplayName -eq $segment.voix } | Select-Object -First 1
    if (-not $synth.Voice) { throw "Voix introuvable : $($segment.voix)" }
    $synth.Options.SpeakingRate = [double]$segment.vitesse

    $text = [System.Security.SecurityElement]::Escape($segment.texte) -replace '\.\.\.', ('<break time="' + $Pause + '"/>')
    $ssml = '<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="fr-FR">' + $text + '</speak>'

    $stream = Await ($synth.SynthesizeSsmlToStreamAsync($ssml)) ([Windows.Media.SpeechSynthesis.SpeechSynthesisStream])
    $reader = New-Object Windows.Storage.Streams.DataReader($stream.GetInputStreamAt(0))
    $size = [uint32]$stream.Size
    $null = Await ($reader.LoadAsync($size)) ([uint32])
    $bytes = New-Object byte[] $size
    $reader.ReadBytes($bytes)
    [System.IO.File]::WriteAllBytes((Join-Path $Dir $segment.fichier), $bytes)
    $synth.Dispose()
}
