
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Code, Table } from 'lucide-react';
import { ProcessedDocument, ExportFormat } from '@/types/document';
import { exportData } from '@/utils/dataExport';

interface ResultsDisplayProps {
  results: ProcessedDocument;
  query: string;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, query }) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat['type']>('json');

  const exportFormats: ExportFormat[] = [
    { type: 'json', label: 'JSON', icon: 'Code' },
    { type: 'xml', label: 'XML', icon: 'FileText' },
    { type: 'csv', label: 'CSV', icon: 'Table' }
  ];

  const handleExport = (format: ExportFormat['type']) => {
    const exportedData = exportData(results.extractedData, format);
    const blob = new Blob([exportedData], { 
      type: format === 'json' ? 'application/json' : 
           format === 'xml' ? 'application/xml' : 'text/csv' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `extracted_data.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatJsonDisplay = (data: any) => {
    return JSON.stringify(data, null, 2);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">Extraction Results</h2>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-green-500/20 text-green-400">
            {Math.round(results.confidence * 100)}% Confidence
          </Badge>
          <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
            {(results.processingTime / 1000).toFixed(1)}s
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-white/5 rounded-lg">
          <p className="text-sm text-gray-400">Document</p>
          <p className="text-white">{results.filename}</p>
        </div>
        <div className="p-4 bg-white/5 rounded-lg">
          <p className="text-sm text-gray-400">Query</p>
          <p className="text-white truncate">{query}</p>
        </div>
        <div className="p-4 bg-white/5 rounded-lg">
          <p className="text-sm text-gray-400">AI Models Used</p>
          <p className="text-white">{results.aiModelsUsed.length} models</p>
        </div>
      </div>

      <Tabs defaultValue="preview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white/10">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="json">JSON</TabsTrigger>
          <TabsTrigger value="xml">XML</TabsTrigger>
          <TabsTrigger value="csv">CSV</TabsTrigger>
        </TabsList>
        
        <TabsContent value="preview" className="space-y-4">
          <div className="p-6 bg-white/5 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Structured Data Preview</h3>
            <div className="space-y-3">
              {Object.entries(results.extractedData).map(([key, value]) => (
                <div key={key} className="flex flex-col space-y-1">
                  <span className="text-sm font-medium text-blue-400 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </span>
                  <span className="text-white pl-4">
                    {Array.isArray(value) ? (
                      <ul className="list-disc list-inside space-y-1">
                        {value.map((item, index) => (
                          <li key={index} className="text-gray-300">
                            {typeof item === 'object' ? JSON.stringify(item) : String(item)}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      String(value)
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="json">
          <div className="p-6 bg-black/20 rounded-lg">
            <pre className="text-green-400 text-sm overflow-x-auto">
              <code>{formatJsonDisplay(results.extractedData)}</code>
            </pre>
          </div>
        </TabsContent>
        
        <TabsContent value="xml">
          <div className="p-6 bg-black/20 rounded-lg">
            <pre className="text-blue-400 text-sm overflow-x-auto">
              <code>{exportData(results.extractedData, 'xml')}</code>
            </pre>
          </div>
        </TabsContent>
        
        <TabsContent value="csv">
          <div className="p-6 bg-black/20 rounded-lg">
            <pre className="text-yellow-400 text-sm overflow-x-auto">
              <code>{exportData(results.extractedData, 'csv')}</code>
            </pre>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex flex-wrap gap-3">
        {exportFormats.map((format) => (
          <Button
            key={format.type}
            variant="outline"
            onClick={() => handleExport(format.type)}
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Download className="w-4 h-4 mr-2" />
            Export as {format.label}
          </Button>
        ))}
      </div>

      <div className="p-4 bg-white/5 rounded-lg">
        <h4 className="text-sm font-medium text-white mb-2">AI Models Used:</h4>
        <div className="flex flex-wrap gap-2">
          {results.aiModelsUsed.map((model, index) => (
            <Badge key={index} variant="secondary" className="bg-purple-500/20 text-purple-400">
              {model}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;
