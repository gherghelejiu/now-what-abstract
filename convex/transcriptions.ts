import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const saveTranscription = mutation({
  args: {
    text: v.string(),
    audioStorageId: v.string(),
    documentId: v.string(),
    index: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const transcriptionId = await ctx.db.insert("transcriptions", {
      text: args.text,
      audioStorageId: args.audioStorageId,
      documentId: args.documentId,
      indexInDocument: args.index,
      createdAt: Date.now(),
    });
    return transcriptionId;
  },
});

export const getTranscriptions = query({
  handler: async (ctx) => {
    return await ctx.db.query("transcriptions").order("desc").collect();
  },
});