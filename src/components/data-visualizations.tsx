import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
         ScatterChart, Scatter, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { useState, useMemo } from "react";
import { BarChart3, Activity, PieChart as PieIcon, TrendingUp } from "lucide-react";

interface DataVisualizationsProps {
  data: any[];
  headers: string[];
}

export function DataVisualizations({ data, headers }: DataVisualizationsProps) {
  const [selectedColumn, setSelectedColumn] = useState<string>("");
  const [selectedXAxis, setSelectedXAxis] = useState<string>("");
  const [selectedYAxis, setSelectedYAxis] = useState<string>("");

  // Categorize columns
  const { numericColumns, categoricalColumns } = useMemo(() => {
    const numeric: string[] = [];
    const categorical: string[] = [];

    headers.forEach(header => {
      const sample = data.find(row => row[header] !== null && row[header] !== undefined && row[header] !== '');
      if (sample) {
        const value = sample[header];
        if (!isNaN(Number(value)) && value !== '') {
          numeric.push(header);
        } else {
          categorical.push(header);
        }
      }
    });

    return { numericColumns: numeric, categoricalColumns: categorical };
  }, [data, headers]);

  // Generate distribution data for selected column
  const distributionData = useMemo(() => {
    if (!selectedColumn) return [];

    const values = data.map(row => row[selectedColumn]).filter(val => val !== null && val !== undefined && val !== '');
    
    if (numericColumns.includes(selectedColumn)) {
      // Create histogram bins for numeric data
      const numericValues = values.map(val => Number(val)).filter(val => !isNaN(val));
      const min = Math.min(...numericValues);
      const max = Math.max(...numericValues);
      const binCount = Math.min(20, Math.ceil(Math.sqrt(numericValues.length)));
      const binSize = binCount > 0 ? (max - min) / binCount : 1;
      
      const bins = Array.from({ length: binCount }, (_, i) => ({
        range: `${(min + i * binSize).toFixed(1)}-${(min + (i + 1) * binSize).toFixed(1)}`,
        count: 0,
        value: min + i * binSize + binSize / 2
      }));
      
      numericValues.forEach(value => {
        const binIndex = Math.min(Math.floor((value - min) / binSize), binCount - 1);
        bins[binIndex].count++;
      });
      
      return bins;
    } else {
      // Create frequency data for categorical data
      const counts = values.reduce((acc, val) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      return Object.entries(counts)
        .map(([category, count]) => ({ category, count: count as number }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 15); // Top 15 categories
    }
  }, [selectedColumn, data, numericColumns]);

  // Generate correlation data for scatter plot
  const scatterData = useMemo(() => {
    if (!selectedXAxis || !selectedYAxis || !numericColumns.includes(selectedXAxis) || !numericColumns.includes(selectedYAxis)) {
      return [];
    }

    return data
      .filter(row => 
        row[selectedXAxis] !== null && row[selectedXAxis] !== undefined && row[selectedXAxis] !== '' &&
        row[selectedYAxis] !== null && row[selectedYAxis] !== undefined && row[selectedYAxis] !== ''
      )
      .map(row => ({
        x: Number(row[selectedXAxis]),
        y: Number(row[selectedYAxis]),
      }))
      .filter(point => !isNaN(point.x) && !isNaN(point.y))
      .slice(0, 1000); // Limit to 1000 points for performance
  }, [selectedXAxis, selectedYAxis, data, numericColumns]);

  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))', 'hsl(var(--chart-6))'];

  return (
    <div className="space-y-6">
      {/* Column Distribution */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-analytics-primary" />
              Column Distribution
            </CardTitle>
            <Select value={selectedColumn} onValueChange={setSelectedColumn}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select column" />
              </SelectTrigger>
              <SelectContent>
                {headers.map(header => (
                  <SelectItem key={header} value={header}>
                    <div className="flex items-center gap-2">
                      {header}
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          numericColumns.includes(header) 
                            ? 'bg-analytics-success text-white border-analytics-success' 
                            : 'bg-analytics-secondary text-white border-analytics-secondary'
                        }`}
                      >
                        {numericColumns.includes(header) ? 'Numeric' : 'Categorical'}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {selectedColumn && distributionData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              {numericColumns.includes(selectedColumn) ? (
                <BarChart data={distributionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--analytics-primary))" />
                </BarChart>
              ) : (
                <BarChart data={distributionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--analytics-secondary))" />
                </BarChart>
              )}
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Select a column to view its distribution
            </div>
          )}
        </CardContent>
      </Card>

      {/* Scatter Plot for Correlation */}
      {numericColumns.length >= 2 && (
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-analytics-accent" />
              Correlation Analysis
            </CardTitle>
              <div className="flex gap-2">
                <Select value={selectedXAxis} onValueChange={setSelectedXAxis}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="X-Axis" />
                  </SelectTrigger>
                  <SelectContent>
                    {numericColumns.map(column => (
                      <SelectItem key={column} value={column}>
                        {column}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedYAxis} onValueChange={setSelectedYAxis}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Y-Axis" />
                  </SelectTrigger>
                  <SelectContent>
                    {numericColumns.map(column => (
                      <SelectItem key={column} value={column}>
                        {column}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {selectedXAxis && selectedYAxis && scatterData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart data={scatterData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="x" name={selectedXAxis} />
                  <YAxis dataKey="y" name={selectedYAxis} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter fill="hsl(var(--analytics-accent))" />
                </ScatterChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                Select X and Y axes to view correlation
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Top Categories Pie Chart */}
      {categoricalColumns.length > 0 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieIcon className="h-5 w-5 text-analytics-warning" />
              Category Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categoricalColumns.slice(0, 2).map(column => {
                const values = data.map(row => row[column]).filter(val => val !== null && val !== undefined && val !== '');
                const counts = values.reduce((acc, val) => {
                  acc[val] = (acc[val] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>);
                
                const pieData = Object.entries(counts)
                  .map(([name, value]) => ({ name, value: value as number }))
                  .sort((a, b) => b.value - a.value)
                  .slice(0, 6); // Top 6 categories

                return (
                  <div key={column}>
                    <h4 className="text-sm font-medium mb-2 text-center">{column}</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          outerRadius={60}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}