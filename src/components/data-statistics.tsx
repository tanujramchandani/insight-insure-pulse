import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

interface DataStatisticsProps {
  data: any[];
  headers: string[];
}

export function DataStatistics({ data, headers }: DataStatisticsProps) {
  const getColumnStats = (header: string) => {
    const values = data.map(row => row[header]).filter(val => val !== null && val !== undefined && val !== '');
    const nullCount = data.length - values.length;
    
    // Check if numeric
    const numericValues = values.filter(val => !isNaN(Number(val))).map(val => Number(val));
    const isNumeric = numericValues.length > values.length * 0.8; // 80% threshold
    
    if (isNumeric && numericValues.length > 0) {
      const sorted = [...numericValues].sort((a, b) => a - b);
      const mean = numericValues.reduce((sum, val) => sum + val, 0) / numericValues.length;
      const median = sorted[Math.floor(sorted.length / 2)];
      const std = Math.sqrt(
        numericValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / numericValues.length
      );
      
      return {
        type: 'numeric',
        count: values.length,
        nullCount,
        nullPercentage: ((nullCount / data.length) * 100).toFixed(1),
        min: Math.min(...numericValues),
        max: Math.max(...numericValues),
        mean: mean.toFixed(2),
        median: median.toFixed(2),
        std: std.toFixed(2),
        uniqueCount: new Set(numericValues).size,
      };
    } else {
      // Categorical
      const valueCounts = values.reduce((acc, val) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const mostCommon = Object.entries(valueCounts)
        .sort(([,a], [,b]) => (b as number) - (a as number))
        .slice(0, 5);
      
      return {
        type: 'categorical',
        count: values.length,
        nullCount,
        nullPercentage: ((nullCount / data.length) * 100).toFixed(1),
        uniqueCount: Object.keys(valueCounts).length,
        mostCommon,
      };
    }
  };

  const numericColumns = headers.filter(header => getColumnStats(header).type === 'numeric');
  const categoricalColumns = headers.filter(header => getColumnStats(header).type === 'categorical');
  
  // Data quality metrics
  const totalCells = data.length * headers.length;
  const nullCells = headers.reduce((sum, header) => {
    return sum + getColumnStats(header).nullCount;
  }, 0);
  const completenessPercentage = ((totalCells - nullCells) / totalCells * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Rows</p>
                <p className="text-2xl font-bold text-analytics-primary">
                  {data.length.toLocaleString()}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-analytics-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Columns</p>
                <p className="text-2xl font-bold text-analytics-secondary">
                  {headers.length}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-analytics-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Data Completeness</p>
                <p className="text-2xl font-bold text-analytics-success">
                  {completenessPercentage}%
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-analytics-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Missing Values</p>
                <p className="text-2xl font-bold text-analytics-warning">
                  {nullCells.toLocaleString()}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-analytics-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Column Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Numeric Columns */}
        {numericColumns.length > 0 && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-analytics-success" />
                Numeric Columns ({numericColumns.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {numericColumns.map(header => {
                const stats = getColumnStats(header);
                return (
                  <div key={header} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{header}</h4>
                      <Badge variant="secondary" className="bg-analytics-success text-white">
                        Numeric
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Min:</span> {stats.min}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Max:</span> {stats.max}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Mean:</span> {stats.mean}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Median:</span> {stats.median}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Std Dev:</span> {stats.std}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Unique:</span> {stats.uniqueCount}
                      </div>
                    </div>
                    {Number(stats.nullPercentage) > 0 && (
                      <div className="text-sm text-analytics-warning">
                        ⚠️ {stats.nullPercentage}% missing values
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* Categorical Columns */}
        {categoricalColumns.length > 0 && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-analytics-secondary" />
                Categorical Columns ({categoricalColumns.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {categoricalColumns.map(header => {
                const stats = getColumnStats(header);
                return (
                  <div key={header} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{header}</h4>
                      <Badge variant="secondary" className="bg-analytics-secondary text-white">
                        Categorical
                      </Badge>
                    </div>
                    <div className="text-sm space-y-1">
                      <div>
                        <span className="text-muted-foreground">Unique values:</span> {stats.uniqueCount}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Most common:</span>
                        <div className="mt-1 space-y-1">
                           {stats.mostCommon.slice(0, 3).map(([value, count]) => (
                             <div key={String(value)} className="flex justify-between text-xs">
                               <span className="truncate">{String(value)}</span>
                               <span className="text-analytics-primary">{String(count)}</span>
                             </div>
                           ))}
                        </div>
                      </div>
                    </div>
                    {Number(stats.nullPercentage) > 0 && (
                      <div className="text-sm text-analytics-warning">
                        ⚠️ {stats.nullPercentage}% missing values
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}