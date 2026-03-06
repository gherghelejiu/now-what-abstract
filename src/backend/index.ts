/**
 * Active backend provider.
 *
 * To switch providers:
 *   1. Implement IBackendProvider in a new directory (e.g. src/backend/firebase/).
 *   2. Change the import below to point at the new provider's index.ts.
 *   3. Delete (or keep) the convex/ directory — nothing else in the app needs to change.
 */

export { default } from './convex/index';
export type { IBackendProvider } from './IBackendProvider';
export type {
  Unsubscribe,
  User,
  Task,
  CreateTaskParams,
  UpdateTaskParams,
  Recording,
  CreateRecordingParams,
  UploadUrlResult,
} from './types';