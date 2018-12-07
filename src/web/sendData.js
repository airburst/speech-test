const BUCKET_URL = 'https://www.googleapis.com/upload/storage/v1/b/3cs-recordings-test/o?uploadType=media';

const sendDataToBucket = (blob, filename) => {
  const url = `${BUCKET_URL}&name=${filename}&key=AIzaSyAMVn3BDtu47sXEa3_F3ifbTCcBUBUkr80`;

  fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'audio/webm',
    },
    data: blob
  }).then((res) => {
    // console.log(res);
    return res.json();
  }).then((data) => {
    console.log('Uploaded', filename);
  });
};
