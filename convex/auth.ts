import { Anonymous } from "@convex-dev/auth/providers/Anonymous";
import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";

const PasswordProvider = Password({
//   crypto: {
//     hashSecret: hashPassword,
//     verifySecret: verifyPassword,
//   },
  validatePasswordRequirements: (password: string) => {
    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }
  },
  profile: (params: any) => {
    const email = params.email as string;
    const fingerprint = params.fingerprint as string;

    return {
      email,
      image: "",
      loginType: params.loginType as string,
      username: params.username || undefined,
      firstName: params.firstName || undefined,
      lastName: params.lastName || undefined,
      phone: params.phone || undefined,
      fingerprint: fingerprint,
    };
  },
//   reset: LoopsPasswordReset,
});

const AnonymousProvider = Anonymous({
    profile: (params: any) => {
        console.log('AnonymousProvider params: ', JSON.stringify(params));
        return {
            isAnonymous: true,
            fingerprint: params.fingerprint,
        };
    },
});

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [AnonymousProvider, PasswordProvider],
  callbacks: {
    async createOrUpdateUser(ctx: any, args: any) {
        console.log('createOrUpdateUser called. args: ', JSON.stringify(args));
        const fingerprint = args.profile?.fingerprint || args.params?.fingerprint;
      
        // // Check if this is an anonymous sign-in attempt
        // if (args.profile?.isAnonymous && fingerprint) {
        //     // Check if device already exists
        //     const existingDevice = await ctx.db
        //         .query("devices")
        //         .withIndex("by_fingerprint", (q: any) => 
        //             q.eq("fingerprint", fingerprint)
        //         )
        //         .first();
            
        //     if (existingDevice) {
        //         throw new Error("Device already registered");
        //     }
        // }
        
        // Let the default user creation happen
        const userId = args.existingUserId ?? (await ctx.db.insert("users", args.profile));
        console.log('userId: ', userId)
        const documentId = await ctx.db.insert("documents", {
          title: "Untitled Document",
          userId: userId,
          transcriptions: [],
          transcriptionIds: [],
          createdAt: Date.now(),
        });

        await ctx.db.patch(userId, { currentDocumentId: documentId });
        
        // Create device record for anonymous users
        if (args.profile?.isAnonymous && fingerprint) {
            await ctx.db.insert("devices", {
                fingerprint,
                userId,
                createdAt: Date.now(),
            });
        }

        return userId;
    }
  }
});