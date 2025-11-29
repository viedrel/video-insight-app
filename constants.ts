import { AnalysisType, AnalysisOption } from './types';

export const ANALYSIS_OPTIONS: AnalysisOption[] = [
  {
    id: AnalysisType.SUMMARY,
    label: "Summary",
    description: "Get a concise summary of the video content.",
    icon: "📝",
    prompt: "Analyze the uploaded video and provide a comprehensive summary of its content. Organize the summary with a main overview followed by bullet points for key details. PLEASE PROVIDE THE OUTPUT ENTIRELY IN TURKISH."
  },
  {
    id: AnalysisType.FLASHCARDS,
    label: "Flashcards",
    description: "Generate study flashcards from the video.",
    icon: "🗂️",
    prompt: "Create a set of study flashcards based on the information in this video. Format the output strictly as a list where each item has a 'Front' (Question/Concept) and a 'Back' (Answer/Explanation). Use markdown for clear separation. PLEASE PROVIDE THE OUTPUT ENTIRELY IN TURKISH."
  },
  {
    id: AnalysisType.KEY_LESSONS,
    label: "Key Lessons",
    description: "Extract the main educational points or life lessons.",
    icon: "🎓",
    prompt: "Identify and list the key lessons, takeaways, or educational points from this video. Explain why each lesson is important based on the video context. PLEASE PROVIDE THE OUTPUT ENTIRELY IN TURKISH."
  },
  {
    id: AnalysisType.QUIZ,
    label: "Quiz",
    description: "Generate a multiple-choice quiz.",
    icon: "❓",
    prompt: "Generate a multiple-choice quiz (5 questions) based on the video content. Provide the question, 4 options (A, B, C, D), and then reveal the correct answer with a brief explanation for each. PLEASE PROVIDE THE OUTPUT ENTIRELY IN TURKISH."
  },
  {
    id: AnalysisType.TRANSCRIPT_HIGHLIGHTS,
    label: "Highlights",
    description: "Extract key quotes and timestamps.",
    icon: "⏱️",
    prompt: "List the most significant quotes or moments from the video. If visual timestamps are visible or inferable, include estimated timestamps. Focus on the most impactful parts of the dialogue or visual narrative. PLEASE PROVIDE THE OUTPUT ENTIRELY IN TURKISH."
  }
];

export const MAX_FILE_SIZE_MB = 20; // Client-side limit for Base64 safety