import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Download, Printer, FileText, AlertCircle, Info, Database, BrainCircuit } from 'lucide-react';

const InputField = React.memo(({ value, onChange, className = "" }) => (
  <input
    type="text"
    value={value ?? ""}
    onChange={onChange}
    className={`w-full px-2 py-1 border border-transparent hover:border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded transition-colors ${className}`}
  />
));

const TableHeader = React.memo(({ children }) => (
  <div className="bg-gray-100 px-4 py-2 font-semibold text-gray-700 rounded-t-lg">
    {children}
  </div>
));

// Show AI by default if there are dates, DB if it's a database match
const TranslationSourceIndicator = React.memo(({ source, hasValidDates }) => {
  if (!hasValidDates) return null;
  
  // Default to AI for any vaccine with dates, unless it's explicitly from dataset
  const isDatasetMatch = source === 'dataset';
  
  return (
    <span className={`ml-1 text-xs rounded-full px-1 font-medium ${
      isDatasetMatch ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
    }`}>
      {isDatasetMatch ? 'DB' : 'AI'}
    </span>
  );
});

const CISResult = ({ cis }) => {
  const [data, setData] = useState(cis);

  // Update vaccine data without losing metadata
  const handleUpdate = useCallback((value, vaccine, dose, tableType) => {
    setData(prevData => {
      const currentVaccine = prevData[tableType][vaccine];
      
      // If it's a regular object (not a metadata object)
      if (typeof currentVaccine === 'object' && !currentVaccine.__translationMeta) {
        return {
          ...prevData,
          [tableType]: {
            ...prevData[tableType],
            [vaccine]: {
              ...currentVaccine,
              [dose]: value,
            }
          }
        };
      }
      
      // If it has metadata
      if (typeof currentVaccine === 'object' && currentVaccine.__translationMeta) {
        return {
          ...prevData,
          [tableType]: {
            ...prevData[tableType],
            [vaccine]: {
              ...currentVaccine,
              [dose]: value,
              __translationMeta: currentVaccine.__translationMeta
            }
          }
        };
      }
      
      // If it's a simple string
      return {
        ...prevData,
        [tableType]: {
          ...prevData[tableType],
          [vaccine]: value
        }
      };
    });
  }, []);

  const handleChildUpdate = useCallback((value, field) => {
    setData(prevData => ({
      ...prevData,
      child: {
        ...prevData.child,
        [field]: value,
      }
    }));
  }, []);

  const handleExport = useCallback((type) => {
    if (type === 'print') {
      window.print();
      return;
    }

    // CSV Export logic
    const getFormattedDate = () => {
      return new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).replace(/\//g, '-');
    };

    const escapeField = (field) => `"${String(field ?? '').replace(/"/g, '""')}"`;

    const formatVaccineData = (vaccines) => {
      const header = ['Vaccine', 'Date 1', 'Date 2', 'Date 3'];
      const rows = [];
      
      Object.entries(vaccines).forEach(([name, dates]) => {
        const row = [name];
        if (typeof dates === 'object') {
          // Get up to 3 date fields, excluding __translationMeta
          const dateFields = Object.keys(dates)
            .filter(key => key !== '__translationMeta')
            .slice(0, 3);
          
          // Add up to 3 dates
          for (let i = 0; i < 3; i++) {
            // Replace "N/A" with empty string
            let dateValue = dateFields[i] ? dates[dateFields[i]] || '' : '';
            if (dateValue === "N/A") dateValue = '';
            row.push(dateValue);
          }
        } else {
          // Replace "N/A" with empty string
          let dateValue = dates;
          if (dateValue === "N/A") dateValue = '';
          row.push(dateValue, '', '');
        }
        rows.push(row);
      });
      
      return [header, ...rows].map(row => row.map(escapeField).join(',')).join('\n');
    };

    const csvContent = [
      'Child Information',
      ['Field', 'Value'].map(escapeField).join(','),
      ...Object.entries({
        'First Name': data.child.first_name,
        'Middle Initial': data.child.middle_initial,
        'Last Name': data.child.last_name,
        'Birthdate': data.child.birthdate,
      }).map(([k, v]) => [escapeField(k), escapeField(v)].join(',')),
      '',
      'Required Vaccinations',
      formatVaccineData(data.required_vaccines),
      '',
      'Other Vaccinations',
      formatVaccineData(data.other_vaccines || {}),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `vaccination-record-${getFormattedDate()}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }, [data]);

  const renderTable = useCallback((columns, tableData, title) => {
    // Only render the table if there's data
    if (!tableData || tableData.length === 0) return null;
    
    return (
      <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200">
        <TableHeader>{title}</TableHeader>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                {columns.map((col) => (
                  <th key={col.key} className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, rowIndex) => (
                <tr 
                  key={row.key} 
                  className={`border-t border-gray-100 ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                >
                  {columns.map((col) => (
                    <td key={`${row.key}-${col.key}`} className="px-4 py-2">
                      {col.renderCell(row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }, []);

  const { childColumns, childData, requiredColumns, otherColumns, requiredData, otherData } = useMemo(() => {
    if (!data) return {};

    // Process and normalize N/A values to empty strings
    const normalizeVaccineData = (vaccines) => {
      const result = {};
      
      Object.entries(vaccines).forEach(([name, value]) => {
        if (typeof value === 'object') {
          const newValue = { ...value };
          
          // Convert N/A to empty string for each dose
          Object.keys(newValue).forEach(key => {
            if (key !== '__translationMeta' && newValue[key] === 'N/A') {
              newValue[key] = '';
            }
          });
          
          result[name] = newValue;
        } else if (value === 'N/A') {
          result[name] = '';
        } else {
          result[name] = value;
        }
      });
      
      return result;
    };
    
    // Create other vaccines object from recommended vaccines
    const otherVaccines = data.recommended_vaccines ? normalizeVaccineData(data.recommended_vaccines) : {};
    
    // Normalize required vaccines
    const normalizedRequiredVaccines = data.required_vaccines ? normalizeVaccineData(data.required_vaccines) : {};

    const createColumns = (tableType) => {
      // Always use these standard 3 date columns
      return [
        {
          label: "Vaccine",
          key: `${tableType}-vaccine-name`,
          renderCell: (item) => {
            // Check if any dates are non-empty
            const hasValidDates = Object.values(item.doses).some(value => value && value !== '');
            
            return (
              <div className="flex items-center">
                <span className="font-medium">{item.name}</span>
                <TranslationSourceIndicator 
                  source={item.translationMeta?.source}
                  hasValidDates={hasValidDates}
                />
              </div>
            );
          },
        },
        {
          label: "Date 1",
          key: `${tableType}-date-1`,
          renderCell: (item) => (
            <InputField
              value={item.doses.date_1}
              onChange={(e) => handleUpdate(e.target.value, item.name, 'date_1', tableType)}
            />
          ),
        },
        {
          label: "Date 2",
          key: `${tableType}-date-2`,
          renderCell: (item) => (
            <InputField
              value={item.doses.date_2}
              onChange={(e) => handleUpdate(e.target.value, item.name, 'date_2', tableType)}
            />
          ),
        },
        {
          label: "Date 3",
          key: `${tableType}-date-3`,
          renderCell: (item) => (
            <InputField
              value={item.doses.date_3}
              onChange={(e) => handleUpdate(e.target.value, item.name, 'date_3', tableType)}
            />
          ),
        },
      ];
    };

    const mapVaccinationData = (vaccineData, tableType) => {
      return Object.keys(vaccineData).map((vaccine, index) => {
        const vacData = vaccineData[vaccine];
        let doses = { date_1: '', date_2: '', date_3: '' };
        let translationMeta = null;
        
        if (typeof vacData === 'object') {
          // Extract translation metadata if it exists
          if (vacData.__translationMeta) {
            translationMeta = vacData.__translationMeta;
          }
          
          // Map existing dose data to our standard 3 date fields
          const dateKeys = Object.keys(vacData).filter(key => key !== '__translationMeta');
          
          if (dateKeys.length > 0) {
            // If we have date entries with explicit keys like 'date_1', 'date_2', etc.
            dateKeys.forEach(key => {
              if (key.match(/date_[1-3]/) || key.match(/dose_?[1-3]/i)) {
                // Extract the digit from keys like 'date_1', 'dose_1', etc.
                const match = key.match(/[1-3]$/);
                if (match) {
                  const digit = match[0];
                  doses[`date_${digit}`] = vacData[key];
                }
              } else if (dateKeys.length <= 3) {
                // If we have other named fields and total count is 3 or less, map sequentially
                const index = dateKeys.indexOf(key);
                if (index >= 0 && index < 3) {
                  doses[`date_${index + 1}`] = vacData[key];
                }
              }
            });
          }
        } else if (typeof vacData === 'string') {
          // If it's a direct string value
          doses.date_1 = vacData;
        }
        
        return {
          name: vaccine,
          doses: doses,
          translationMeta: translationMeta,
          key: `${tableType}-${vaccine}-${index}`,
        };
      });
    };

    return {
      childColumns: [
        { label: "Field", key: "field-name", renderCell: (item) => item.field },
        {
          label: "Value",
          key: "field-value",
          renderCell: (item) => (
            <InputField
              value={item.value}
              onChange={(e) => handleChildUpdate(e.target.value, item.fieldKey)}
            />
          ),
        },
      ],
      childData: [
        { field: "First Name", value: data.child.first_name, fieldKey: "first_name" },
        { field: "Middle Initial", value: data.child.middle_initial, fieldKey: "middle_initial" },
        { field: "Last Name", value: data.child.last_name, fieldKey: "last_name" },
        { field: "Birthdate", value: data.child.birthdate, fieldKey: "birthdate" },
      ].map((item, index) => ({
        ...item,
        key: `child-${index}`,
      })),
      requiredColumns: createColumns("required_vaccines"),
      otherColumns: createColumns("other_vaccines"),
      requiredData: mapVaccinationData(normalizedRequiredVaccines, "required_vaccines"),
      otherData: mapVaccinationData(otherVaccines, "other_vaccines"),
    };
  }, [data, handleUpdate, handleChildUpdate]);

  // Simple legend for translation sources
  const renderLegend = () => (
    <div className="mb-4 text-sm text-gray-600">
      <span className="mr-4">Translation sources:</span>
      <span className="bg-green-100 text-green-800 rounded-full px-1 py-0.5 text-xs font-medium mr-1">DB</span>
      <span className="mr-4">Database match</span>
      <span className="bg-blue-100 text-blue-800 rounded-full px-1 py-0.5 text-xs font-medium mr-1">AI</span>
      <span>AI translation</span>
    </div>
  );

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Check if we have any other vaccines to display
  const hasOtherVaccines = otherData && otherData.length > 0;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Vaccination Record</h1>
        <div className="flex gap-2">
          <button
            onClick={() => handleExport('csv')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <FileText size={18} />
            Export CSV
          </button>
          <button
            onClick={() => handleExport('print')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Printer size={18} />
            Print
          </button>
        </div>
      </div>

      {/* Display country of origin if available */}
      {data.country_of_origin && data.country_of_origin !== "Other" && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-blue-700">
            <span className="font-medium">Country of Origin:</span> {data.country_of_origin}
          </p>
        </div>
      )}

      {/* Add simplified legend for translation sources */}
      {renderLegend()}

      <div className="space-y-6">
        {renderTable(childColumns, childData, "Child Information")}
        {renderTable(requiredColumns, requiredData, "Required Vaccinations for Child Care or Preschool Entry")}
        {hasOtherVaccines && renderTable(otherColumns, otherData, "Other Vaccinations")}
      </div>
    </div>
  );
};

export default CISResult;