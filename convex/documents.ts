import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";


export const getDocumentById = query({
    args: {
        documentId: v.id('documents'),
    },
    handler: async (ctx, args) => {
        return ctx.db.get(args.documentId);
    },
});

export const getDocumentsByUser = query({
    args: {
        userId: v.string(),
    },
    handler: async (ctx, args) => {
        return ctx.db.query('documents')
            .withIndex('by_user', (q) => q.eq('userId', args.userId))
            .order('desc')
            .collect();
    },
});

export const setCurrentDocId = mutation({
    args: {
        userId: v.string(),
        docId: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.userId as Id<'users'>, {
            currentDocumentId: args.docId,
        });
    },
});