/**
 * Shared domain types / DTOs.
 * No provider-specific imports allowed here.
 */

// ---------------------------------------------------------------------------
// Primitive aliases
// ---------------------------------------------------------------------------

/** Opaque string ID – matches Convex's GenericId at runtime. */
export type ID = string;

// ---------------------------------------------------------------------------
// Domain entities
// ---------------------------------------------------------------------------

export interface User {
  _id: ID;
  _creationTime: number;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  image?: string;
  coverImage?: string;
  emailVerificationTime?: number;
  phoneVerificationTime?: number;
  isAnonymous?: boolean;
  color?: string;
  theme?: string;
  lastSeen?: number;
  fingerprint?: string;
  username?: string;
  usernameLowercase?: string;
  currentDocumentId?: string;
  minutesLeft?: number;
}

export interface Document {
  _id: ID;
  _creationTime: number;
  title: string;
  userId: string;
  description?: string;
  transcriptions: string[];
  transcriptionIds: string[];
  createdAt: number;
}

export interface Transcription {
  _id: ID;
  _creationTime: number;
  text: string;
  audioStorageId: string;
  documentId: string;
  indexInDocument?: number;
  createdAt: number;
}

export interface Device {
  _id: ID;
  _creationTime: number;
  fingerprint: string;
  userId?: string;
  createdAt: number;
}

// ---------------------------------------------------------------------------
// Input shapes (mirrors Convex mutation args)
// ---------------------------------------------------------------------------

export interface SignInWithPasswordArgs {
  email: string;
  password: string;
  /** 'password' provider flow: 'signIn' | 'signUp' */
  flow: 'signIn' | 'signUp';
  fingerprint?: string;
  loginType?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface SignInAnonymousArgs {
  fingerprint: string;
}

export interface SaveTranscriptionArgs {
  text: string;
  audioStorageId: string;
  documentId: string;
  index?: number;
}

export interface SetCurrentDocIdArgs {
  userId: string;
  docId: string;
}

export interface UpdateDeviceWithUserIdArgs {
  fingerprint: string;
  userId: string;
}

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------

/** Call to stop a real-time subscription. */
export type Unsubscribe = () => void;