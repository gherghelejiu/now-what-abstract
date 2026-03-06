/**
 * Active backend provider.
 *
 * Swap the import below to switch providers without touching any call site.
 *
 * Example call site:
 *   import backend from '@/src/backend';
 *   const user = await backend.getCurrentUser();
 */

export { default } from './convex/index';

// Re-export types and the interface so call sites can import everything from
// one place if needed.
export type { IBackendProvider } from './IBackendProvider';
export type {
  Device,
  Document,
  ID,
  SaveTranscriptionArgs,
  SetCurrentDocIdArgs,
  SignInAnonymousArgs,
  SignInWithPasswordArgs,
  Transcription,
  Unsubscribe,
  UpdateDeviceWithUserIdArgs,
  User,
} from './types';