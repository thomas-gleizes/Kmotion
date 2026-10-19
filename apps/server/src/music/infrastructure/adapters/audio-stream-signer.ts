import { Injectable } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { environment } from 'src/core/config/environment';

const DAY_MS = 24 * 60 * 60 * 1000;

export type AudioStreamSignature = { expires: number; signature: string };

/**
 * Signe les URLs de streaming audio : un `<audio src>` ne peut pas envoyer le
 * header `Authorization`, l'accès est donc porté par une signature HMAC
 * limitée à un titre et expirante.
 *
 * L'expiration est arrondie au jour (validité de 24 à 48 h) pour qu'un même
 * titre garde la même URL toute la journée : le cache HTTP du navigateur
 * (`immutable`) reste efficace d'une lecture à l'autre.
 */
@Injectable()
export class AudioStreamSigner {
  // Clé dérivée : une signature d'URL ne peut pas servir de JWT, ni l'inverse.
  private readonly key = createHmac('sha256', environment.JWT_SECRET)
    .update('audio-stream-url')
    .digest();

  sign(musicId: string, now = Date.now()): AudioStreamSignature {
    const expires = (Math.floor(now / DAY_MS) + 2) * DAY_MS;
    return { expires, signature: this.compute(musicId, expires) };
  }

  verify(
    musicId: string,
    expires: number,
    signature: string,
    now = Date.now(),
  ): boolean {
    if (!Number.isSafeInteger(expires) || expires <= now) return false;

    const expected = Buffer.from(this.compute(musicId, expires));
    const actual = Buffer.from(signature);
    return (
      actual.length === expected.length && timingSafeEqual(actual, expected)
    );
  }

  private compute(musicId: string, expires: number): string {
    return createHmac('sha256', this.key)
      .update(`${musicId}:${expires}`)
      .digest('base64url');
  }
}
