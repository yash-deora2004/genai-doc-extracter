
import { VisionService } from './visionService';
import { OCRService } from './ocrService';
import { CLIPService } from './clipService';
import { NLPService } from './nlpService';
import { AIServiceConfig, AIProcessingResult, ProcessingStep } from '@/types/aiService';
import { ExtractionRequirement, DocumentTypeTemplate } from '@/types/extraction';

export class AIService {
  private visionService: VisionService;
  private ocrService: OCRService;
  private clipService: CLIPService;
  private nlpService: NLPService;
  private config: AIServiceConfig;

  constructor(config: AIServiceConfig) {
    this.config = config;
    this.visionService = new VisionService(config);
    this.ocrService = new OCRService();
    this.clipService = new CLIPService(config);
    this.nlpService = new NLPService(config);
  }

  async processDocument(
    file: File,
    query: string,
    extractionConfig: ExtractionRequirement | null,
    onProgress?: (step: ProcessingStep, progress: number) => void
  ): Promise<AIProcessingResult> {
    const startTime = Date.now();
    const modelsUsed: string[] = [];

    try {
      onProgress?.('uploading', 0);

      // Convert file to base64 for API consumption
      const fileData = await this.preprocessFile(file);
      onProgress?.('analyzing', 20);

      // Step 1: Document type detection using CLIP
      let documentType = 'general';
      if (extractionConfig?.documentType) {
        documentType = extractionConfig.documentType;
      } else {
        try {
          documentType = await this.clipService.classifyDocument(fileData);
          modelsUsed.push('CLIP Document Classifier');
        } catch (error) {
          console.warn('CLIP classification failed, using general template');
        }
      }

      onProgress?.('analyzing', 40);

      // Step 2: OCR text extraction
      let ocrResult;
      try {
        ocrResult = await this.ocrService.extractText(fileData);
        modelsUsed.push('Tesseract OCR');
      } catch (error) {
        console.warn('OCR failed:', error);
        ocrResult = { text: '', confidence: 0 };
      }

      onProgress?.('extracting', 60);

      // Step 3: Vision AI analysis
      let visionResult;
      try {
        visionResult = await this.visionService.analyzeDocument(
          fileData,
          query,
          documentType,
          ocrResult.text
        );
        modelsUsed.push(visionResult.modelUsed || 'GPT-4 Vision');
      } catch (error) {
        console.warn('Vision analysis failed:', error);
        // Fallback to OCR-only processing
        visionResult = {
          structuredData: { extractedText: ocrResult.text },
          confidence: ocrResult.confidence * 0.5
        };
      }

      onProgress?.('structuring', 80);

      // Step 4: NLP enhancement
      let nlpResult;
      try {
        nlpResult = await this.nlpService.enhanceExtraction(
          visionResult.structuredData,
          ocrResult.text
        );
        modelsUsed.push('Named Entity Recognition');
      } catch (error) {
        console.warn('NLP enhancement failed:', error);
      }

      onProgress?.('completed', 100);

      // Combine results
      const finalData = this.combineResults(
        visionResult.structuredData,
        nlpResult,
        extractionConfig
      );

      const processingTime = Date.now() - startTime;
      const confidence = this.calculateConfidence(visionResult, ocrResult, nlpResult);

      return {
        success: true,
        data: finalData,
        confidence,
        processingTime,
        modelsUsed
      };

    } catch (error) {
      onProgress?.('error', 0);
      return {
        success: false,
        confidence: 0,
        processingTime: Date.now() - startTime,
        modelsUsed,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  private async preprocessFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  private combineResults(visionData: any, nlpData: any, config: ExtractionRequirement | null) {
    if (!visionData) return {};

    // Enhance vision data with NLP insights
    if (nlpData) {
      visionData.entities = nlpData.entities;
      visionData.keywords = nlpData.keywords;
      if (nlpData.summary) {
        visionData.summary = nlpData.summary;
      }
    }

    return visionData;
  }

  private calculateConfidence(visionResult: any, ocrResult: any, nlpResult: any): number {
    let totalConfidence = 0;
    let factors = 0;

    if (visionResult?.confidence) {
      totalConfidence += visionResult.confidence * 0.6; // Vision AI is primary
      factors += 0.6;
    }

    if (ocrResult?.confidence) {
      totalConfidence += (ocrResult.confidence / 100) * 0.3; // OCR confidence is 0-100
      factors += 0.3;
    }

    if (nlpResult) {
      totalConfidence += 0.8 * 0.1; // NLP adds stability
      factors += 0.1;
    }

    return factors > 0 ? Math.min(totalConfidence / factors, 1) : 0.5;
  }
}
