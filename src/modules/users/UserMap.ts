import { User } from './../../entity/User';
import { UserDTO } from './UserDTO';
export class UserMap {
  private hashFunc: any;

  constructor(hashFunc: any) {
    this.hashFunc = hashFunc;
  }

  public static toDTO(user: User): UserDTO {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      image: user.image,
    };
  }
}
