// Re-exports the active backend provider.
// To swap providers, change the import below to point at a different implementation.

import backend from './convex';

export default backend;

export type { IBackendProvider } from './IBackendProvider';
export type {
  Device,
  DeviceId,
  Document,
  DocumentId,
  StorageId,
  Transcription,
  TranscriptionId,
  Unsubscribe,
  UserId,
  User,
} from './types';