
export type ProcessingState = 'idle' | 'processing' | 'analyzing' | 'extracting' | 'completed';

export interface ProcessedDocument {
  filename: string;
  extractedData: any;
  confidence: number;
  processingTime: number;
  aiModelsUsed: string[];
}

export interface ExportFormat {
  type: 'json' | 'xml' | 'csv';
  label: string;
  icon: string;
}
