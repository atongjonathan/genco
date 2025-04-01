import { addDocument } from '@/data';
import { Banner, Button, Header, Input, ProgressBar, Stack } from '@nordhealth/react';
import { createFileRoute } from '@tanstack/react-router';
import { useRef, useState } from 'react';
import { read, utils } from "xlsx";

export const Route = createFileRoute('/_authenticated/app/upload')({
  component: RouteComponent,
});

function RouteComponent() {
  const [category, setCategory] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<number | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<{ message: string; variant: "danger" | "warning" | "success" } | null>(null);


  // Handle File Upload
  const handleFileUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const fileType = file.name.split(".").pop()?.toLowerCase();

    if (fileType === "xlsx" || fileType === "xls" || fileType === "csv") {
      setUploadProgress(0); // Start progress at 0
      parseExcel(file, category);
    } else {
      alert("Invalid file format. Please upload a CSV or Excel file.");
    }
  };

  // Function to Parse Excel
  const parseExcel = (file: File, category: string) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      if (!event.target?.result) return;

      const data = new Uint8Array(event.target.result as ArrayBuffer);
      const workbook = read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      let parsedData: any[] = utils.sheet_to_json(sheet, { raw: false });

      // Convert Excel dates to JS Date
      parsedData = parsedData.map((row) => {
        for (const key in row) {
          if (isExcelDate(row[key])) {
            row[key] = convertExcelDate(row[key]);
          }
        }
        return row;
      });

      console.log(parsedData);
      await uploadToFirestore(parsedData, category);
    };
    reader.readAsArrayBuffer(file);
  };

  // Function to check if a value is an Excel date
  const isExcelDate = (value: any): boolean => {
    return !isNaN(value) && value.length < 12 && /[-/]/.test(value);
  };

  // Function to convert Excel serial dates to JavaScript Date
  const convertExcelDate = (excelDate: string): Date => {
    return new Date(Date.parse(excelDate));
  };

  // Function to Upload Data to Firestore with Progress Tracking
  const uploadToFirestore = async (data: any[], category: string) => {
    try {
      const totalItems = data.length;
      let uploadedItems = 0;

      for (const row of data) {
        await addDocument(category, row);
        uploadedItems++;
        setUploadProgress((uploadedItems / totalItems) * 100);
      }

      setError({
        variant: "success",
        message: "Data uploaded successfully!"
      });
      setUploadProgress(undefined); // Reset progress after completion
    } catch (error) {
      console.error("Error uploading data:", error);
      setError({
        variant: "danger",
        message: "Error uploading data. Check console for details."
      });
      setUploadProgress(undefined); // Reset on error
    }
  };

  return (
    <>
      <Header slot="header">
        <h1 className="n-typescale-m font-semibold">Upload</h1>
      </Header>

      {/* Progress Bar */}
      {
        uploadProgress && <ProgressBar value={uploadProgress} />
      }


      {
        error && <Banner variant={error.variant}>{error.message}</Banner>
      }

      <form onSubmit={handleFileUpload}>
        <Stack>
          <Input label='Category'
            type="text"
            placeholder="Enter category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
          <input type="file" ref={fileInputRef} accept=".csv,.xls,.xlsx" required />
          <Button type="submit">Upload</Button>
        </Stack>
      </form>

    </>
  );
}
