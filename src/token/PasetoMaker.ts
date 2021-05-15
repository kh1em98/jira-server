import Paseto from 'paseto.js';
import { TokenMaker } from '../interfaces/TokenMaker';

export class PasetoMaker implements TokenMaker {
  private encoder = new Paseto.V2();
  private symmetricKey: string;

  async getSymmetricKey() {
    const sk = await this.encoder.symmetric();
    console.log('sk : ', sk);
  }

  createToken(userId: number, durationMs: number): string {
    throw new Error('Method not implemented.');
  }
  verifyToken(token: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
