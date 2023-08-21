import { CsvTypes, ExcelTypes } from "./const";

const getFileType = (file: File) => {
  const type = file.type;

  if (ExcelTypes.includes(type)) {
    return "xlsx";
  }

  if (CsvTypes.includes(type)) {
    return "csv";
  }

  return "unknown";
};

export { getFileType };
