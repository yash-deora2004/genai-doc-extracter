
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  FileText, 
  Receipt, 
  Settings, 
  Heart, 
  PenTool, 
  ChevronRight,
  Database,
  Code,
  Table
} from 'lucide-react';
import { DocumentTypeTemplate, ExtractionRequirement, DOCUMENT_TEMPLATES } from '@/types/extraction';

interface ExtractionConfigProps {
  onConfigChange: (config: ExtractionRequirement) => void;
}

const ExtractionConfig: React.FC<ExtractionConfigProps> = ({ onConfigChange }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTypeTemplate | null>(null);
  const [outputFormats, setOutputFormats] = useState<('json' | 'xml' | 'csv')[]>(['json']);
  const [confidenceThreshold, setConfidenceThreshold] = useState([75]);
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [preserveStructure, setPreserveStructure] = useState(false);

  const getIcon = (iconName: string) => {
    const icons = {
      FileText,
      Receipt,
      Settings,
      Heart,
      PenTool
    };
    const IconComponent = icons[iconName as keyof typeof icons] || FileText;
    return <IconComponent className="w-5 h-5" />;
  };

  const handleTemplateSelect = (template: DocumentTypeTemplate) => {
    setSelectedTemplate(template);
    const config: ExtractionRequirement = {
      documentType: template.id,
      outputFormats,
      confidenceThreshold: confidenceThreshold[0],
      includeMetadata,
      preserveStructure
    };
    onConfigChange(config);
  };

  const handleOutputFormatChange = (format: 'json' | 'xml' | 'csv', checked: boolean) => {
    const newFormats = checked 
      ? [...outputFormats, format]
      : outputFormats.filter(f => f !== format);
    
    setOutputFormats(newFormats);
    if (selectedTemplate) {
      onConfigChange({
        documentType: selectedTemplate.id,
        outputFormats: newFormats,
        confidenceThreshold: confidenceThreshold[0],
        includeMetadata,
        preserveStructure
      });
    }
  };

  const groupedTemplates = DOCUMENT_TEMPLATES.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, DocumentTypeTemplate[]>);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">Data Extraction Configuration</h2>
        <p className="text-gray-300">Select document type and configure extraction parameters</p>
      </div>

      <Tabs defaultValue="templates" className="w-full">
        <TabsList className="grid w-full grid-cols-1 bg-white/10">
          <TabsTrigger value="templates">Document Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="templates" className="space-y-6">
          {Object.entries(groupedTemplates).map(([category, templates]) => (
            <div key={category} className="space-y-3">
              <h3 className="text-lg font-medium text-white capitalize text-center">
                {category} Documents
              </h3>
              <div className="flex justify-center">
                <div className="flex flex-col gap-4 w-full max-w-xl">
                  {templates.map((template) => (
                    <Card 
                      key={template.id}
                      className={`p-4 cursor-pointer transition-all duration-200 ${
                        selectedTemplate?.id === template.id
                          ? 'bg-blue-500/20 border-blue-400'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="text-blue-400 mt-1">
                          {getIcon(template.icon)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-white mb-1">{template.name}</h4>
                          <p className="text-sm text-gray-300 mb-3">{template.description}</p>
                          <div className="space-y-2">
                            <div className="flex flex-wrap gap-1">
                              {template.fields.slice(0, 3).map((field) => (
                                <Badge 
                                  key={field.id} 
                                  variant="secondary" 
                                  className="text-xs bg-white/10 text-gray-300"
                                >
                                  {field.name}
                                </Badge>
                              ))}
                              {template.fields.length > 3 && (
                                <Badge variant="secondary" className="text-xs bg-white/10 text-gray-300">
                                  +{template.fields.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </TabsContent>
        {/* Output Settings tab and Output Formats section removed */}
      </Tabs>

      {/* Extraction Settings moved below */}
      <Card className="p-6 bg-white/5 border-white/10">
        <h3 className="text-lg font-medium text-white mb-4">Extraction Settings</h3>
        <div className="space-y-6">
          <div>
            <Label className="text-white mb-3 block">
              Confidence Threshold: {confidenceThreshold[0]}%
            </Label>
            <Slider
              value={confidenceThreshold}
              onValueChange={setConfidenceThreshold}
              max={100}
              min={50}
              step={5}
              className="w-full"
            />
            <p className="text-xs text-gray-400 mt-2">
              Minimum confidence level for extracted data
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="metadata"
              checked={includeMetadata}
              onCheckedChange={(checked) => setIncludeMetadata(!!checked)}
            />
            <Label htmlFor="metadata" className="text-white">
              Include extraction metadata
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="structure"
              checked={preserveStructure}
              onCheckedChange={(checked) => setPreserveStructure(!!checked)}
            />
            <Label htmlFor="structure" className="text-white">
              Preserve original document structure
            </Label>
          </div>
        </div>
      </Card>

      {selectedTemplate && (
        <Card className="p-6 bg-white/5 border-white/10">
          <h3 className="text-lg font-medium text-white mb-4">Selected Template: {selectedTemplate.name}</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-blue-400 mb-2">Fields to Extract:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedTemplate.fields.map((field) => (
                  <div key={field.id} className="p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white font-medium">{field.name}</span>
                      <Badge 
                        variant={field.required ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {field.required ? 'Required' : 'Optional'}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-400">{field.description}</p>
                    <span className="text-xs text-blue-400 capitalize">{field.type}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-blue-400 mb-2">Sample Queries:</h4>
              <div className="space-y-2">
                {selectedTemplate.sampleQueries.map((query, index) => (
                  <div key={index} className="p-2 bg-white/5 rounded text-sm text-gray-300">
                    {query}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ExtractionConfig;
