/** Where the audio of a music stands in the converter service. */
export enum ConversionStatus {
  /** Queued on the converter, not started yet. */
  pending = 'pending',
  /** Being downloaded and converted. */
  processing = 'processing',
  ready = 'ready',
  failed = 'failed',
}
