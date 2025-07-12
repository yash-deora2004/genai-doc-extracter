
import { AIServiceConfig } from '@/types/aiService';

export class CLIPService {
  private config: AIServiceConfig;

  constructor(config: AIServiceConfig) {
    this.config = config;
  }

  async classifyDocument(fileData: string): Promise<string> {
    // Convert to blob for Hugging Face API
    const base64Data = fileData.split(',')[1];
    const blob = this.base64ToBlob(base64Data, 'image/jpeg');

    const formData = new FormData();
    formData.append('inputs', blob);

    const response = await fetch(
      'https://api-inference.huggingface.co/models/openai/clip-vit-large-patch14',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.huggingfaceApiKey}`,
        },
        body: formData
      }
    );

    if (!response.ok) {
      throw new Error(`CLIP API error: ${response.statusText}`);
    }

    const results = await response.json();
    
    // Map CLIP results to document types
    return this.mapToDocumentType(results);
  }

  private base64ToBlob(base64: string, mimeType: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }

  private mapToDocumentType(clipResults: any): string {
    // Simple mapping logic - in practice, this would be more sophisticated
    const text = JSON.stringify(clipResults).toLowerCase();
    
    if (text.includes('contract') || text.includes('legal')) {
      return 'legal-contract';
    } else if (text.includes('invoice') || text.includes('receipt')) {
      return 'financial-invoice';
    } else if (text.includes('medical') || text.includes('health')) {
      return 'medical-record';
    } else if (text.includes('technical') || text.includes('specification')) {
      return 'technical-specification';
    } else {
      return 'general';
    }
  }
}
