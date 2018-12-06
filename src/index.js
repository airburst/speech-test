const speech = require('@google-cloud/speech');
const fs = require('file-system');
const path = require('path');
require('dotenv-safe').config();

console.log(process.env.GOOGLE_APPLICATION_CREDENTIALS);

async function main() {
  // Creates a client
  const client = new speech.SpeechClient();

  // The name of the audio file to transcribe
  const fileName = path.join(__dirname, 'resources/test2.wav');

  try {
    // Reads a local audio file and converts it to base64
    const file = fs.readFileSync(fileName);
    const audioBytes = file.toString('base64');

    // The audio file's encoding, sample rate in hertz, and BCP-47 language code
    const audio = {
      content: audioBytes,
      // "uri": "gs://bucket-name/path_to_audio_file"
    };

    const config = {
      encoding: 'LINEAR16',
      sampleRateHertz: 44100,
      languageCode: 'en-GB',
      profanityFilter: false,
    };

    const request = {
      audio: audio,
      config: config,
    };

    // Detects speech in the audio file
    const [response] = await client.recognize(request);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
    console.log(`Transcription: ${transcription}`);
  } catch(err) {
    console.error(err);
    /**
     * {
     *   code, metadata, details, note  // details is most useful
     * }
     */
  }
}

main();


