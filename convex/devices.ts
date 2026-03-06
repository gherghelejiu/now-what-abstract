import { v } from "convex/values";
import { mutation, query } from "./_generated/server";


export const findDeviceByFingerprint = query({
    args: {
        fingerprint: v.string()
    },
    handler: async (ctx, { fingerprint }) => {
        return await ctx.db.query('devices').withIndex(
            'by_fingerprint', (q) => q.eq('fingerprint', fingerprint)
        ).unique();
    },
});

export const storeDevice = mutation({
    args: {
        fingerprint: v.string()
    },
    handler: async (ctx, { fingerprint }) => {
        const existing = await ctx.db.query('devices').withIndex(
            'by_fingerprint', (q) => q.eq('fingerprint', fingerprint)
        ).unique();

        if (existing) {
            return existing._id;
        }

        return await ctx.db.insert('devices', {
            fingerprint,
            createdAt: Date.now(),
        });
    },
});

export const updateDeviceWithUserId = mutation({
    args: {
        fingerprint: v.string(),
        userId: v.string(),
    },
    handler: async (ctx, { fingerprint, userId }) => {
        const device = await ctx.db.query('devices').withIndex(
            'by_fingerprint', (q) => q.eq('fingerprint', fingerprint)
        ).unique();

        if (!device) {
            throw new Error(`No device found with fingerprint: ${fingerprint}`);
        }

        await ctx.db.patch(device._id, { userId });

        return device._id;
    }
});