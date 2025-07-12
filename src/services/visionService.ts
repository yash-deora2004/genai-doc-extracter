
import { AIServiceConfig, VisionAnalysisResult } from '@/types/aiService';

export class VisionService {
  private config: AIServiceConfig;

  constructor(config: AIServiceConfig) {
    this.config = config;
  }

  async analyzeDocument(
    fileData: string,
    query: string,
    documentType: string,
    ocrText: string
  ): Promise<VisionAnalysisResult & { modelUsed?: string }> {
    // Try OpenAI first, then fallback to Anthropic
    if (this.config.openaiApiKey) {
      return this.analyzeWithOpenAI(fileData, query, documentType, ocrText);
    } else if (this.config.anthropicApiKey) {
      return this.analyzeWithAnthropic(fileData, query, documentType, ocrText);
    } else {
      throw new Error('No vision AI API key configured');
    }
  }

  private async analyzeWithOpenAI(
    fileData: string,
    query: string,
    documentType: string,
    ocrText: string
  ): Promise<VisionAnalysisResult & { modelUsed: string }> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: this.buildPrompt(query, documentType, ocrText)
              },
              {
                type: 'image_url',
                image_url: {
                  url: fileData
                }
              }
            ]
          }
        ],
        max_tokens: 2000,
        temperature: 0.1
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content returned from OpenAI');
    }

    return {
      ...this.parseAIResponse(content, documentType),
      modelUsed: 'GPT-4 Vision'
    };
  }

  private async analyzeWithAnthropic(
    fileData: string,
    query: string,
    documentType: string,
    ocrText: string
  ): Promise<VisionAnalysisResult & { modelUsed: string }> {
    // Convert data URL to base64
    const base64Data = fileData.split(',')[1];
    const mediaType = fileData.split(';')[0].split(':')[1];

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': this.config.anthropicApiKey!,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mediaType,
                  data: base64Data
                }
              },
              {
                type: 'text',
                text: this.buildPrompt(query, documentType, ocrText)
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.content[0]?.text;

    if (!content) {
      throw new Error('No content returned from Anthropic');
    }

    return {
      ...this.parseAIResponse(content, documentType),
      modelUsed: 'Claude 3 Sonnet'
    };
  }

  private buildPrompt(query: string, documentType: string, ocrText: string): string {
    return `
You are an expert document analysis AI. Please analyze this document and extract structured information.

Document Type: ${documentType}
User Query: ${query}
OCR Text (if available): ${ocrText ? ocrText.substring(0, 1000) + '...' : 'Not available'}

Please extract information in JSON format. For document type "${documentType}", focus on:
- Key entities (names, dates, amounts, addresses)
- Document structure and layout
- Relevant data fields based on the document type
- Confidence in extraction accuracy

Return ONLY valid JSON without any markdown formatting or additional text.
`;
  }

  private parseAIResponse(content: string, documentType: string): VisionAnalysisResult {
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : content;
      
      const parsed = JSON.parse(jsonStr);
      
      return {
        documentType,
        confidence: 0.85, // Default confidence for successful parsing
        extractedText: parsed.extractedText || '',
        structuredData: parsed,
        metadata: {
          language: parsed.language || 'en',
          quality: 'high'
        }
      };
    } catch (error) {
      // Fallback parsing for non-JSON responses
      return {
        documentType,
        confidence: 0.6,
        extractedText: content,
        structuredData: {
          rawResponse: content,
          extractedText: content
        },
        metadata: {
          language: 'en',
          quality: 'medium'
        }
      };
    }
  }
}
