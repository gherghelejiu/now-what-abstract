// Shared domain types / DTOs — no provider-specific imports

export type DeviceId = string;
export type UserId = string;
export type DocumentId = string;
export type TranscriptionId = string;
export type StorageId = string;

export interface Device {
  _id: DeviceId;
  fingerprint: string;
  userId?: string;
  createdAt: number;
}

export interface Document {
  _id: DocumentId;
  title: string;
  userId: string;
  description?: string;
  transcriptions: string[];
  transcriptionIds: string[];
  createdAt: number;
}

export interface Transcription {
  _id: TranscriptionId;
  text: string;
  audioStorageId: string;
  documentId: string;
  indexInDocument?: number;
  createdAt: number;
}

export interface User {
  _id: UserId;
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

/** Unsubscribe function returned by real-time subscription methods */
export type Unsubscribe = () => void;