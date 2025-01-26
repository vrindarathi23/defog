# The following file generates a transcript for any given videos
import assemblyai as aai

aai.settings.api_key = # PERSONAL KEY REDACTED

transcriber = aai.Transcriber()

# Transcriber class: generates text files for given videos
class Transcriber:
    def __init__(self):
        pass

    def transcribe(self, audio_file, text_file):
        config = aai.TranscriptionConfig(speaker_labels=True)
        transcript = transcriber.transcribe(audio_file, config)
        if transcript.status == aai.TranscriptStatus.error:
            print(f"Transcription failed: {transcript.error}")
            exit(1)
        with open(text_file, "a") as f:
            print(transcript.text, file=f)
            for utterance in transcript.utterances:
                print(f"Speaker {utterance.speaker}: {utterance.text}", file=f)
        if os.path.exists(audio_file):
            os.remove(audio_file)

# Defining main function for demonstration purposes
def main():
    transcribe_obj = Transcriber()
    transcribe_obj.transcribe("downloaded_videos/test.mp4", "transcribed_videos/test.txt")

# __name__
if __name__=="__main__":
    main()
