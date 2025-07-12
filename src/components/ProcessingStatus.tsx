
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Brain, Eye, FileText, Zap } from 'lucide-react';
import { ProcessingState } from '@/types/document';

interface ProcessingStatusProps {
  state: ProcessingState;
}

const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ state }) => {
  const getProgress = () => {
    switch (state) {
      case 'processing': return 25;
      case 'analyzing': return 60;
      case 'extracting': return 85;
      case 'completed': return 100;
      default: return 0;
    }
  };

  const getStatusText = () => {
    switch (state) {
      case 'processing': return 'Processing document with OCR...';
      case 'analyzing': return 'Analyzing content with Vision AI...';
      case 'extracting': return 'Extracting structured data...';
      case 'completed': return 'Processing completed successfully!';
      default: return 'Ready to process';
    }
  };

  const getIcon = () => {
    switch (state) {
      case 'processing': return <FileText className="w-6 h-6" />;
      case 'analyzing': return <Eye className="w-6 h-6" />;
      case 'extracting': return <Brain className="w-6 h-6" />;
      case 'completed': return <Zap className="w-6 h-6" />;
      default: return <FileText className="w-6 h-6" />;
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-white">Processing Status</h2>
      
      <div className="flex items-center space-x-4">
        <div className="text-blue-400 animate-pulse">
          {getIcon()}
        </div>
        <div className="flex-1">
          <p className="text-white mb-2">{getStatusText()}</p>
          <Progress value={getProgress()} className="h-2" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className={`p-3 rounded-lg border ${state === 'processing' ? 'bg-blue-500/20 border-blue-400' : 'bg-white/5 border-white/10'}`}>
          <FileText className="w-5 h-5 text-white mb-2" />
          <p className="text-sm text-white">Tesseract OCR</p>
        </div>
        <div className={`p-3 rounded-lg border ${state === 'analyzing' ? 'bg-blue-500/20 border-blue-400' : 'bg-white/5 border-white/10'}`}>
          <Eye className="w-5 h-5 text-white mb-2" />
          <p className="text-sm text-white">Vision AI</p>
        </div>
        <div className={`p-3 rounded-lg border ${state === 'extracting' ? 'bg-blue-500/20 border-blue-400' : 'bg-white/5 border-white/10'}`}>
          <Brain className="w-5 h-5 text-white mb-2" />
          <p className="text-sm text-white">NLP Engine</p>
        </div>
        <div className={`p-3 rounded-lg border ${state === 'completed' ? 'bg-green-500/20 border-green-400' : 'bg-white/5 border-white/10'}`}>
          <Zap className="w-5 h-5 text-white mb-2" />
          <p className="text-sm text-white">Data Export</p>
        </div>
      </div>
    </div>
  );
};

export default ProcessingStatus;
