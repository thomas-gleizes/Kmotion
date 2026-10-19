import { AudioStreamSigner } from 'src/music/infrastructure/adapters/audio-stream-signer';

const DAY_MS = 24 * 60 * 60 * 1000;
const now = Date.UTC(2026, 9, 19, 15, 30);

describe('AudioStreamSigner', () => {
  const signer = new AudioStreamSigner();

  it('accepts its own signature for the same music', () => {
    const { expires, signature } = signer.sign('music-1', now);

    expect(signer.verify('music-1', expires, signature, now)).toBe(true);
  });

  it('keeps the same url for a whole day', () => {
    const morning = signer.sign('music-1', Date.UTC(2026, 9, 19, 0, 1));
    const evening = signer.sign('music-1', Date.UTC(2026, 9, 19, 23, 59));

    expect(morning).toEqual(evening);
  });

  it('stays valid at least 24 hours', () => {
    const { expires } = signer.sign('music-1', now);

    expect(expires - now).toBeGreaterThanOrEqual(DAY_MS);
    expect(expires - now).toBeLessThanOrEqual(2 * DAY_MS);
  });

  it('rejects a signature issued for another music', () => {
    const { expires, signature } = signer.sign('music-1', now);

    expect(signer.verify('music-2', expires, signature, now)).toBe(false);
  });

  it('rejects a tampered expiration', () => {
    const { expires, signature } = signer.sign('music-1', now);

    expect(signer.verify('music-1', expires + DAY_MS, signature, now)).toBe(
      false,
    );
  });

  it('rejects an expired signature', () => {
    const { expires, signature } = signer.sign('music-1', now);

    expect(signer.verify('music-1', expires, signature, expires)).toBe(false);
  });

  it('rejects a malformed signature', () => {
    const { expires } = signer.sign('music-1', now);

    expect(signer.verify('music-1', expires, 'nope', now)).toBe(false);
    expect(signer.verify('music-1', NaN, 'nope', now)).toBe(false);
  });
});
