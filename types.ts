
export enum AnalysisType {
  SUMMARY = 'SUMMARY',
  FLASHCARDS = 'FLASHCARDS',
  KEY_LESSONS = 'KEY_LESSONS',
  QUIZ = 'QUIZ',
  TRANSCRIPT_HIGHLIGHTS = 'TRANSCRIPT_HIGHLIGHTS'
}

export interface AnalysisOption {
  id: AnalysisType;
  label: string;
  description: string;
  icon: string;
  prompt: string;
}

export type VideoSource = 'file' | 'youtube';

export interface VideoFile {
  source: VideoSource;
  
  // Common used for display
  label: string; // fileName or Video Title/ID

  // File Upload Specific
  fileSize?: number;
  base64Data?: string;
  mimeType?: string;
  file?: File;

  // YouTube Specific
  youtubeUrl?: string;
  videoId?: string;
}

export interface AnalysisResult {
  markdown: string;
  type: AnalysisType;
}
