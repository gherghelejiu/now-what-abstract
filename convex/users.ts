import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { query } from "./_generated/server";

export const getUserByFingerprint = query({
    args: {
        fingerprint: v.string(),
    },
    handler: async (ctx, args) => {
      const users = await ctx.db.query('users')
        .withIndex('by_fingerprint', (q) => q.eq('fingerprint', args.fingerprint))
        .collect();

      return users.find((u) => !u.isAnonymous) ?? users[0] ?? null;
    },
});

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    return await ctx.db.get(userId);
  },
});

// export const getCurrentUser = query({
//   args: {},
//   handler: async (ctx) => {
//     const identity = await ctx.auth.getUserIdentity();

//     if (!identity) {
//       return null; // Not signed in
//     }

//     // If you store users in a "users" table, look them up:
//     const user = await ctx.db
//       .query("users")
//       .withIndex("by_token", (q) =>
//         q.eq("tokenIdentifier", identity.tokenIdentifier)
//       )
//       .unique();

//     return user;
//   },
// });