import { Upload } from './../types/Upload';
import { s3 } from './../utils/createS3Instance';
import { PutObjectRequest } from 'aws-sdk/clients/s3';
import stream from 'stream';

export class AuthService {
  private uploadFromStream(s3, filename) {
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

  private uploadReadableStream(stream): Promise<any> {
    const params: PutObjectRequest = {
      Bucket: process.env.BUCKET!,
      Key: `${Date.now()}`,
      Body: stream,
    };
    return s3.upload(params).promise();
  }

  public uploadSingleFile(file: Upload): Promise<any> {
    const { createReadStream } = file;
    const readable = createReadStream();

    return this.uploadReadableStream(readable);
  }

  public uploadMultipleFiles(files: Upload[]): Promise<any> {
    return Promise.all(files.map(this.uploadSingleFile));
  }
}
