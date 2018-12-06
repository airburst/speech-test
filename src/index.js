const speech = require('@google-cloud/speech');
const fs = require('file-system');
const path = require('path');
require('dotenv-safe').config();

const BUCKET = process.env.BUCKET;

function main() {
  // Creates a client
  const client = new speech.SpeechClient();

  // // The name of the audio file to transcribe
  // const fileName = path.join(__dirname, 'resources/iphone.m4a');

  // // Reads a local audio file and converts it to base64
  // const file = fs.readFileSync(fileName);
  // const audioBytes = file.toString('base64');

  // The audio file's encoding, sample rate in hertz, and BCP-47 language code
  const audio = {
    // content: audioBytes,
    uri: `${BUCKET}/test2.wav`
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

  // Detects speech in the audio file with async transcription
  client
    .longRunningRecognize(request)
    .then(data => {
      const operation = data[0];
      return operation.promise();
    })
    .then(data => {
      const response = data[0];
      const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
      console.log(`Transcription: ${transcription}`);
    })
    .catch(err => {
      console.error('ERROR:', err);
      /**
       * {
       *   code, metadata, details, note  // details is most useful
       * }
       */
    });
}

main();


