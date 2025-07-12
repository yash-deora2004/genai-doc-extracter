
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Send } from 'lucide-react';

interface QueryInputProps {
  onSubmit: (query: string) => void;
  disabled?: boolean;
}

const QueryInput: React.FC<QueryInputProps> = ({ onSubmit, disabled }) => {
  const [query, setQuery] = useState('');

  const sampleQueries = [
    "Extract all contract parties, dates, and monetary values",
    "Find invoice details including vendor, amount, and line items",
    "Extract personal information and key dates from legal documents",
    "Identify technical specifications and requirements",
    "Extract handwritten notes and signatures"
  ];

  const handleSubmit = () => {
    if (query.trim()) {
      onSubmit(query.trim());
    }
  };

  const useSampleQuery = (sampleQuery: string) => {
    setQuery(sampleQuery);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-white">
          Describe what you want to extract:
        </label>
        <Textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., Extract all contract parties, dates, and monetary values from this legal document..."
          className="min-h-[100px] bg-white/5 border-white/20 text-white placeholder:text-gray-400"
          disabled={disabled}
        />
      </div>

      <div className="space-y-2">
        <p className="text-xs text-gray-400">Try these examples:</p>
        <div className="flex flex-wrap gap-2">
          {sampleQueries.map((sample, index) => (
            <Button
              key={index}
              size="sm"
              variant="outline"
              className="text-xs border-white/20 text-gray-300 hover:bg-white/10"
              onClick={() => useSampleQuery(sample)}
              disabled={disabled}
            >
              {sample}
            </Button>
          ))}
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={!query.trim() || disabled}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
      >
        <Sparkles className="w-4 h-4 mr-2" />
        {disabled ? 'Processing...' : 'Extract Data'}
        <Send className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
};

export default QueryInput;
