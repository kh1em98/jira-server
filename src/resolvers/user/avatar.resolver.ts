import { GraphQLUpload } from 'graphql-upload';
import { Arg, Mutation, Resolver } from 'type-graphql';
import { authService } from '../../services/index';
import { Upload } from '../../types/Upload';

@Resolver()
export class ProfilePictureResolver {
  @Mutation(() => Boolean)
  async addProfilePicture(
    @Arg('picture', () => GraphQLUpload)
    file: Upload,
  ) {
    try {
      await authService.uploadSingleFile(file);
      return true;
    } catch (error) {
      console.error('upload error : ', error);
      return false;
    }
  }

  @Mutation(() => Boolean)
  async uploadMultipleFiles(
    @Arg('pictures', () => [GraphQLUpload])
    files: Upload[],
  ): Promise<boolean> {
    try {
      await authService.uploadMultipleFiles(files);
      return true;
    } catch (error) {
      console.error('Upload multiple file errors : ', error);
      return false;
    }
  }
}
