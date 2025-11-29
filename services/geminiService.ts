import { GoogleGenAI } from "@google/genai";
import { AnalysisType, VideoFile } from "../types";
import { ANALYSIS_OPTIONS } from "../constants";

export const analyzeVideo = async (
  video: VideoFile,
  analysisType: AnalysisType
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing in environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Find the specific prompt for the selected analysis type
  const option = ANALYSIS_OPTIONS.find(opt => opt.id === analysisType);
  const basePrompt = option ? option.prompt : "Analyze this video.";

  try {
    let contents = [];
    let tools = [];

    if (video.source === 'file' && video.base64Data && video.mimeType) {
      // Logic for uploaded files: Send visual data
      contents = [
        {
          parts: [
            {
              inlineData: {
                mimeType: video.mimeType,
                data: video.base64Data
              }
            },
            {
              text: basePrompt
            }
          ]
        }
      ];
    } else if (video.source === 'youtube' && video.youtubeUrl) {
      // Logic for YouTube: Send URL and enable Search
      // We instruct the model specifically about the URL context.
      const textPrompt = `I have provided a YouTube video URL below. 
      
      Video URL: ${video.youtubeUrl}
      
      Task: ${basePrompt}
      
      Please use the Google Search tool to find information, transcripts, or summaries about this video to answer the request accurately.`;

      contents = [
        {
          parts: [
            {
              text: textPrompt
            }
          ]
        }
      ];
      // Enable Google Search so the model can "watch" via reading about the video
      tools = [{ googleSearch: {} }];
    } else {
      throw new Error("Invalid video source provided.");
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: contents[0] as any, // Type assertion for flexibility with tool mix
      config: {
        tools: tools.length > 0 ? tools : undefined
      }
    });

    // Check for grounding metadata to ensure search worked (optional, but good for debugging)
    if (video.source === 'youtube' && response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
      console.log("Used grounding chunks:", response.candidates[0].groundingMetadata.groundingChunks);
    }

    return response.text || "No analysis generated. The model might not have found enough information about this video.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to analyze video.");
  }
};