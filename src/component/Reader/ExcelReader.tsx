// ExcelReader.tsx
import React from "react";
import * as XLSX from "xlsx";
import showToast from "../Toast/toast";

interface ExcelReaderProps {
  file: File;
}

const ExcelReader: React.FC<ExcelReaderProps> = ({ file }) => {
  const handleFileRead = async (e: ProgressEvent<FileReader>) => {
    try {
      const result = e.target?.result;
      if (result) {
        const workbook = XLSX.read(result, { type: "binary" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const parseData = XLSX.utils.sheet_to_json(worksheet);
        console.log(parseData);
      }
    } catch (error) {
      showToast("Import Gagal");
    }
  };

  const readFile = () => {
    const reader = new FileReader();
    reader.onloadend = handleFileRead;
    reader.readAsBinaryString(file);
  };

  React.useEffect(() => {
    readFile();
  });

  return (
    <div>
      <p>Reading Excel file...</p>
    </div>
  );
};

export default ExcelReader;
