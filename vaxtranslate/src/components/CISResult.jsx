import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Download, Printer, FileText, AlertCircle } from 'lucide-react';

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

const CISResult = ({ cis }) => {
  const [data, setData] = useState(cis);

  const handleUpdate = useCallback((value, vaccine, dose, tableType) => {
    setData(prevData => ({
      ...prevData,
      [tableType]: {
        ...prevData[tableType],
        [vaccine]: typeof prevData[tableType][vaccine] === "object"
          ? {
              ...prevData[tableType][vaccine],
              [dose]: value,
            }
          : value,
      }
    }));
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
      const header = ['Vaccine'];
      const rows = [];
      
      const doseNames = new Set();
      Object.values(vaccines).forEach(dates => {
        if (typeof dates === 'object') {
          Object.keys(dates).forEach(dose => doseNames.add(dose));
        }
      });
      
      header.push(...Array.from(doseNames));
      
      Object.entries(vaccines).forEach(([name, dates]) => {
        const row = [name];
        Array.from(doseNames).forEach(dose => {
          row.push((typeof dates === 'object' ? dates[dose] : dates) ?? '');
        });
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
      'Recommended Vaccinations',
      formatVaccineData(data.recommended_vaccines),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `vaccination-record-${getFormattedDate()}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }, [data]);

  const renderTable = useCallback((columns, tableData, title) => (
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
  ), []);

  const { childColumns, childData, requiredColumns, recommendedColumns, requiredData, recommendedData } = useMemo(() => {
    if (!data) return {};

    const createColumns = (vaccineData, tableType) => {
      const firstVaccine = Object.values(vaccineData)[0];
      const doses = typeof firstVaccine === 'object' ? Object.keys(firstVaccine) : ['date'];

      return [
        {
          label: "Vaccine",
          key: `${tableType}-vaccine-name`,
          renderCell: (item) => <span className="font-medium">{item.name}</span>,
        },
        ...doses.map((dose, index) => ({
          label: dose,
          key: `${tableType}-${dose}-${index}`,
          renderCell: (item) => (
            <InputField
              value={item.doses[dose]}
              onChange={(e) => handleUpdate(e.target.value, item.name, dose, tableType)}
            />
          ),
        })),
      ];
    };

    const mapVaccinationData = (vaccineData, tableType) => {
      return Object.keys(vaccineData).map((vaccine, index) => ({
        name: vaccine,
        doses: typeof vaccineData[vaccine] === 'object'
          ? { ...vaccineData[vaccine] }
          : { date: vaccineData[vaccine] ?? "" },
        key: `${tableType}-${vaccine}-${index}`,
      }));
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
      requiredColumns: createColumns(data.required_vaccines, "required_vaccines"),
      recommendedColumns: createColumns(data.recommended_vaccines, "recommended_vaccines"),
      requiredData: mapVaccinationData(data.required_vaccines, "required_vaccines"),
      recommendedData: mapVaccinationData(data.recommended_vaccines, "recommended_vaccines"),
    };
  }, [data, handleUpdate, handleChildUpdate]);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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

      <div className="space-y-6">
        {renderTable(childColumns, childData, "Child Information")}
        {renderTable(requiredColumns, requiredData, "Required Vaccinations for Child Care or Preschool Entry")}
        {renderTable(recommendedColumns, recommendedData, "Recommended Vaccinations")}
      </div>
    </div>
  );
};

export default CISResult;