import * as React from "react";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";

const CISResult = ({ cis }) => {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    setData(cis);
  }, [cis]);

  const theme = useTheme(getTheme());

  if (!data) {
    return <div>Loading...</div>;
  }

  const { required_vaccines: requiredVaccinations, recommended_vaccines: recommendedVaccinations, child } = data;

  // Create columns for the child information table
  const childColumns = [
    {
      label: "Field",
      key: "field-name",
      renderCell: (item) => item.field,
    },
    {
      label: "Value",
      key: "field-value",
      renderCell: (item) => (
        <input
          type={item.type}
          value={item.value !== "N/A" ? item.value : ""}
          onChange={(event) => handleChildUpdate(event.target.value, item.fieldKey)}
          style={{ width: "100%", border: "none", padding: 0, margin: 0 }}
        />
      ),
    },
  ];

  // Map child data to match the CompactTable format
  const childData = [
    { field: "First Name", value: child.first_name, fieldKey: "first_name", type: "text" },
    { field: "Middle Initial", value: child.middle_initial, fieldKey: "middle_initial", type: "text" },
    { field: "Last Name", value: child.last_name, fieldKey: "last_name", type: "text" },
    { field: "Birthdate", value: child.birthdate, fieldKey: "birthdate", type: "text" },
  ].map((item, index) => ({
    ...item,
    key: `child-${index}`,
  }));

  // Create columns for doses dynamically based on the first vaccine object
  const createColumns = (vaccineData, tableType) => {
    const firstVaccine = Object.values(vaccineData)[0];
    const doses = typeof firstVaccine === "object" ? Object.keys(firstVaccine) : ["date"]; // Handle cases where vaccine has a single date value

    return [
      {
        label: "Vaccine",
        key: `${tableType}-vaccine-name`, // Unique key for the vaccine name column with tableType
        renderCell: (item) => item.name,
      },
      ...doses.map((dose, index) => ({
        label: dose,
        key: `${tableType}-${dose}-${index}`, // Unique key for each dose column with tableType
        renderCell: (item) => (
          <input
            key={`${tableType}-${item.name}-${dose}-${index}`} // Unique key for each dose input field with tableType
            type="text"
            style={{
              width: "100%",
              border: "none",
              fontSize: "1rem",
              padding: 0,
              margin: 0,
            }}
            value={item.doses[dose] && item.doses[dose] !== "N/A" ? item.doses[dose] : ""} // Show empty if "N/A" or missing
            onChange={(event) => handleUpdate(event.target.value, item.name, dose, tableType)}
          />
        ),
      })),
    ];
  };

  // Map the vaccination data to a format suitable for the table
  const mapVaccinationData = (vaccineData, tableType) => {
    return Object.keys(vaccineData).map((vaccine, index) => ({
      name: vaccine,
      doses: typeof vaccineData[vaccine] === "object" ? fillMissingDoses(vaccineData[vaccine]) : { date: vaccineData[vaccine] || "" },
      key: `${tableType}-${vaccine}-${index}`, // Adding unique key for each vaccine with tableType
    }));
  };

  // Fills in any missing doses or values with empty strings
  const fillMissingDoses = (doses) => {
    const filledDoses = { ...doses };
    for (let key in filledDoses) {
      if (!filledDoses[key] || filledDoses[key] === "N/A") {
        filledDoses[key] = ""; // Replace "N/A" or missing values with an empty string
      }
    }
    return filledDoses;
  };

  // Updates the data when a user changes a value for vaccines
  const handleUpdate = (value, vaccine, dose, tableType) => {
    setData((prevState) => ({
      ...prevState,
      [tableType]: {
        ...prevState[tableType],
        [vaccine]: {
          ...prevState[tableType][vaccine],
          [dose]: value,
        },
      },
    }));
  };

  // Updates the data when a user changes child details
  const handleChildUpdate = (value, field) => {
    setData((prevState) => ({
      ...prevState,
      child: {
        ...prevState.child,
        [field]: value,
      },
    }));
  };

  // Define columns for both required and recommended vaccinations
  const requiredColumns = createColumns(requiredVaccinations, "required_vaccines");
  const recommendedColumns = createColumns(recommendedVaccinations, "recommended_vaccines");

  // Map the vaccination data for the tables
  const requiredData = mapVaccinationData(requiredVaccinations, "required_vaccines");
  const recommendedData = mapVaccinationData(recommendedVaccinations, "recommended_vaccines");

  return (
    <div style={{ margin: '0 auto', marginTop: '2%' }}>
      {/* Child Info Table */}
      <h4>Child Information</h4>
      <CompactTable columns={childColumns} data={{ nodes: childData }} theme={theme} />

      {/* Required Vaccinations Table */}
      <h4>Required Vaccinations for Child Care or Preschool Entry</h4>
      <CompactTable columns={requiredColumns} data={{ nodes: requiredData }} theme={theme} />

      {/* Recommended Vaccinations Table */}
      <h4>Recommended Vaccinations</h4>
      <CompactTable columns={recommendedColumns} data={{ nodes: recommendedData }} theme={theme} />
    </div>
  );
};

export default CISResult;
