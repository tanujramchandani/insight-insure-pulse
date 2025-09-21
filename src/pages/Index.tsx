import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataUpload } from "@/components/data-upload";
import { DataPreview } from "@/components/data-preview";
import { DataStatistics } from "@/components/data-statistics";
import { DataVisualizations } from "@/components/data-visualizations";
import { InsightsSummary } from "@/components/insights-summary";
import { NextStepsPreview } from "@/components/next-steps-preview";
import { BarChart3, Upload, Database, TrendingUp, Lightbulb, RefreshCw } from "lucide-react";

const Index = () => {
  const [data, setData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [analysisStep, setAnalysisStep] = useState<'upload' | 'analyze'>('upload');

  const handleDataLoad = (loadedData: any[], loadedHeaders: string[]) => {
    setData(loadedData);
    setHeaders(loadedHeaders);
    setAnalysisStep('analyze');
  };

  const resetAnalysis = () => {
    setData([]);
    setHeaders([]);
    setAnalysisStep('upload');
  };

  const getStepIcon = (step: string) => {
    switch (step) {
      case 'preview': return <Database className="h-4 w-4" />;
      case 'statistics': return <BarChart3 className="h-4 w-4" />;
      case 'visualizations': return <TrendingUp className="h-4 w-4" />;
      case 'insights': return <Lightbulb className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary text-white shadow-elevated">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <BarChart3 className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Insight Insure Pulse</h1>
                <p className="text-white/80">
                  Advanced insurance analytics with predictive models and risk assessment
                </p>
              </div>
            </div>
            
            {data.length > 0 && (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm text-white/80">Dataset Loaded</div>
                  <div className="font-semibold">
                    {data.length.toLocaleString()} rows × {headers.length} columns
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => window.open('/analytics-dashboard', '_blank')}
                    variant="secondary"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <BarChart3 className="h-4 w-4" />
                    Advanced Analytics
                  </Button>
                  <Button
                    onClick={resetAnalysis}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    New Analysis
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {analysisStep === 'upload' ? (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <Upload className="h-16 w-16 text-analytics-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Start Your Analysis</h2>
              <p className="text-muted-foreground">
                Upload your insurance dataset to begin comprehensive analysis with predictive modeling and risk assessment
              </p>
            </div>
            <DataUpload onDataLoad={handleDataLoad} />
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="shadow-card">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">Advanced Analytics</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Customer lifetime value prediction</li>
                    <li>• Claims probability scoring</li>
                    <li>• Churn risk assessment</li>
                    <li>• Customer segmentation</li>
                    <li>• Pricing optimization</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="shadow-card">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">Insurance Data Types</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Customer demographics & policies</li>
                    <li>• Claims history & amounts</li>
                    <li>• Premium data & risk factors</li>
                    <li>• CSV format, max 20MB</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Analysis Navigation */}
            <div className="bg-card rounded-lg p-1 shadow-card">
              <Tabs defaultValue="preview" className="w-full">
                <TabsList className="grid w-full grid-cols-4 h-12">
                  <TabsTrigger 
                    value="preview" 
                    className="flex items-center gap-2 data-[state=active]:bg-analytics-primary data-[state=active]:text-white"
                  >
                    {getStepIcon('preview')}
                    <span className="hidden sm:inline">Data Preview</span>
                    <span className="sm:hidden">Preview</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="statistics"
                    className="flex items-center gap-2 data-[state=active]:bg-analytics-primary data-[state=active]:text-white"
                  >
                    {getStepIcon('statistics')}
                    <span className="hidden sm:inline">Statistics</span>
                    <span className="sm:hidden">Stats</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="visualizations"
                    className="flex items-center gap-2 data-[state=active]:bg-analytics-primary data-[state=active]:text-white"
                  >
                    {getStepIcon('visualizations')}
                    <span className="hidden sm:inline">Charts</span>
                    <span className="sm:hidden">Charts</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="insights"
                    className="flex items-center gap-2 data-[state=active]:bg-analytics-primary data-[state=active]:text-white"
                  >
                    {getStepIcon('insights')}
                    <span className="hidden sm:inline">Insights</span>
                    <span className="sm:hidden">Insights</span>
                  </TabsTrigger>
                </TabsList>

                <div className="mt-6">
                  <TabsContent value="preview" className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="outline" className="bg-analytics-primary text-white border-analytics-primary">
                        Step 1
                      </Badge>
                      <h2 className="text-xl font-semibold">Data Preview & Structure</h2>
                    </div>
                    <DataPreview data={data} headers={headers} />
                  </TabsContent>

                  <TabsContent value="statistics" className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="outline" className="bg-analytics-secondary text-white border-analytics-secondary">
                        Step 2
                      </Badge>
                      <h2 className="text-xl font-semibold">Statistical Analysis</h2>
                    </div>
                    <DataStatistics data={data} headers={headers} />
                  </TabsContent>

                  <TabsContent value="visualizations" className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="outline" className="bg-analytics-accent text-white border-analytics-accent">
                        Step 3
                      </Badge>
                      <h2 className="text-xl font-semibold">Data Visualizations</h2>
                    </div>
                    <DataVisualizations data={data} headers={headers} />
                  </TabsContent>

                  <TabsContent value="insights" className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="outline" className="bg-analytics-success text-white border-analytics-success">
                        Step 4
                      </Badge>
                      <h2 className="text-xl font-semibold">Business Insights</h2>
                    </div>
                    <InsightsSummary data={data} headers={headers} />
                  </TabsContent>
                </div>
              </Tabs>
            </div>

            {/* Next Steps Section */}
            <div className="mt-12">
              <NextStepsPreview hasData={data.length > 0} />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-muted mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Professional insurance analytics powered by advanced predictive modeling.
              Upload your dataset to unlock customer insights, risk assessment, and pricing optimization.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;