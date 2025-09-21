import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Database, Eye } from "lucide-react";

interface DataPreviewProps {
  data: any[];
  headers: string[];
}

export function DataPreview({ data, headers }: DataPreviewProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 10;
  const totalPages = Math.ceil(data.length / rowsPerPage);

  const paginatedData = data.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage
  );

  const getColumnType = (header: string) => {
    const sample = data.find(row => row[header] !== null && row[header] !== undefined && row[header] !== '');
    if (!sample) return 'text';
    
    const value = sample[header];
    if (!isNaN(Number(value)) && value !== '') return 'number';
    if (new Date(value).toString() !== 'Invalid Date') return 'date';
    return 'text';
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'number': return 'bg-analytics-success text-white';
      case 'date': return 'bg-analytics-warning text-white';
      default: return 'bg-analytics-secondary text-white';
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-analytics-primary" />
          <CardTitle>Data Preview</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {data.length.toLocaleString()} rows × {headers.length} columns
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Column Types */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Column Types</h4>
          <div className="flex flex-wrap gap-2">
            {headers.map((header) => {
              const type = getColumnType(header);
              return (
                <Badge
                  key={header}
                  variant="secondary"
                  className={`${getTypeColor(type)} text-xs`}
                >
                  {header} ({type})
                </Badge>
              );
            })}
          </div>
        </div>

        {/* Data Table */}
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-analytics-primary text-white">
                <tr>
                  {headers.map((header) => (
                    <th
                      key={header}
                      className="px-4 py-3 text-left font-medium min-w-32"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {paginatedData.map((row, index) => (
                  <tr
                    key={index}
                    className="hover:bg-accent/50 transition-colors"
                  >
                    {headers.map((header) => (
                      <td key={header} className="px-4 py-3">
                        {row[header] || (
                          <span className="text-muted-foreground italic">
                            null
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {currentPage * rowsPerPage + 1} to{" "}
              {Math.min((currentPage + 1) * rowsPerPage, data.length)} of{" "}
              {data.length} rows
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <span className="text-sm font-medium">
                Page {currentPage + 1} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage(Math.min(totalPages - 1, currentPage + 1))
                }
                disabled={currentPage === totalPages - 1}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}