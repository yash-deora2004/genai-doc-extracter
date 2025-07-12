import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DocumentUpload from './DocumentUpload';
import QueryInput from './QueryInput';
import ProcessingStatus from './ProcessingStatus';
import ResultsDisplay from './ResultsDisplay';
import ExtractionConfig from './ExtractionConfig';
import { ProcessedDocument } from '@/types/document';
import { ExtractionRequirement } from '@/types/extraction';
import { useAIProcessing } from '@/hooks/useAIProcessing';
import { AIServiceConfig } from '@/types/aiService';

const DocumentProcessor = () => {
  const [documents, setDocuments] = useState<File[]>([]);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ProcessedDocument | null>(null);
  const [extractionConfig, setExtractionConfig] = useState<ExtractionRequirement | null>(null);

  // AI Service configuration - ADD YOUR API KEYS HERE
  const aiConfig: AIServiceConfig = {
    // Replace 'your-openai-api-key-here' with your actual OpenAI API key
    openaiApiKey: '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',
    
    // Replace 'your-anthropic-api-key-here' with your actual Anthropic API key (optional)
    anthropicApiKey: 'your-anthropic-api-key-here',
    
    // Replace 'your-huggingface-api-key-here' with your actual Hugging Face API key (optional)
    huggingfaceApiKey: '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',
    
    // Alternative: You can also use localStorage (comment out the lines above and uncomment these)
    // openaiApiKey: localStorage.getItem('openai_api_key') || undefined,
    // anthropicApiKey: localStorage.getItem('anthropic_api_key') || undefined,
    // huggingfaceApiKey: localStorage.getItem('huggingface_api_key') || undefined,
  };

  const {
    processingStep,
    progress,
    error,
    processDocument,
    reset
  } = useAIProcessing(aiConfig);

  const handleDocumentUpload = (files: File[]) => {
    setDocuments(files);
    setResults(null);
    reset();
  };

  // New flow: Step 1 - Configure extraction, Step 2 - Upload, Step 3 - Results
  const [step, setStep] = useState<'config' | 'upload'>('config');

  const handleConfigChange = (config: ExtractionRequirement) => {
    setExtractionConfig(config);
    setStep('upload');
  };

  const handleQuerySubmit = async (queryText: string) => {
    setQuery(queryText);
    if (documents.length === 0) return;

    const result = await processDocument(documents[0], queryText, extractionConfig);
    
    if (result && result.success) {
      const processedDoc: ProcessedDocument = {
        filename: documents[0].name,
        extractedData: result.data,
        confidence: result.confidence,
        processingTime: result.processingTime,
        aiModelsUsed: result.modelsUsed
      };
      setResults(processedDoc);
    }
  };

  const handleBackToConfig = () => {
    setStep('config');
    setDocuments([]);
    setResults(null);
    setQuery('');
    reset();
  };

  // Check if at least one API key is configured (not the placeholder)
  const hasApiKeys = (aiConfig.openaiApiKey && aiConfig.openaiApiKey !== 'your-openai-api-key-here') ||
                     (aiConfig.anthropicApiKey && aiConfig.anthropicApiKey !== 'your-anthropic-api-key-here') ||
                     (aiConfig.huggingfaceApiKey && aiConfig.huggingfaceApiKey !== 'your-huggingface-api-key-here');

  if (!hasApiKeys) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="p-8 bg-white/10 backdrop-blur-sm border-white/20 text-center">
          <h2 className="text-2xl font-semibold text-white mb-4">API Configuration Required</h2>
          <p className="text-gray-300 mb-6">
            Please replace the placeholder API keys in the DocumentProcessor.tsx file with your actual API keys.
          </p>
          <div className="space-y-4 text-left max-w-2xl mx-auto">
            <div className="p-4 bg-black/20 rounded-lg">
              <h3 className="text-white font-medium mb-2">1. Open src/components/DocumentProcessor.tsx</h3>
              <p className="text-gray-400 text-sm">Find the aiConfig object around line 18</p>
            </div>
            <div className="p-4 bg-black/20 rounded-lg">
              <h3 className="text-white font-medium mb-2">2. Replace the placeholder values</h3>
              <p className="text-gray-400 text-sm">
                Replace 'your-openai-api-key-here' with your actual OpenAI API key
              </p>
            </div>
            <div className="p-4 bg-black/20 rounded-lg">
              <h3 className="text-white font-medium mb-2">3. Save the file</h3>
              <p className="text-gray-400 text-sm">The app will automatically reload with your API keys</p>
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-6">
            You need at least one API key (OpenAI recommended) to start processing documents.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {step === 'config' && (
        <Card className="p-8 bg-white/10 backdrop-blur-sm border-white/20 text-center">
          <h2 className="text-2xl font-semibold text-white mb-4">Configure Extraction</h2>
          <p className="text-gray-300 mb-6">
            Please configure what information you want to extract before uploading your document.
          </p>
          <div className="max-w-2xl mx-auto">
            <ExtractionConfig onConfigChange={handleConfigChange} />
          </div>
        </Card>
      )}
      {step === 'upload' && (
        <>
          <div className="mb-4 flex justify-end">
            <button
              onClick={handleBackToConfig}
              className="px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/80 transition"
            >
              Back to Extraction Config
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
              <h2 className="text-2xl font-semibold text-white mb-4">Upload Documents</h2>
              <DocumentUpload onUpload={handleDocumentUpload} />
            </Card>
            <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
              <h2 className="text-2xl font-semibold text-white mb-4">Extraction Query</h2>
              <QueryInput 
                onSubmit={handleQuerySubmit} 
                disabled={documents.length === 0 || (processingStep !== 'idle' && processingStep !== 'completed')}
              />
            </Card>
          </div>
          <div className="mt-8">
            {processingStep !== 'idle' && processingStep !== 'completed' && (
              <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20 mb-8">
                <ProcessingStatus 
                  state={processingStep === 'error' ? 'idle' : 
                         processingStep === 'uploading' ? 'processing' :
                         processingStep === 'analyzing' ? 'analyzing' :
                         processingStep === 'extracting' ? 'extracting' :
                         'completed'}
                />
              </Card>
            )}
            {results && (
              <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
                <ResultsDisplay results={results} query={query} />
              </Card>
            )}
            {processingStep === 'idle' && !results && (
              <Card className="p-12 bg-white/5 backdrop-blur-sm border-white/10 text-center">
                <p className="text-gray-400 text-lg">No results to display yet.</p>
                <p className="text-gray-500 text-sm mt-2">Upload documents and run extraction to see results here.</p>
              </Card>
            )}
            {error && (
              <Card className="p-6 bg-red-500/10 backdrop-blur-sm border-red-500/20">
                <h3 className="text-red-400 font-semibold mb-2">Processing Error</h3>
                <p className="text-red-300">{error}</p>
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DocumentProcessor;
