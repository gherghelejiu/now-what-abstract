// Provider interface — one method per logical operation.
// No imports from 'convex/*' allowed here.

import type {
  Device,
  DeviceId,
  Document,
  DocumentId,
  StorageId,
  Transcription,
  TranscriptionId,
  Unsubscribe,
  UserId,
} from './types';

export interface IBackendProvider {
  // ─── Devices ────────────────────────────────────────────────────────────────

  /** Find a device record by its fingerprint. Returns null if not found. */
  findDeviceByFingerprint(fingerprint: string): Promise<Device | null>;

  /** Store a new device (or return existing id if already stored). */
  storeDevice(fingerprint: string): Promise<DeviceId>;

  /** Associate a device fingerprint with a user id. */
  updateDeviceWithUserId(fingerprint: string, userId: string): Promise<DeviceId>;

  // ─── Documents ──────────────────────────────────────────────────────────────

  /** Fetch a single document by its id. */
  getDocumentById(documentId: DocumentId): Promise<Document | null>;

  /** Fetch all documents belonging to a user, ordered newest-first. */
  getDocumentsByUser(userId: UserId): Promise<Document[]>;

  /** Subscribe to all documents for a user. Calls onChange whenever the list changes. */
  subscribeToDocumentsByUser(
    userId: UserId,
    onChange: (documents: Document[]) => void
  ): Unsubscribe;

  /** Set the currently-active document id on a user record. */
  setCurrentDocId(userId: UserId, docId: DocumentId): Promise<void>;

  // ─── Transcriptions ─────────────────────────────────────────────────────────

  /** Persist a transcription record and return its new id. */
  saveTranscription(args: {
    text: string;
    audioStorageId: string;
    documentId: string;
    index?: number;
  }): Promise<TranscriptionId>;

  /** Fetch all transcriptions ordered newest-first. */
  getTranscriptions(): Promise<Transcription[]>;

  /** Subscribe to all transcriptions. Calls onChange whenever data changes. */
  subscribeToTranscriptions(
    onChange: (transcriptions: Transcription[]) => void
  ): Unsubscribe;

  // ─── Audio / Storage ────────────────────────────────────────────────────────

  /** Request a short-lived upload URL for storing an audio file. */
  generateUploadUrl(): Promise<string>;

  /** Trigger server-side transcription of an already-uploaded audio file. */
  transcribeAudio(storageId: StorageId): Promise<string>;
}