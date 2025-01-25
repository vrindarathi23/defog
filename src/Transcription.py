import assemblyai as aai

aai.settings.api_key = "50df82bede344799beffd4068d8cfb15"

transcriber = aai.Transcriber()

# You can use a local filepath:
# audio_file = "./example.mp3"

# Or use a publicly-accessible URL:
audio_file = (
    "test.mp4"
)

config = aai.TranscriptionConfig(speaker_labels=True)

transcript = transcriber.transcribe(audio_file, config)

if transcript.status == aai.TranscriptStatus.error:
    print(f"Transcription failed: {transcript.error}")
    exit(1)

print(transcript.text)

for utterance in transcript.utterances:
    print(f"Speaker {utterance.speaker}: {utterance.text}")