
export const exportData = (data: any, format: 'json' | 'xml' | 'csv'): string => {
  switch (format) {
    case 'json':
      return JSON.stringify(data, null, 2);
    
    case 'xml':
      return convertToXML(data);
    
    case 'csv':
      return convertToCSV(data);
    
    default:
      return JSON.stringify(data, null, 2);
  }
};

const convertToXML = (data: any, rootName = 'extractedData'): string => {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n';
  
  const objectToXML = (obj: any, tagName: string): string => {
    if (Array.isArray(obj)) {
      return obj.map((item, index) => 
        `<${tagName}_${index}>${typeof item === 'object' ? objectToXML(item, 'item') : escapeXML(String(item))}</${tagName}_${index}>`
      ).join('\n');
    } else if (typeof obj === 'object' && obj !== null) {
      return Object.entries(obj).map(([key, value]) => {
        const safeKey = key.replace(/[^a-zA-Z0-9]/g, '_');
        if (Array.isArray(value)) {
          return `<${safeKey}>\n${value.map((item, index) => 
            `  <item_${index}>${typeof item === 'object' ? objectToXML(item, 'data') : escapeXML(String(item))}</item_${index}>`
          ).join('\n')}\n</${safeKey}>`;
        } else if (typeof value === 'object' && value !== null) {
          return `<${safeKey}>\n${objectToXML(value, 'data')}\n</${safeKey}>`;
        } else {
          return `<${safeKey}>${escapeXML(String(value))}</${safeKey}>`;
        }
      }).join('\n');
    } else {
      return escapeXML(String(obj));
    }
  };

  const escapeXML = (str: string): string => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  return xmlHeader + `<${rootName}>\n${objectToXML(data, 'data')}\n</${rootName}>`;
};

const convertToCSV = (data: any): string => {
  if (Array.isArray(data)) {
    if (data.length === 0) return '';
    
    // If array of objects, convert to CSV table
    if (typeof data[0] === 'object') {
      const headers = Object.keys(data[0]);
      const csvHeaders = headers.join(',');
      const csvRows = data.map(row => 
        headers.map(header => `"${String(row[header] || '').replace(/"/g, '""')}"`).join(',')
      );
      return [csvHeaders, ...csvRows].join('\n');
    } else {
      // Simple array
      return data.map(item => `"${String(item).replace(/"/g, '""')}"`).join('\n');
    }
  } else if (typeof data === 'object') {
    // Convert object to key-value CSV
    const entries = Object.entries(data);
    const csvContent = entries.map(([key, value]) => {
      if (Array.isArray(value)) {
        return `"${key}","${value.join('; ').replace(/"/g, '""')}"`;
      } else if (typeof value === 'object') {
        return `"${key}","${JSON.stringify(value).replace(/"/g, '""')}"`;
      } else {
        return `"${key}","${String(value).replace(/"/g, '""')}"`;
      }
    });
    return 'Field,Value\n' + csvContent.join('\n');
  } else {
    return `"${String(data).replace(/"/g, '""')}"`;
  }
};
