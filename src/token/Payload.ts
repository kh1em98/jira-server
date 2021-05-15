import { Payload } from '../interfaces/Payload';
export function createPayload(userId: number, durationMs: number) {
  const now = Date.now();

  const payload: Payload = {
    userId,
    issuedAt: now,
    expiredAt: now + durationMs,
  };

  return payload;
}
