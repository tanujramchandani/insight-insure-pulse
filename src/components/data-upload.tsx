import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface DataUploadProps {
  onDataLoad: (data: any[], headers: string[]) => void;
}

export function DataUpload({ onDataLoad }: DataUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (!file.name.toLowerCase().endsWith('.csv')) {
        toast({
          title: "Invalid File Type",
          description: "Please upload a CSV file.",
          variant: "destructive",
        });
        return;
      }

      setIsProcessing(true);

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            toast({
              title: "Parsing Error",
              description: "There was an error parsing your CSV file.",
              variant: "destructive",
            });
            setIsProcessing(false);
            return;
          }

          const headers = Object.keys(results.data[0] || {});
          onDataLoad(results.data, headers);
          setIsProcessing(false);
          
          toast({
            title: "File Uploaded Successfully",
            description: `Loaded ${results.data.length} rows with ${headers.length} columns.`,
          });
        },
        error: (error) => {
          toast({
            title: "Upload Error",
            description: error.message,
            variant: "destructive",
          });
          setIsProcessing(false);
        },
      });
    },
    [onDataLoad]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    multiple: false,
  });

  return (
    <Card className="p-8 border-2 border-dashed transition-all duration-200 hover:shadow-analytics">
      <div
        {...getRootProps()}
        className={`cursor-pointer text-center space-y-4 ${
          isDragActive ? "opacity-50" : ""
        }`}
      >
        <input {...getInputProps()} />
        
        <div className="flex justify-center">
          {isProcessing ? (
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-analytics-primary border-t-transparent" />
          ) : (
            <div className="relative">
              <Upload className="h-16 w-16 text-analytics-primary" />
              <FileText className="h-6 w-6 text-analytics-secondary absolute -bottom-1 -right-1" />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold">
            {isProcessing
              ? "Processing your file..."
              : isDragActive
              ? "Drop your CSV file here"
              : "Upload Insurance Dataset"}
          </h3>
          
          <p className="text-muted-foreground">
            {isProcessing
              ? "Please wait while we analyze your data"
              : "Drag and drop your CSV file here, or click to browse"}
          </p>
        </div>

        {!isProcessing && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="outline" className="min-w-32">
              Choose File
            </Button>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
              <span>CSV files only, max 20MB</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}