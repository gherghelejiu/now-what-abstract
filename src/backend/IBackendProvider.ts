// Provider interface — no convex/* imports

import type {
  Document,
  GetDocumentByIdParams,
  GetDocumentsByUserParams,
  SaveTranscriptionParams,
  SetCurrentDocIdParams,
  SignInParams,
  SignInResult,
  Transcription,
  Unsubscribe,
  User,
} from './types';

export interface IBackendProvider {
  // ─── Auth ──────────────────────────────────────────────────────────────────

  /**
   * Sign in or sign up with the password provider.
   */
  signIn(provider: 'password', params: SignInParams): Promise<SignInResult>;

  /**
   * Sign out the current user.
   */
  signOut(): Promise<void>;

  // ─── Users ─────────────────────────────────────────────────────────────────

  /**
   * Fetch the currently authenticated user once.
   */
  getCurrentUser(): Promise<User | null>;

  /**
   * Subscribe to the currently authenticated user.
   * Calls `callback` whenever the value changes.
   * Returns an unsubscribe function.
   */
  subscribeCurrentUser(callback: (user: User | null) => void): Unsubscribe;

  // ─── Documents ─────────────────────────────────────────────────────────────

  /**
   * Fetch all documents belonging to a user.
   */
  getDocumentsByUser(params: GetDocumentsByUserParams): Promise<Document[]>;

  /**
   * Subscribe to documents belonging to a user.
   */
  subscribeDocumentsByUser(
    params: GetDocumentsByUserParams,
    callback: (docs: Document[]) => void
  ): Unsubscribe;

  /**
   * Fetch a single document by its ID.
   */
  getDocumentById(params: GetDocumentByIdParams): Promise<Document | null>;

  /**
   * Subscribe to a single document by its ID.
   */
  subscribeDocumentById(
    params: GetDocumentByIdParams,
    callback: (doc: Document | null) => void
  ): Unsubscribe;

  /**
   * Set the current active document for a user.
   */
  setCurrentDocId(params: SetCurrentDocIdParams): Promise<void>;

  // ─── Storage ───────────────────────────────────────────────────────────────

  /**
   * Generate a pre-signed upload URL for audio storage.
   */
  generateUploadUrl(): Promise<string>;

  // ─── Transcriptions ────────────────────────────────────────────────────────

  /**
   * Run the transcription action on an uploaded audio file.
   */
  transcribeAudio(params: { storageId: string }): Promise<string>;

  /**
   * Persist a completed transcription.
   */
  saveTranscription(params: SaveTranscriptionParams): Promise<void>;
}