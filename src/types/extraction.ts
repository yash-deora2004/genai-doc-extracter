
export interface ExtractionField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'array' | 'object';
  description: string;
  required: boolean;
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  };
}

export interface DocumentTypeTemplate {
  id: string;
  name: string;
  description: string;
  category: 'legal' | 'financial' | 'technical' | 'medical' | 'handwritten' | 'general';
  icon: string;
  fields: ExtractionField[];
  sampleQueries: string[];
  aiInstructions: string;
}

export interface ExtractionRequirement {
  documentType: string;
  customFields?: ExtractionField[];
  outputFormats: ('json' | 'xml' | 'csv')[];
  confidenceThreshold: number;
  includeMetadata: boolean;
  preserveStructure: boolean;
}

export const DOCUMENT_TEMPLATES: DocumentTypeTemplate[] = [
  {
    id: 'legal-contract',
    name: 'Legal Contracts',
    description: 'Extract key terms, parties, dates, and obligations from legal contracts',
    category: 'legal',
    icon: 'FileText',
    fields: [
      {
        id: 'parties',
        name: 'Contract Parties',
        type: 'array',
        description: 'Names and roles of all parties involved',
        required: true
      },
      {
        id: 'effective_date',
        name: 'Effective Date',
        type: 'date',
        description: 'When the contract becomes effective',
        required: true
      },
      {
        id: 'expiration_date',
        name: 'Expiration Date',
        type: 'date',
        description: 'When the contract expires',
        required: false
      },
      {
        id: 'contract_value',
        name: 'Contract Value',
        type: 'number',
        description: 'Total monetary value of the contract',
        required: false
      },
      {
        id: 'key_terms',
        name: 'Key Terms',
        type: 'array',
        description: 'Important clauses and conditions',
        required: true
      },
      {
        id: 'termination_clauses',
        name: 'Termination Clauses',
        type: 'array',
        description: 'Conditions under which contract can be terminated',
        required: false
      }
    ],
    sampleQueries: [
      'Extract all parties, effective dates, and contract values',
      'Find termination clauses and key obligations',
      'Identify payment terms and delivery schedules'
    ],
    aiInstructions: 'Focus on legal terminology, dates, monetary amounts, and contractual obligations. Pay attention to defined terms and cross-references.'
  },
  {
    id: 'financial-invoice',
    name: 'Financial Invoices',
    description: 'Extract invoice details, line items, and payment information',
    category: 'financial',
    icon: 'Receipt',
    fields: [
      {
        id: 'invoice_number',
        name: 'Invoice Number',
        type: 'text',
        description: 'Unique invoice identifier',
        required: true
      },
      {
        id: 'vendor_info',
        name: 'Vendor Information',
        type: 'object',
        description: 'Vendor name, address, and contact details',
        required: true
      },
      {
        id: 'client_info',
        name: 'Client Information',
        type: 'object',
        description: 'Client name, address, and contact details',
        required: true
      },
      {
        id: 'invoice_date',
        name: 'Invoice Date',
        type: 'date',
        description: 'Date the invoice was issued',
        required: true
      },
      {
        id: 'due_date',
        name: 'Due Date',
        type: 'date',
        description: 'Payment due date',
        required: true
      },
      {
        id: 'line_items',
        name: 'Line Items',
        type: 'array',
        description: 'Individual items with descriptions, quantities, and prices',
        required: true
      },
      {
        id: 'subtotal',
        name: 'Subtotal',
        type: 'number',
        description: 'Total before taxes and fees',
        required: true
      },
      {
        id: 'tax_amount',
        name: 'Tax Amount',
        type: 'number',
        description: 'Total tax amount',
        required: false
      },
      {
        id: 'total_amount',
        name: 'Total Amount',
        type: 'number',
        description: 'Final total amount due',
        required: true
      }
    ],
    sampleQueries: [
      'Extract all invoice details including vendor, client, and amounts',
      'Find line items with quantities and unit prices',
      'Identify payment terms and tax information'
    ],
    aiInstructions: 'Look for tabular data, monetary amounts, dates, and vendor/client information. Pay attention to tax calculations and payment terms.'
  },
  {
    id: 'technical-specification',
    name: 'Technical Specifications',
    description: 'Extract technical requirements, specifications, and parameters',
    category: 'technical',
    icon: 'Settings',
    fields: [
      {
        id: 'product_name',
        name: 'Product/System Name',
        type: 'text',
        description: 'Name of the technical product or system',
        required: true
      },
      {
        id: 'version',
        name: 'Version',
        type: 'text',
        description: 'Version or model number',
        required: false
      },
      {
        id: 'technical_specs',
        name: 'Technical Specifications',
        type: 'array',
        description: 'Detailed technical parameters and requirements',
        required: true
      },
      {
        id: 'performance_metrics',
        name: 'Performance Metrics',
        type: 'array',
        description: 'Performance benchmarks and measurements',
        required: false
      },
      {
        id: 'compatibility',
        name: 'Compatibility Requirements',
        type: 'array',
        description: 'System compatibility and integration requirements',
        required: false
      },
      {
        id: 'safety_standards',
        name: 'Safety Standards',
        type: 'array',
        description: 'Applicable safety standards and certifications',
        required: false
      }
    ],
    sampleQueries: [
      'Extract technical specifications and performance metrics',
      'Find compatibility requirements and safety standards',
      'Identify version information and technical parameters'
    ],
    aiInstructions: 'Focus on numerical specifications, technical terminology, standards compliance, and performance data. Look for tables and technical diagrams.'
  },
  {
    id: 'medical-record',
    name: 'Medical Records',
    description: 'Extract patient information, diagnoses, and treatment details',
    category: 'medical',
    icon: 'Heart',
    fields: [
      {
        id: 'patient_info',
        name: 'Patient Information',
        type: 'object',
        description: 'Patient demographics and identifiers',
        required: true
      },
      {
        id: 'visit_date',
        name: 'Visit Date',
        type: 'date',
        description: 'Date of medical visit or record',
        required: true
      },
      {
        id: 'diagnoses',
        name: 'Diagnoses',
        type: 'array',
        description: 'Primary and secondary diagnoses',
        required: true
      },
      {
        id: 'symptoms',
        name: 'Symptoms',
        type: 'array',
        description: 'Reported symptoms and observations',
        required: false
      },
      {
        id: 'treatments',
        name: 'Treatments',
        type: 'array',
        description: 'Prescribed treatments and procedures',
        required: false
      },
      {
        id: 'medications',
        name: 'Medications',
        type: 'array',
        description: 'Prescribed medications with dosages',
        required: false
      },
      {
        id: 'vital_signs',
        name: 'Vital Signs',
        type: 'object',
        description: 'Blood pressure, heart rate, temperature, etc.',
        required: false
      }
    ],
    sampleQueries: [
      'Extract patient information, diagnoses, and treatments',
      'Find prescribed medications and dosages',
      'Identify vital signs and test results'
    ],
    aiInstructions: 'Focus on medical terminology, patient identifiers, diagnostic codes, and treatment protocols. Handle confidential information appropriately.'
  },
  {
    id: 'handwritten-form',
    name: 'Handwritten Forms',
    description: 'Extract information from handwritten documents and forms',
    category: 'handwritten',
    icon: 'PenTool',
    fields: [
      {
        id: 'form_type',
        name: 'Form Type',
        type: 'text',
        description: 'Type or title of the form',
        required: true
      },
      {
        id: 'handwritten_fields',
        name: 'Handwritten Fields',
        type: 'array',
        description: 'All handwritten entries with field labels',
        required: true
      },
      {
        id: 'signatures',
        name: 'Signatures',
        type: 'array',
        description: 'Signature fields and their locations',
        required: false
      },
      {
        id: 'checkboxes',
        name: 'Checkboxes',
        type: 'array',
        description: 'Checkbox selections and their values',
        required: false
      },
      {
        id: 'dates',
        name: 'Dates',
        type: 'array',
        description: 'All date entries found in the document',
        required: false
      }
    ],
    sampleQueries: [
      'Extract all handwritten text and field values',
      'Identify signatures and checkbox selections',
      'Find dates and numerical entries'
    ],
    aiInstructions: 'Use advanced OCR for handwritten text recognition. Pay attention to form structure, field labels, and handwriting patterns.'
  }
];
