/**
 * Provider-agnostic backend interface.
 *
 * Rules:
 *  - One async method per logical operation.
 *  - Subscription methods return Unsubscribe.
 *  - No imports from 'convex/*' or any other provider SDK.
 */

import type {
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

export interface IBackendProvider {
  // -------------------------------------------------------------------------
  // Auth
  // -------------------------------------------------------------------------

  /**
   * Sign in (or sign up) with email + password.
   * Resolves when the auth round-trip is complete.
   */
  signInWithPassword(args: SignInWithPasswordArgs): Promise<void>;

  /**
   * Sign in anonymously using a device fingerprint.
   */
  signInAnonymous(args: SignInAnonymousArgs): Promise<void>;

  /**
   * Sign out the current user.
   */
  signOut(): Promise<void>;

  // -------------------------------------------------------------------------
  // Users
  // -------------------------------------------------------------------------

  /**
   * Return the currently authenticated user, or null when unauthenticated.
   * One-shot fetch (not reactive).
   */
  getCurrentUser(): Promise<User | null>;

  /**
   * Subscribe to the currently authenticated user.
   * The callback is invoked immediately with the current value and again on
   * every change.
   *
   * @returns Unsubscribe function.
   */
  subscribeCurrentUser(
    callback: (user: User | null) => void,
  ): Unsubscribe;

  /**
   * Look up a user by device fingerprint.
   */
  getUserByFingerprint(fingerprint: string): Promise<User | null>;

  /**
   * Subscribe to a user looked up by device fingerprint.
   *
   * @returns Unsubscribe function.
   */
  subscribeUserByFingerprint(
    fingerprint: string,
    callback: (user: User | null) => void,
  ): Unsubscribe;

  // -------------------------------------------------------------------------
  // Documents
  // -------------------------------------------------------------------------

  /**
   * Fetch a single document by its ID.
   */
  getDocumentById(documentId: ID): Promise<Document | null>;

  /**
   * Subscribe to a single document by its ID.
   *
   * @returns Unsubscribe function.
   */
  subscribeDocumentById(
    documentId: ID,
    callback: (doc: Document | null) => void,
  ): Unsubscribe;

  /**
   * Fetch all documents belonging to a user (descending order).
   */
  getDocumentsByUser(userId: string): Promise<Document[]>;

  /**
   * Subscribe to all documents belonging to a user.
   *
   * @returns Unsubscribe function.
   */
  subscribeDocumentsByUser(
    userId: string,
    callback: (docs: Document[]) => void,
  ): Unsubscribe;

  /**
   * Set the user's currently active document ID.
   */
  setCurrentDocId(args: SetCurrentDocIdArgs): Promise<void>;

  // -------------------------------------------------------------------------
  // Transcriptions
  // -------------------------------------------------------------------------

  /**
   * Persist a completed transcription and return its new ID.
   */
  saveTranscription(args: SaveTranscriptionArgs): Promise<ID>;

  /**
   * Fetch all transcriptions (descending order).
   */
  getTranscriptions(): Promise<Transcription[]>;

  /**
   * Subscribe to all transcriptions.
   *
   * @returns Unsubscribe function.
   */
  subscribeTranscriptions(
    callback: (transcriptions: Transcription[]) => void,
  ): Unsubscribe;

  // -------------------------------------------------------------------------
  // Storage
  // -------------------------------------------------------------------------

  /**
   * Generate a pre-signed upload URL for binary storage.
   */
  generateUploadUrl(): Promise<string>;

  // -------------------------------------------------------------------------
  // Transcribe (AI action)
  // -------------------------------------------------------------------------

  /**
   * Transcribe audio identified by its storage ID.
   * Returns the transcribed text string.
   */
  transcribeAudio(storageId: ID): Promise<string>;

  // -------------------------------------------------------------------------
  // Devices
  // -------------------------------------------------------------------------

  /**
   * Find a device record by fingerprint, or return null.
   */
  findDeviceByFingerprint(fingerprint: string): Promise<Device | null>;

  /**
   * Subscribe to a device record by fingerprint.
   *
   * @returns Unsubscribe function.
   */
  subscribeDeviceByFingerprint(
    fingerprint: string,
    callback: (device: Device | null) => void,
  ): Unsubscribe;

  /**
   * Ensure a device record exists for this fingerprint.
   * Returns the device's ID.
   */
  storeDevice(fingerprint: string): Promise<ID>;

  /**
   * Associate a device fingerprint with a user ID.
   * Returns the device's ID.
   */
  updateDeviceWithUserId(args: UpdateDeviceWithUserIdArgs): Promise<ID>;
}