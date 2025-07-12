
import { OCRResult } from '@/types/aiService';

export class OCRService {
  private worker: any = null;

  async extractText(fileData: string): Promise<OCRResult> {
    try {
      // Dynamic import of Tesseract
      const Tesseract = await import('tesseract.js');
      
      const { data } = await Tesseract.recognize(fileData, 'eng', {
        logger: m => console.log('OCR Progress:', m)
      });

      return {
        text: data.text,
        confidence: data.confidence,
        boundingBoxes: data.words?.map((word: any) => ({
          text: word.text,
          x: word.bbox?.x0 || 0,
          y: word.bbox?.y0 || 0,
          width: word.bbox ? word.bbox.x1 - word.bbox.x0 : 0,
          height: word.bbox ? word.bbox.y1 - word.bbox.y0 : 0
        })) || []
      };
    } catch (error) {
      console.error('OCR processing failed:', error);
      throw new Error('OCR text extraction failed');
    }
  }

  async cleanup() {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
    }
  }
}
