import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lightbulb, TrendingUp, AlertTriangle, Target, Download, FileText } from "lucide-react";
import { useMemo } from "react";

interface InsightsSummaryProps {
  data: any[];
  headers: string[];
}

export function InsightsSummary({ data, headers }: InsightsSummaryProps) {
  const insights = useMemo(() => {
    const numericColumns = headers.filter(header => {
      const sample = data.find(row => row[header] !== null && row[header] !== undefined && row[header] !== '');
      if (!sample) return false;
      const value = sample[header];
      return !isNaN(Number(value)) && value !== '';
    });

    const categoricalColumns = headers.filter(header => !numericColumns.includes(header));

    const findings = [];

    // Data Quality Insights
    const totalCells = data.length * headers.length;
    const nullCells = headers.reduce((sum, header) => {
      return sum + data.filter(row => row[header] === null || row[header] === undefined || row[header] === '').length;
    }, 0);
    const completeness = ((totalCells - nullCells) / totalCells * 100).toFixed(1);

    if (Number(completeness) < 90) {
      findings.push({
        type: 'warning',
        title: 'Data Quality Concern',
        description: `Data completeness is ${completeness}%, indicating significant missing values that may impact analysis.`,
        recommendation: 'Consider data imputation strategies or investigate data collection processes.'
      });
    } else {
      findings.push({
        type: 'success',
        title: 'High Data Quality',
        description: `Excellent data completeness at ${completeness}%, providing a solid foundation for analysis.`,
        recommendation: 'Proceed with advanced analytics and predictive modeling.'
      });
    }

    // Distribution Insights for Insurance Context
    const commonInsuranceColumns = {
      age: ['age', 'customer_age', 'policyholder_age'],
      premium: ['premium', 'premium_amount', 'annual_premium', 'monthly_premium'],
      claim: ['claim', 'claim_amount', 'claims', 'claim_total'],
      region: ['region', 'state', 'location', 'area', 'zone'],
      gender: ['gender', 'sex'],
      policy: ['policy_type', 'coverage_type', 'plan', 'product']
    };

    // Find relevant columns
    const relevantColumns = Object.entries(commonInsuranceColumns).reduce((acc, [key, variations]) => {
      const found = headers.find(header => 
        variations.some(variation => header.toLowerCase().includes(variation.toLowerCase()))
      );
      if (found) acc[key] = found;
      return acc;
    }, {} as Record<string, string>);

    // Age Analysis
    if (relevantColumns.age && numericColumns.includes(relevantColumns.age)) {
      const ages = data.map(row => Number(row[relevantColumns.age])).filter(age => !isNaN(age));
      const avgAge = ages.length > 0 ? (ages.reduce((sum, age) => sum + age, 0) / ages.length).toFixed(1) : '0';
      const minAge = Math.min(...ages);
      const maxAge = Math.max(...ages);

      findings.push({
        type: 'insight',
        title: 'Customer Demographics',
        description: `Average customer age is ${avgAge} years (range: ${minAge}-${maxAge}). This indicates the primary customer segment.`,
        recommendation: 'Consider age-based premium adjustments and targeted marketing campaigns for different age groups.'
      });
    }

    // Premium Analysis
    if (relevantColumns.premium && numericColumns.includes(relevantColumns.premium)) {
      const premiums = data.map(row => Number(row[relevantColumns.premium])).filter(p => !isNaN(p) && p > 0);
      const avgPremium = premiums.length > 0 ? (premiums.reduce((sum, p) => sum + p, 0) / premiums.length).toFixed(2) : '0';
      const sorted = [...premiums].sort((a, b) => a - b);
      const median = sorted[Math.floor(sorted.length / 2)].toFixed(2);

      findings.push({
        type: 'insight',
        title: 'Premium Structure',
        description: `Average premium is $${avgPremium} with a median of $${median}. This suggests the pricing distribution.`,
        recommendation: 'Analyze premium vs. claims ratio to optimize pricing strategies and identify profitable segments.'
      });
    }

    // Claims Analysis
    if (relevantColumns.claim && numericColumns.includes(relevantColumns.claim)) {
      const claims = data.map(row => Number(row[relevantColumns.claim])).filter(c => !isNaN(c) && c >= 0);
      const avgClaim = (claims.reduce((sum, c) => sum + c, 0) / claims.length).toFixed(2);
      const zeroClaims = claims.filter(c => c === 0).length;
      const claimRate = ((claims.length - zeroClaims) / claims.length * 100).toFixed(1);

      findings.push({
        type: 'insight',
        title: 'Claims Pattern',
        description: `Average claim amount is $${avgClaim} with a claim rate of ${claimRate}%.`,
        recommendation: 'Focus on claim prevention strategies and risk assessment improvements for high-claim segments.'
      });
    }

    // Regional Analysis
    if (relevantColumns.region && categoricalColumns.includes(relevantColumns.region)) {
      const regions = data.map(row => row[relevantColumns.region]).filter(r => r);
      const regionCounts = regions.reduce((acc, region) => {
        acc[region] = (acc[region] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const topRegion = Object.entries(regionCounts)
        .sort(([,a], [,b]) => (b as number) - (a as number))[0];

      if (topRegion) {
        const percentage = (((topRegion[1] as number) / regions.length) * 100).toFixed(1);
        findings.push({
          type: 'insight',
          title: 'Geographic Distribution',
          description: `${topRegion[0]} represents ${percentage}% of customers, indicating geographic concentration.`,
          recommendation: 'Consider regional risk factors and local market expansion opportunities.'
        });
      }
    }

    // Outlier Detection
    numericColumns.forEach(column => {
      const values = data.map(row => Number(row[column])).filter(v => !isNaN(v));
      if (values.length > 10) {
        const sorted = [...values].sort((a, b) => a - b);
        const q1 = sorted[Math.floor(sorted.length * 0.25)];
        const q3 = sorted[Math.floor(sorted.length * 0.75)];
        const iqr = q3 - q1;
        const outliers = values.filter(v => v < q1 - 1.5 * iqr || v > q3 + 1.5 * iqr);
        
        if (outliers.length > values.length * 0.05) { // More than 5% outliers
          findings.push({
            type: 'warning',
            title: `Outliers in ${column}`,
            description: `${outliers.length} outliers detected (${(outliers.length / values.length * 100).toFixed(1)}% of data).`,
            recommendation: 'Investigate outliers for data entry errors or legitimate extreme cases that may need special handling.'
          });
        }
      }
    });

    return findings;
  }, [data, headers]);

  const generateReport = () => {
    const report = `
# Insurance Data Analysis Report

## Dataset Overview
- **Total Records**: ${data.length.toLocaleString()}
- **Total Columns**: ${headers.length}
- **Generated**: ${new Date().toLocaleDateString()}

## Key Insights

${insights.map((insight, index) => `
### ${index + 1}. ${insight.title}
**Type**: ${insight.type.charAt(0).toUpperCase() + insight.type.slice(1)}

**Finding**: ${insight.description}

**Recommendation**: ${insight.recommendation}
`).join('\n')}

## Data Columns
${headers.map(header => `- ${header}`).join('\n')}

## Next Steps
1. Implement data cleaning procedures for missing values
2. Develop predictive models for key metrics
3. Create automated monitoring dashboards
4. Establish data quality benchmarks
5. Design targeted business strategies based on insights

---
*This report was generated automatically based on the uploaded insurance dataset.*
    `;

    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'insurance-data-analysis-report.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-elevated border-analytics-primary/20">
        <CardHeader className="bg-gradient-primary text-white">
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Business Insights & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4">
            {insights.map((insight, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  insight.type === 'success'
                    ? 'bg-analytics-success/10 border-analytics-success'
                    : insight.type === 'warning'
                    ? 'bg-analytics-warning/10 border-analytics-warning'
                    : 'bg-analytics-primary/10 border-analytics-primary'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {insight.type === 'success' ? (
                      <TrendingUp className="h-5 w-5 text-analytics-success" />
                    ) : insight.type === 'warning' ? (
                      <AlertTriangle className="h-5 w-5 text-analytics-warning" />
                    ) : (
                      <Lightbulb className="h-5 w-5 text-analytics-primary" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{insight.title}</h3>
                      <Badge
                        variant="outline"
                        className={
                          insight.type === 'success'
                            ? 'border-analytics-success text-analytics-success'
                            : insight.type === 'warning'
                            ? 'border-analytics-warning text-analytics-warning'
                            : 'border-analytics-primary text-analytics-primary'
                        }
                      >
                        {insight.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {insight.description}
                    </p>
                    <div className="flex items-start gap-2 mt-2">
                      <Target className="h-4 w-4 text-analytics-accent mt-0.5 flex-shrink-0" />
                      <p className="text-sm font-medium text-analytics-accent">
                        {insight.recommendation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">Analysis Complete</h4>
                <p className="text-sm text-muted-foreground">
                  {insights.length} key insights identified for business action
                </p>
              </div>
              <Button onClick={generateReport} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-analytics-secondary" />
            Recommended Next Steps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-analytics-primary/5 rounded-lg">
              <h4 className="font-medium text-analytics-primary mb-2">
                Advanced Analytics
              </h4>
              <p className="text-sm text-muted-foreground">
                Build predictive models for customer lifetime value, claim probability, and churn prediction.
              </p>
            </div>
            <div className="p-4 bg-analytics-secondary/5 rounded-lg">
              <h4 className="font-medium text-analytics-secondary mb-2">
                Risk Assessment
              </h4>
              <p className="text-sm text-muted-foreground">
                Develop risk scoring models based on customer demographics and historical patterns.
              </p>
            </div>
            <div className="p-4 bg-analytics-accent/5 rounded-lg">
              <h4 className="font-medium text-analytics-accent mb-2">
                Customer Segmentation
              </h4>
              <p className="text-sm text-muted-foreground">
                Create customer segments for targeted marketing and personalized product offerings.
              </p>
            </div>
            <div className="p-4 bg-analytics-success/5 rounded-lg">
              <h4 className="font-medium text-analytics-success mb-2">
                Pricing Optimization
              </h4>
              <p className="text-sm text-muted-foreground">
                Adjust premium pricing based on risk factors and competitive market analysis.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}