import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import type { Request } from 'express';
import { AudioStreamSigner } from 'src/music/infrastructure/adapters/audio-stream-signer';

/**
 * Autorise une route `:id` via `?expires=&signature=` (URL signée par
 * `AudioStreamSigner`) au lieu du JWT, pour qu'un `<audio>` puisse la lire.
 */
@Injectable()
export class SignedAudioStreamGuard implements CanActivate {
  constructor(private readonly signer: AudioStreamSigner) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const { expires, signature } = request.query;

    const valid =
      typeof expires === 'string' &&
      typeof signature === 'string' &&
      this.signer.verify(request.params.id, Number(expires), signature);

    if (!valid) {
      throw new ForbiddenException('Invalid or expired signature');
    }

    return true;
  }
}
