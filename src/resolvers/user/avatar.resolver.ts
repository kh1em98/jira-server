import { PutObjectRequest } from 'aws-sdk/clients/s3';
import { GraphQLUpload } from 'graphql-upload';
import { Stream } from 'stream';
import { Arg, Mutation, Resolver } from 'type-graphql';
import { s3 } from '../../utils/createS3Instance';

interface Upload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => Stream;
}

async function uploadReadableStream(stream) {
  const params: PutObjectRequest = {
    Bucket: process.env.BUCKET!,
    Key: `${Date.now()}`,
    Body: stream,
  };
  return s3.upload(params).promise();
}

@Resolver()
export class ProfilePictureResolver {
  @Mutation(() => Boolean)
  async addProfilePicture(
    @Arg('picture', () => GraphQLUpload)
    { createReadStream, filename }: Upload,
  ) {
    try {
      const readable = createReadStream();
      const result = await uploadReadableStream(readable);
      console.log('result : ', result);
      return true;
    } catch (error) {
      console.log('upload error : ', error);
      return false;
    }
  }

  @Mutation(() => Boolean)
  async uploadMultipleFile(
    @Arg('pictures', () => [GraphQLUpload])
    files: Upload[],
  ): Promise<boolean> {
    const process_upload = async (upload) => {
      const { createReadStream } = await upload;
      const stream = createReadStream();

      return uploadReadableStream(stream);
    };

    try {
      const result = await Promise.all(files.map(process_upload));
      console.log('result upload multiple file : ', result);
      return true;
    } catch (error) {
      console.log('Upload multiple file error : ', error);
      return false;
    }
  }
}
