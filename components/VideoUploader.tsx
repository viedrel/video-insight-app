
import React, { useState } from 'react';
import { VideoFile } from '../types';
import { MAX_FILE_SIZE_MB } from '../constants';
import { Upload, X, Film, Youtube, AlertCircle } from 'lucide-react';

interface VideoUploaderProps {
  onVideoSelected: (video: VideoFile | null) => void;
  selectedVideo: VideoFile | null;
}

type InputMode = 'upload' | 'youtube';

export const VideoUploader: React.FC<VideoUploaderProps> = ({ onVideoSelected, selectedVideo }) => {
  const [mode, setMode] = useState<InputMode>('upload');
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');

  // Extract Video ID from various YouTube URL formats
  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const processFile = (file: File) => {
    setError(null);
    
    if (!file.type.startsWith('video/')) {
      setError("Please upload a valid video file.");
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`File size exceeds ${MAX_FILE_SIZE_MB}MB limit for this demo.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const [prefix, base64Data] = result.split(',');
      const mimeType = prefix.match(/:(.*?);/)?.[1] || file.type;

      const videoFile: VideoFile = {
        source: 'file',
        label: file.name,
        fileSize: file.size,
        base64Data,
        mimeType,
        file
      };
      onVideoSelected(videoFile);
    };
    reader.onerror = () => setError("Failed to read file.");
    reader.readAsDataURL(file);
  };

  const processYoutubeUrl = () => {
    const id = getYoutubeId(youtubeUrl);
    
    if (!id) {
      setError("Invalid YouTube URL. Please use a standard YouTube link.");
      return;
    }

    setError(null);
    const videoFile: VideoFile = {
      source: 'youtube',
      label: `YouTube Video (${id})`,
      youtubeUrl: youtubeUrl,
      videoId: id
    };
    onVideoSelected(videoFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const clearVideo = () => {
    onVideoSelected(null);
    setError(null);
    setYoutubeUrl('');
  };

  if (selectedVideo) {
    return (
      <div className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-6 flex items-center gap-4 shadow-xl">
        <div className={`p-4 rounded-full flex items-center justify-center shrink-0 ${selectedVideo.source === 'file' ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-500'}`}>
           {selectedVideo.source === 'file' ? <Film size={32} /> : <Youtube size={32} />}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-slate-200 truncate">{selectedVideo.label}</h3>
          <p className="text-sm text-slate-400 truncate">
             {selectedVideo.source === 'file' && selectedVideo.fileSize 
               ? `${(selectedVideo.fileSize / (1024 * 1024)).toFixed(1)} MB`
               : selectedVideo.youtubeUrl}
          </p>
        </div>

        <button 
          onClick={clearVideo}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-colors shrink-0"
          title="Remove video"
        >
          <X size={24} />
        </button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex p-1 bg-slate-800/50 rounded-xl w-fit border border-slate-700/50">
        <button
          onClick={() => { setMode('upload'); setError(null); }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'upload' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          File Upload
        </button>
        <button
          onClick={() => { setMode('youtube'); setError(null); }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'youtube' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          YouTube Link
        </button>
      </div>

      {mode === 'upload' ? (
        <label 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            flex flex-col items-center justify-center w-full h-64 
            border-2 border-dashed rounded-2xl cursor-pointer 
            transition-all duration-300 ease-in-out
            ${isDragging 
              ? 'border-blue-500 bg-blue-500/10' 
              : 'border-slate-600 bg-slate-800/50 hover:bg-slate-800 hover:border-slate-500'
            }
          `}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <div className={`p-4 rounded-full mb-4 ${isDragging ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700 text-slate-400'}`}>
              <Upload size={32} />
            </div>
            <p className="mb-2 text-sm text-slate-200 font-medium">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-slate-400">MP4, WebM, MOV (Max {MAX_FILE_SIZE_MB}MB)</p>
          </div>
          <input type="file" className="hidden" accept="video/*" onChange={handleChange} />
        </label>
      ) : (
        <div className="w-full h-64 bg-slate-800/30 border border-slate-700 rounded-2xl p-6 flex flex-col justify-center items-center gap-4">
          <div className="w-full max-w-md space-y-2">
            <label className="text-sm font-medium text-slate-300">Enter YouTube URL</label>
            <div className="relative">
              <input
                type="text"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 pl-11 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
              />
              <Youtube className="absolute left-3.5 top-3.5 text-slate-500" size={20} />
            </div>
          </div>
          <button
            onClick={processYoutubeUrl}
            disabled={!youtubeUrl}
            className={`
              flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all
              ${!youtubeUrl 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-500/20'
              }
            `}
          >
            <Film size={18} />
            Load Video
          </button>
           <p className="text-xs text-slate-500 text-center max-w-sm">
            Note: YouTube videos are analyzed using Search Grounding.
          </p>
        </div>
      )}

      {error && (
        <div className="mt-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-3">
          <AlertCircle size={18} className="shrink-0 mt-0.5" /> 
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
