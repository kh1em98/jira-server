import { verify, sign } from 'jsonwebtoken';

import { TokenMaker } from '../interfaces/TokenMaker';
import { Payload } from '../interfaces/Payload';
import { createPayload } from './Payload';

const MIN_SECRET_KEY_SIZE = 32;

export class JwtMaker implements TokenMaker {
  private secretKey;
  constructor(_secretKey: string) {
    if (!_secretKey || _secretKey.length < MIN_SECRET_KEY_SIZE) {
      throw new Error('Secret key is invalid');
    }
    this.secretKey = _secretKey;
  }

  createToken(userId: number, durationMs: number): string {
    const payload: Payload = createPayload(userId, durationMs);

    return sign(payload, this.secretKey!, {
      expiresIn: durationMs,
    });
  }

  async verifyToken(token: string): Promise<any> {
    const decoded = await verify(token, this.secretKey!);

    if (!decoded) {
      return null;
    }

    return decoded;
  }
}
