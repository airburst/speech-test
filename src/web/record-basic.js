const record = document.querySelector('.record');
const stop = document.querySelector('.stop');
const soundClips = document.querySelector('.sound-clips');
const mainSection = document.querySelector('.main-controls');

// disable stop button while not recording
stop.disabled = true;

if (navigator.mediaDevices.getUserMedia) {
  const constraints = { audio: true };
  let chunks = [];

  const onSuccess = stream => {
    const mediaRecorder = new MediaRecorder(stream);

    record.onclick = () => {
      mediaRecorder.start();
      record.style.background = "red";
      stop.disabled = false;
      record.disabled = true;
    }

    stop.onclick = () => {
      mediaRecorder.stop();
      record.style.background = "";
      record.style.color = "";
      // mediaRecorder.requestData();
      stop.disabled = true;
      record.disabled = false;
    }

    mediaRecorder.onstop = e => {
      const clipName = prompt('Enter a name for your sound clip?','My unnamed clip');
      const clipContainer = document.createElement('article');
      const clipLabel = document.createElement('p');
      const audio = document.createElement('audio');
      const deleteButton = document.createElement('button');

      clipContainer.classList.add('clip');
      audio.setAttribute('controls', '');
      deleteButton.textContent = 'Delete';
      deleteButton.className = 'delete';

      if(clipName === null) {
        clipLabel.textContent = 'My unnamed clip';
      } else {
        clipLabel.textContent = clipName;
      }

      clipContainer.appendChild(audio);
      clipContainer.appendChild(clipLabel);
      clipContainer.appendChild(deleteButton);
      soundClips.appendChild(clipContainer);

      audio.controls = true;
      // const blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
      const blob = new Blob(chunks, { 'type' : 'audio/webm; codecs=opus' });
      const audioURL = window.URL.createObjectURL(blob);

      // Upload to google bucket
      sendDataToBucket(blob, 'web-recording.webm'); //TODO: unique name

      chunks = [];
      audio.src = audioURL;

      deleteButton.onclick = e => {
        evtTgt = e.target;
        evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
      }

      clipLabel.onclick = () => {
        const existingName = clipLabel.textContent;
        const newClipName = prompt('Enter a new name for your sound clip?');
        if(newClipName === null) {
          clipLabel.textContent = existingName;
        } else {
          clipLabel.textContent = newClipName;
        }
      }
    }

    mediaRecorder.ondataavailable = e => chunks.push(e.data);
  }

  const onError = err => console.log('The following error occured: ' + err);

  navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);

} else {
   console.log('Audio recording is not supported on your browser!');
}
