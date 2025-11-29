import React from 'react';
import { ANALYSIS_OPTIONS } from '../constants';
import { AnalysisType } from '../types';
import { Check } from 'lucide-react';

interface AnalysisSelectorProps {
  selectedType: AnalysisType;
  onSelect: (type: AnalysisType) => void;
  disabled?: boolean;
}

export const AnalysisSelector: React.FC<AnalysisSelectorProps> = ({ selectedType, onSelect, disabled }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {ANALYSIS_OPTIONS.map((option) => {
        const isSelected = selectedType === option.id;
        return (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            disabled={disabled}
            className={`
              relative p-4 rounded-xl border text-left transition-all duration-200
              flex flex-col gap-2 group
              ${isSelected 
                ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.15)]' 
                : 'border-slate-700 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-800'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div className="flex items-start justify-between w-full">
              <span className="text-2xl mb-1">{option.icon}</span>
              <div className={`
                w-5 h-5 rounded-full border flex items-center justify-center transition-colors
                ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-slate-600 bg-slate-900'}
              `}>
                {isSelected && <Check size={12} className="text-white" />}
              </div>
            </div>
            
            <div>
              <h3 className={`font-semibold ${isSelected ? 'text-blue-400' : 'text-slate-200'}`}>
                {option.label}
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {option.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};
