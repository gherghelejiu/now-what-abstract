// Shared domain types / DTOs — no provider imports

export type User = {
  _id: string;
  _creationTime?: number;
  fingerprint?: string;
  isAnonymous?: boolean;
  name?: string;
  email?: string;
  [key: string]: unknown;
};

export type Device = {
  _id: string;
  _creationTime?: number;
  fingerprint?: string;
  [key: string]: unknown;
};

export type Unsubscribe = () => void;