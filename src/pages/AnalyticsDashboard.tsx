import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Shield, 
  Users, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  Target,
  BarChart3,
  PieChart,
  LineChart,
  ArrowLeft
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  BarChart as RechartsBarChart,
  Bar,
  ScatterChart,
  Scatter
} from "recharts";

const AnalyticsDashboard = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState("6months");

  // Mock data for different analytics modules
  const kpiData = {
    totalCustomers: 125847,
    averageClv: 18500,
    claimsProbability: 12.5,
    churnRisk: 8.3,
    riskScore: 73,
    pricingOptimization: 15.2
  };

  const clvTrendData = [
    { month: "Jan", clv: 16500, predicted: 16200 },
    { month: "Feb", clv: 17200, predicted: 17100 },
    { month: "Mar", clv: 17800, predicted: 17900 },
    { month: "Apr", clv: 18200, predicted: 18400 },
    { month: "May", clv: 18500, predicted: 18800 },
    { month: "Jun", clv: 18900, predicted: 19200 }
  ];

  const riskDistributionData = [
    { name: "Low Risk", value: 45, color: "#10b981" },
    { name: "Medium Risk", value: 35, color: "#f59e0b" },
    { name: "High Risk", value: 15, color: "#ef4444" },
    { name: "Critical Risk", value: 5, color: "#dc2626" }
  ];

  const customerSegmentData = [
    { segment: "Young Professionals", count: 32500, avgPremium: 1200, claimRate: 8.5 },
    { segment: "Families", count: 48200, avgPremium: 2100, claimRate: 12.3 },
    { segment: "Seniors", count: 28100, avgPremium: 1800, claimRate: 18.7 },
    { segment: "High Net Worth", count: 17047, avgPremium: 4500, claimRate: 6.2 }
  ];

  const pricingOptimizationData = [
    { riskLevel: "Low", currentPrice: 800, optimalPrice: 850, uplift: 6.3 },
    { riskLevel: "Medium", currentPrice: 1200, optimalPrice: 1350, uplift: 12.5 },
    { riskLevel: "High", currentPrice: 1800, optimalPrice: 2100, uplift: 16.7 },
    { riskLevel: "Critical", currentPrice: 2500, optimalPrice: 3200, uplift: 28.0 }
  ];

  const modelPerformanceData = [
    { model: "CLV Prediction", accuracy: 89.2, precision: 87.5, recall: 91.3 },
    { model: "Churn Prediction", accuracy: 92.1, precision: 89.8, recall: 94.2 },
    { model: "Claims Probability", accuracy: 85.7, precision: 83.4, recall: 88.1 },
    { model: "Risk Scoring", accuracy: 91.5, precision: 90.2, recall: 92.8 }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary text-white shadow-elevated">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="secondary" size="sm" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Upload
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Brain className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
                  <p className="text-white/80">
                    Advanced predictive analytics and business intelligence
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <select 
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="bg-white/20 text-white border border-white/30 rounded px-3 py-1"
              >
                <option value="3months">Last 3 Months</option>
                <option value="6months">Last 6 Months</option>
                <option value="1year">Last Year</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* KPI Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-analytics-primary" />
                <span className="text-sm font-medium">Total Customers</span>
              </div>
              <div className="text-2xl font-bold">{kpiData.totalCustomers.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">+5.2% from last month</div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-analytics-secondary" />
                <span className="text-sm font-medium">Avg. CLV</span>
              </div>
              <div className="text-2xl font-bold">${kpiData.averageClv.toLocaleString()}</div>
              <div className="text-xs text-analytics-success">+12.3% growth</div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-analytics-accent" />
                <span className="text-sm font-medium">Claims Probability</span>
              </div>
              <div className="text-2xl font-bold">{kpiData.claimsProbability}%</div>
              <div className="text-xs text-muted-foreground">Within target range</div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-red-500" />
                <span className="text-sm font-medium">Churn Risk</span>
              </div>
              <div className="text-2xl font-bold">{kpiData.churnRisk}%</div>
              <div className="text-xs text-analytics-success">-2.1% improvement</div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-analytics-primary" />
                <span className="text-sm font-medium">Risk Score</span>
              </div>
              <div className="text-2xl font-bold">{kpiData.riskScore}/100</div>
              <Progress value={kpiData.riskScore} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-5 w-5 text-analytics-accent" />
                <span className="text-sm font-medium">Pricing Uplift</span>
              </div>
              <div className="text-2xl font-bold">+{kpiData.pricingOptimization}%</div>
              <div className="text-xs text-analytics-success">Revenue potential</div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Modules */}
        <Tabs defaultValue="advanced" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-12">
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">Advanced Analytics</span>
              <span className="sm:hidden">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="risk" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Risk Assessment</span>
              <span className="sm:hidden">Risk</span>
            </TabsTrigger>
            <TabsTrigger value="segmentation" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Customer Segments</span>
              <span className="sm:hidden">Segments</span>
            </TabsTrigger>
            <TabsTrigger value="pricing" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">Pricing Optimization</span>
              <span className="sm:hidden">Pricing</span>
            </TabsTrigger>
          </TabsList>

          {/* Advanced Analytics Tab */}
          <TabsContent value="advanced" className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline" className="bg-analytics-primary text-white border-analytics-primary">
                Advanced Analytics
              </Badge>
              <h2 className="text-xl font-semibold">Predictive Models & Performance</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* CLV Trend */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="h-5 w-5" />
                    Customer Lifetime Value Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsLineChart data={clvTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value}`, ""]} />
                      <Legend />
                      <Line type="monotone" dataKey="clv" stroke="#3b82f6" strokeWidth={2} name="Actual CLV" />
                      <Line type="monotone" dataKey="predicted" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" name="Predicted CLV" />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Model Performance */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Model Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {modelPerformanceData.map((model, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{model.model}</span>
                          <span className="text-sm text-muted-foreground">{model.accuracy}% accuracy</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <div className="text-muted-foreground">Precision</div>
                            <Progress value={model.precision} className="h-2" />
                            <div className="text-right">{model.precision}%</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Recall</div>
                            <Progress value={model.recall} className="h-2" />
                            <div className="text-right">{model.recall}%</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Accuracy</div>
                            <Progress value={model.accuracy} className="h-2" />
                            <div className="text-right">{model.accuracy}%</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Risk Assessment Tab */}
          <TabsContent value="risk" className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline" className="bg-analytics-secondary text-white border-analytics-secondary">
                Risk Assessment
              </Badge>
              <h2 className="text-xl font-semibold">Risk Scoring & Distribution</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Risk Distribution */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Risk Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <RechartsPieChart data={riskDistributionData}>
                        {riskDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </RechartsPieChart>
                      <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {riskDistributionData.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }}></div>
                        <span className="text-sm">{item.name}: {item.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Risk Factors */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Top Risk Factors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { factor: "Age > 65", impact: 85, trend: "up" },
                      { factor: "Previous Claims", impact: 78, trend: "stable" },
                      { factor: "High-Risk Location", impact: 72, trend: "down" },
                      { factor: "Credit Score < 600", impact: 68, trend: "up" },
                      { factor: "Occupation Risk", impact: 65, trend: "stable" },
                      { factor: "Multiple Vehicles", impact: 58, trend: "down" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium">{item.factor}</span>
                            <span className="text-sm text-muted-foreground">{item.impact}% impact</span>
                          </div>
                          <Progress value={item.impact} className="h-2" />
                        </div>
                        <div className="ml-4">
                          {item.trend === "up" && <TrendingUp className="h-4 w-4 text-red-500" />}
                          {item.trend === "down" && <TrendingUp className="h-4 w-4 text-green-500 rotate-180" />}
                          {item.trend === "stable" && <div className="h-4 w-4 bg-gray-400 rounded-full"></div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Customer Segmentation Tab */}
          <TabsContent value="segmentation" className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline" className="bg-analytics-accent text-white border-analytics-accent">
                Customer Segmentation
              </Badge>
              <h2 className="text-xl font-semibold">Customer Segments & Performance</h2>
            </div>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Segment Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <ScatterChart data={customerSegmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="avgPremium" name="Avg Premium" />
                    <YAxis dataKey="claimRate" name="Claim Rate" />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === "avgPremium" ? `$${value}` : `${value}%`,
                        name === "avgPremium" ? "Avg Premium" : "Claim Rate"
                      ]}
                      labelFormatter={(value) => `Customers: ${value}`}
                    />
                    <Scatter dataKey="count" fill="#3b82f6" />
                  </ScatterChart>
                </ResponsiveContainer>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                  {customerSegmentData.map((segment, index) => (
                    <Card key={index} className="shadow-sm">
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2">{segment.segment}</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Customers:</span>
                            <span className="font-medium">{segment.count.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Avg Premium:</span>
                            <span className="font-medium">${segment.avgPremium}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Claim Rate:</span>
                            <span className="font-medium">{segment.claimRate}%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing Optimization Tab */}
          <TabsContent value="pricing" className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline" className="bg-analytics-success text-white border-analytics-success">
                Pricing Optimization
              </Badge>
              <h2 className="text-xl font-semibold">Premium Pricing Analysis</h2>
            </div>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Pricing Optimization Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsBarChart data={pricingOptimizationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="riskLevel" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, ""]} />
                    <Legend />
                    <Bar dataKey="currentPrice" fill="#6b7280" name="Current Price" />
                    <Bar dataKey="optimalPrice" fill="#3b82f6" name="Optimal Price" />
                  </RechartsBarChart>
                </ResponsiveContainer>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                  {pricingOptimizationData.map((item, index) => (
                    <Card key={index} className="shadow-sm">
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2">{item.riskLevel} Risk</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Current:</span>
                            <span className="font-medium">${item.currentPrice}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Optimal:</span>
                            <span className="font-medium">${item.optimalPrice}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Uplift:</span>
                            <span className="font-medium text-analytics-success">+{item.uplift}%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AnalyticsDashboard;