import React, { useState } from 'react';
import { VideoUploader } from './components/VideoUploader';
import { AnalysisSelector } from './components/AnalysisSelector';
import { ResultDisplay } from './components/ResultDisplay';
import { VideoFile, AnalysisType } from './types';
import { analyzeVideo } from './services/geminiService';
import { Loader2, Video, BrainCircuit } from 'lucide-react';

const App: React.FC = () => {
  const [video, setVideo] = useState<VideoFile | null>(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisType>(AnalysisType.SUMMARY);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!video) return;

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const markdown = await analyzeVideo(video, selectedAnalysis);
      setResult(markdown);
    } catch (err: any) {
      setError(err.message || "Something went wrong during analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleVideoSelect = (newVideo: VideoFile | null) => {
    setVideo(newVideo);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-50 selection:bg-blue-500/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20">
            <Video className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Video Insight
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-10 space-y-12">
        
        {/* Intro */}
        <section className="text-center space-y-4 py-4">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Unlock the knowledge in your <span className="text-blue-500">videos</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Upload a video or use a YouTube link to generate summaries, flashcards, quizzes, and more using Google's advanced multimodal AI.
          </p>
        </section>

        {/* 1. Upload Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-700 text-xs font-bold text-white">1</span>
            <h3 className="text-lg font-semibold text-slate-200">Select Video Source</h3>
          </div>
          <VideoUploader onVideoSelected={handleVideoSelect} selectedVideo={video} />
        </section>

        {/* 2. Analysis Selection */}
        <section className={`space-y-4 transition-opacity duration-300 ${!video ? 'opacity-50 pointer-events-none grayscale' : 'opacity-100'}`}>
           <div className="flex items-center gap-2 mb-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-700 text-xs font-bold text-white">2</span>
            <h3 className="text-lg font-semibold text-slate-200">Choose Insight Type</h3>
          </div>
          <AnalysisSelector 
            selectedType={selectedAnalysis} 
            onSelect={setSelectedAnalysis} 
            disabled={!video || isAnalyzing}
          />
        </section>

        {/* Action Button */}
        <div className="flex justify-center pt-4">
          <button
            onClick={handleAnalyze}
            disabled={!video || isAnalyzing}
            className={`
              relative group overflow-hidden px-8 py-4 rounded-xl font-bold text-lg shadow-2xl transition-all duration-300
              ${!video || isAnalyzing 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:scale-105 hover:shadow-blue-500/30'
              }
            `}
          >
            <div className="flex items-center gap-3 relative z-10">
              {isAnalyzing ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  <span>Analyzing Video...</span>
                </>
              ) : (
                <>
                  <BrainCircuit size={24} />
                  <span>Generate Insights</span>
                </>
              )}
            </div>
            {/* Glow Effect */}
            {!isAnalyzing && video && (
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-center animate-in fade-in slide-in-from-bottom-2">
            <p className="font-medium">Error Analysis Failed</p>
            <p className="text-sm opacity-80">{error}</p>
          </div>
        )}

        {/* 3. Results Section */}
        {result && (
          <section className="scroll-mt-24 border-t border-slate-800 pt-10">
            <ResultDisplay markdown={result} type={selectedAnalysis} />
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#0f172a] mt-20 py-8 text-center text-slate-500 text-sm">
        <p>Built by Emre</p>
      </footer>
    </div>
  );
};

export default App;