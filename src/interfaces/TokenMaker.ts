import { User } from '../entity/User';
export interface TokenMaker {
  createToken(userId: number, durationMs: number): string;
  verifyToken(token: string): Promise<any>;
}
