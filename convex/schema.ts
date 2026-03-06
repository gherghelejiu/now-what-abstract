import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  users: defineTable({
    name: v.optional(v.string()),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    image: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    color: v.optional(v.string()),
    theme: v.optional(v.string()),
    lastSeen: v.optional(v.number()),
    fingerprint: v.optional(v.string()),
    username: v.optional(v.string()),
    usernameLowercase: v.optional(v.string()),

    currentDocumentId: v.optional(v.string()),
    minutesLeft: v.optional(v.number()),
  }).index("by_email", ["email"])
    .searchIndex("search_email", {
      searchField: "email",
      filterFields: ["email"],
    })
    .index("by_fingerprint", ["fingerprint"]),
  // 
  documents: defineTable({
    title: v.string(),
    userId: v.string(),
    description: v.optional(v.string()),
    transcriptions: v.array(v.string()),
    transcriptionIds: v.array(v.string()),
    createdAt: v.number(),
  }).index('by_user', ['userId']),
  // 
  transcriptions: defineTable({
    text: v.string(),
    audioStorageId: v.string(),
    documentId: v.string(),
    indexInDocument: v.optional(v.number()),
    createdAt: v.number(),
  }),
  // 
  devices: defineTable({
    fingerprint: v.string(),
    userId: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_fingerprint", ["fingerprint"]),
});