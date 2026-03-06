// ConvexProvider — implements IBackendProvider using the Convex SDK.
// All existing Convex call-sites are preserved here; only the structure changes.

import { ConvexClient } from 'convex/browser';
import { api } from '../../convex/_generated/api';
// TODO: remove if switching backend provider
import type { Id } from '../../convex/_generated/dataModel';

import type { IBackendProvider } from '../IBackendProvider';
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
} from '../types';

const CONVEX_URL = process.env.EXPO_PUBLIC_CONVEX_URL as string;

export class ConvexProvider implements IBackendProvider {
  // TODO: remove if switching backend provider
  private client: ConvexClient;

  constructor() {
    this.client = new ConvexClient(CONVEX_URL);
  }

  // ─── Devices ──────────────────────────────────────────────────────────────

  async findDeviceByFingerprint(fingerprint: string): Promise<Device | null> {
    const result = await this.client.query(api.devices.findDeviceByFingerprint, {
      fingerprint,
    });
    return (result as Device | null) ?? null;
  }

  async storeDevice(fingerprint: string): Promise<DeviceId> {
    const id = await this.client.mutation(api.devices.storeDevice, {
      fingerprint,
    });
    return id as unknown as DeviceId;
  }

  async updateDeviceWithUserId(
    fingerprint: string,
    userId: string
  ): Promise<DeviceId> {
    const id = await this.client.mutation(api.devices.updateDeviceWithUserId, {
      fingerprint,
      userId,
    });
    return id as unknown as DeviceId;
  }

  // ─── Documents ────────────────────────────────────────────────────────────

  async getDocumentById(documentId: DocumentId): Promise<Document | null> {
    const result = await this.client.query(api.documents.getDocumentById, {
      // TODO: remove if switching backend provider
      documentId: documentId as Id<'documents'>,
    });
    return (result as Document | null) ?? null;
  }

  async getDocumentsByUser(userId: UserId): Promise<Document[]> {
    const result = await this.client.query(api.documents.getDocumentsByUser, {
      userId,
    });
    return result as Document[];
  }

  subscribeToDocumentsByUser(
    userId: UserId,
    onChange: (documents: Document[]) => void
  ): Unsubscribe {
    // TODO: remove if switching backend provider
    const unsubscribe = this.client.onUpdate(
      api.documents.getDocumentsByUser,
      { userId },
      (result) => {
        onChange((result as Document[]) ?? []);
      }
    );
    return unsubscribe;
  }

  async setCurrentDocId(userId: UserId, docId: DocumentId): Promise<void> {
    await this.client.mutation(api.documents.setCurrentDocId, {
      userId,
      docId,
    });
  }

  // ─── Transcriptions ───────────────────────────────────────────────────────

  async saveTranscription(args: {
    text: string;
    audioStorageId: string;
    documentId: string;
    index?: number;
  }): Promise<TranscriptionId> {
    const id = await this.client.mutation(api.transcriptions.saveTranscription, {
      text: args.text,
      audioStorageId: args.audioStorageId,
      documentId: args.documentId,
      index: args.index,
    });
    return id as unknown as TranscriptionId;
  }

  async getTranscriptions(): Promise<Transcription[]> {
    const result = await this.client.query(api.transcriptions.getTranscriptions, {});
    return result as Transcription[];
  }

  subscribeToTranscriptions(
    onChange: (transcriptions: Transcription[]) => void
  ): Unsubscribe {
    // TODO: remove if switching backend provider
    const unsubscribe = this.client.onUpdate(
      api.transcriptions.getTranscriptions,
      {},
      (result) => {
        onChange((result as Transcription[]) ?? []);
      }
    );
    return unsubscribe;
  }

  // ─── Audio / Storage ──────────────────────────────────────────────────────

  async generateUploadUrl(): Promise<string> {
    const url = await this.client.mutation(api.transcriptions.generateUploadUrl, {});
    return url as string;
  }

  async transcribeAudio(storageId: StorageId): Promise<string> {
    const text = await this.client.action(api.transcribe.transcribeAudio, {
      // TODO: remove if switching backend provider
      storageId: storageId as Id<'_storage'>,
    });
    return text as string;
  }
}