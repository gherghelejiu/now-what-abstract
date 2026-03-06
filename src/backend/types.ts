// Shared domain types / DTOs — no provider imports

export type Unsubscribe = () => void;

// ─── User ────────────────────────────────────────────────────────────────────

export interface User {
  _id: string;
  _creationTime?: number;
  email?: string;
  name?: string;
  isAnonymous?: boolean;
  minutesLeft?: number;
  currentDocumentId?: string;
}

// ─── Document ────────────────────────────────────────────────────────────────

export interface Document {
  _id: string;
  _creationTime?: number;
  title: string;
  userId?: string;
}

// ─── Transcription ───────────────────────────────────────────────────────────

export interface Transcription {
  _id: string;
  audioStorageId: string;
  text: string;
  documentId: string;
  index: number;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface SignInParams {
  flow: 'signIn' | 'signUp';
  password: string;
  username: string;
  email: string;
  fingerprint: string;
}

export interface SignInResult {
  redirect?: string;
  verifier?: string;
  [key: string]: unknown;
}

// ─── Storage ─────────────────────────────────────────────────────────────────

export interface GenerateUploadUrlResult {
  uploadUrl: string;
}

// ─── Transcribe ──────────────────────────────────────────────────────────────

export interface TranscribeAudioParams {
  storageId: string;
}

export interface SaveTranscriptionParams {
  audioStorageId: string;
  text: string;
  documentId: string;
  index: number;
}

export interface SetCurrentDocIdParams {
  userId: string;
  docId: string;
}

export interface GetDocumentsByUserParams {
  userId: string;
}

export interface GetDocumentByIdParams {
  documentId: string;
}