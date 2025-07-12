
import { useState, useCallback } from 'react';
import { AIService } from '@/services/aiService';
import { AIServiceConfig, ProcessingStep, AIProcessingResult } from '@/types/aiService';
import { ExtractionRequirement } from '@/types/extraction';
import { validateFileForProcessing, compressImageIfNeeded } from '@/utils/fileProcessing';

export const useAIProcessing = (config: AIServiceConfig) => {
  const [processingStep, setProcessingStep] = useState<ProcessingStep | 'idle'>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const processDocument = useCallback(async (
    file: File,
    query: string,
    extractionConfig: ExtractionRequirement | null
  ): Promise<AIProcessingResult | null> => {
    try {
      setError(null);
      setProcessingStep('uploading');
      setProgress(0);

      // Validate file
      const validation = validateFileForProcessing(file);
      if (!validation.valid) {
        setError(validation.error || 'Invalid file');
        setProcessingStep('error');
        return null;
      }

      // Compress if needed
      const processedFile = await compressImageIfNeeded(file);

      // Initialize AI service
      const aiService = new AIService(config);

      // Process document
      const result = await aiService.processDocument(
        processedFile,
        query,
        extractionConfig,
        (step, progressValue) => {
          setProcessingStep(step);
          setProgress(progressValue);
        }
      );

      if (!result.success) {
        setError(result.error || 'Processing failed');
        setProcessingStep('error');
        return null;
      }

      setProcessingStep('completed');
      setProgress(100);
      return result;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setProcessingStep('error');
      return null;
    }
  }, [config]);

  const reset = useCallback(() => {
    setProcessingStep('idle');
    setProgress(0);
    setError(null);
  }, []);

  return {
    processingStep,
    progress,
    error,
    processDocument,
    reset
  };
};
