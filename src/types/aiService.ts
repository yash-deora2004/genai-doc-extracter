
export interface AIServiceConfig {
  openaiApiKey?: string;
  anthropicApiKey?: string;
  huggingfaceApiKey?: string;
}

export interface VisionAnalysisResult {
  documentType: string;
  confidence: number;
  extractedText: string;
  structuredData: any;
  metadata: {
    pageCount?: number;
    language?: string;
    quality?: 'high' | 'medium' | 'low';
  };
}

export interface OCRResult {
  text: string;
  confidence: number;
  boundingBoxes?: Array<{
    text: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
}

export interface NLPResult {
  entities: Array<{
    text: string;
    label: string;
    confidence: number;
  }>;
  keywords: string[];
  summary?: string;
}

export interface AIProcessingResult {
  success: boolean;
  data?: any;
  confidence: number;
  processingTime: number;
  modelsUsed: string[];
  error?: string;
}

export type ProcessingStep = 'uploading' | 'analyzing' | 'extracting' | 'structuring' | 'completed' | 'error';
