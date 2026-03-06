import { v } from "convex/values";
import { action } from "./_generated/server";

export const transcribeAudio = action({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error("OpenAI API key not configured");
    }

    // Get the audio file from Convex storage
    const audioBlob = await ctx.storage.get(args.storageId);
    
    if (!audioBlob) {
      throw new Error("Audio file not found in storage");
    }

    // Create form data for Whisper API
    const formData = new FormData();
    const file = new File([audioBlob], 'audio.m4a', { 
        type: 'audio/m4a' 
    });
        
    formData.append('file', file);
    formData.append('model', 'whisper-1');
    formData.append('language', 'en'); // Force English transcription


    // Call OpenAI Whisper API
    const response = await fetch(
      "https://api.openai.com/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Transcription failed: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('returning: ', JSON.stringify(result));

    return result.text;
  },
});