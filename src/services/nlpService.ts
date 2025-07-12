
import { AIServiceConfig, NLPResult } from '@/types/aiService';

export class NLPService {
  private config: AIServiceConfig;

  constructor(config: AIServiceConfig) {
    this.config = config;
  }

  async enhanceExtraction(structuredData: any, rawText: string): Promise<NLPResult> {
    if (!rawText.trim()) {
      return {
        entities: [],
        keywords: [],
        summary: ''
      };
    }

    try {
      // Use Hugging Face NLP models for entity recognition
      const entities = await this.extractEntities(rawText);
      const keywords = await this.extractKeywords(rawText);
      const summary = await this.generateSummary(rawText);

      return {
        entities,
        keywords,
        summary
      };
    } catch (error) {
      console.warn('NLP enhancement failed:', error);
      return {
        entities: [],
        keywords: this.extractSimpleKeywords(rawText),
        summary: rawText.substring(0, 200) + '...'
      };
    }
  }

  private async extractEntities(text: string): Promise<Array<{ text: string; label: string; confidence: number }>> {
    if (!this.config.huggingfaceApiKey) {
      return [];
    }

    const response = await fetch(
      'https://api-inference.huggingface.co/models/dbmdz/bert-large-cased-finetuned-conll03-english',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.huggingfaceApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: text.substring(0, 1000) // Limit text length for API
        })
      }
    );

    if (!response.ok) {
      throw new Error(`NER API error: ${response.statusText}`);
    }

    const results = await response.json();
    
    return results.map((entity: any) => ({
      text: entity.word,
      label: entity.entity_group || entity.entity,
      confidence: entity.score
    }));
  }

  private async extractKeywords(text: string): Promise<string[]> {
    // Simple keyword extraction as fallback
    return this.extractSimpleKeywords(text);
  }

  private async generateSummary(text: string): Promise<string> {
    if (!this.config.huggingfaceApiKey || text.length < 100) {
      return text.substring(0, 200) + '...';
    }

    try {
      const response = await fetch(
        'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.config.huggingfaceApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: text.substring(0, 1000),
            parameters: {
              max_length: 150,
              min_length: 50
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Summarization API error: ${response.statusText}`);
      }

      const results = await response.json();
      return results[0]?.summary_text || text.substring(0, 200) + '...';
    } catch (error) {
      return text.substring(0, 200) + '...';
    }
  }

  private extractSimpleKeywords(text: string): string[] {
    // Simple keyword extraction using word frequency
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3);

    const wordCount: { [key: string]: number } = {};
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });

    return Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);
  }
}
