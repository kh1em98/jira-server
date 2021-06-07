import stream from 'stream';

export function uploadFromStream(s3, filename) {
  const pass = new stream.PassThrough();

  console.log('pass : ', pass);

  const params = {
    Bucket: process.env.BUCKET,
    Key: `${Date.now()}-${filename}`,
    Body: pass,
  };
  s3.upload(params, function (err, data) {
    console.log(err, data);
  });

  return pass;
}
