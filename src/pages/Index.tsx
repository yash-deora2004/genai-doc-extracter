
import React from 'react';
import DocumentProcessor from '@/components/DocumentProcessor';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            AI Document Intelligence
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Extract structured data from complex documents using advanced AI, OCR, and Vision-Language Models. 
            Simply describe what you want to extract in natural language.
          </p>
        </div>
        <DocumentProcessor />
      </div>
    </div>
  );
};

export default Index;
