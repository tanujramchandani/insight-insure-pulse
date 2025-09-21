import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Shield, Users, DollarSign, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface NextStepsPreviewProps {
  hasData: boolean;
}

export const NextStepsPreview = ({ hasData }: NextStepsPreviewProps) => {
  const nextSteps = [
    {
      icon: Brain,
      title: "Advanced Analytics",
      description: "Build predictive models for customer lifetime value, claim probability, and churn prediction.",
      color: "analytics-primary",
      available: hasData
    },
    {
      icon: Shield,
      title: "Risk Assessment",
      description: "Develop risk scoring models based on customer demographics and historical patterns.",
      color: "analytics-secondary",
      available: hasData
    },
    {
      icon: Users,
      title: "Customer Segmentation",
      description: "Create customer segments for targeted marketing and personalized product offerings.",
      color: "analytics-accent",
      available: hasData
    },
    {
      icon: DollarSign,
      title: "Pricing Optimization",
      description: "Adjust premium pricing based on risk factors and competitive market analysis.",
      color: "analytics-success",
      available: hasData
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-analytics-primary/10 rounded-lg">
          <ArrowRight className="h-6 w-6 text-analytics-primary" />
        </div>
        <h2 className="text-2xl font-bold">Recommended Next Steps</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {nextSteps.map((step, index) => {
          const IconComponent = step.icon;
          return (
            <Card key={index} className={`shadow-card transition-all hover:shadow-elevated ${!step.available ? 'opacity-60' : ''}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className={`p-2 bg-${step.color}/10 rounded-lg`}>
                    <IconComponent className={`h-6 w-6 text-${step.color}`} />
                  </div>
                  <div className="flex-1">
                    {step.title}
                    {!step.available && (
                      <Badge variant="outline" className="ml-2 text-xs">
                        Upload data first
                      </Badge>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {step.description}
                </p>
                {step.available ? (
                  <Link to="/analytics-dashboard">
                    <Button className="w-full" variant="outline">
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Explore Analytics
                    </Button>
                  </Link>
                ) : (
                  <Button className="w-full" variant="outline" disabled>
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Requires Data Upload
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {hasData && (
        <Card className="shadow-card bg-gradient-to-r from-analytics-primary/5 to-analytics-secondary/5 border-analytics-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">Ready for Advanced Analytics?</h3>
                <p className="text-muted-foreground">
                  Your dataset is loaded and ready for comprehensive analysis with our advanced predictive models.
                </p>
              </div>
              <Link to="/analytics-dashboard">
                <Button size="lg" className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Launch Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};