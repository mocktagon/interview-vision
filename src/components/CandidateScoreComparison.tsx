import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle, TrendingUp } from "lucide-react";

interface ScoreComparisonProps {
  candidateName: string;
  atsScore: {
    overall: number;
    resumeMatch: number;
    skillsMatch: number;
    experienceMatch: number;
    educationMatch: number;
  };
  aiScore: {
    overall: number;
    technicalSkills: number;
    problemSolving: number;
    communication: number;
    culturalFit: number;
    leadership: number;
  };
}

export function CandidateScoreComparison({ candidateName, atsScore, aiScore }: ScoreComparisonProps) {
  const scoreDiff = aiScore.overall - atsScore.overall;
  
  const atsMetrics = [
    { label: "Resume Match", value: atsScore.resumeMatch },
    { label: "Skills Match", value: atsScore.skillsMatch },
    { label: "Experience", value: atsScore.experienceMatch },
    { label: "Education", value: atsScore.educationMatch },
  ];

  const aiMetrics = [
    { label: "Technical Skills", value: aiScore.technicalSkills },
    { label: "Problem Solving", value: aiScore.problemSolving },
    { label: "Communication", value: aiScore.communication },
    { label: "Cultural Fit", value: aiScore.culturalFit },
    { label: "Leadership", value: aiScore.leadership },
  ];

  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Scoring Analysis: {candidateName}</CardTitle>
            <CardDescription>Traditional ATS vs AI-Powered Interview Assessment</CardDescription>
          </div>
          {scoreDiff > 0 ? (
            <Badge variant="default" className="bg-success/10 text-success border-success/20">
              <TrendingUp className="h-3 w-3 mr-1" />
              AI Reveals +{scoreDiff}% More Potential
            </Badge>
          ) : scoreDiff < 0 ? (
            <Badge variant="default" className="bg-destructive/10 text-destructive border-destructive/20">
              <AlertCircle className="h-3 w-3 mr-1" />
              Resume Overestimated by {Math.abs(scoreDiff)}%
            </Badge>
          ) : (
            <Badge variant="secondary">
              <CheckCircle className="h-3 w-3 mr-1" />
              Aligned Assessment
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Comparison */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground mb-2">ATS Overall Score</p>
            <p className="text-3xl font-bold text-foreground">{atsScore.overall}%</p>
            <p className="text-xs text-muted-foreground mt-1">Resume-based evaluation</p>
          </div>
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-sm text-muted-foreground mb-2">FunnelHQ AI Score</p>
            <p className="text-3xl font-bold text-primary">{aiScore.overall}%</p>
            <p className="text-xs text-muted-foreground mt-1">Interview-based evaluation</p>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* ATS Breakdown */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-foreground">ATS Metrics</h4>
            {atsMetrics.map((metric) => (
              <div key={metric.label} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{metric.label}</span>
                  <span className="font-medium text-foreground">{metric.value}%</span>
                </div>
                <Progress value={metric.value} className="h-2" />
              </div>
            ))}
          </div>

          {/* AI Breakdown */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-primary">FunnelHQ AI Metrics</h4>
            {aiMetrics.map((metric) => (
              <div key={metric.label} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{metric.label}</span>
                  <span className="font-medium text-foreground">{metric.value}%</span>
                </div>
                <Progress value={metric.value} className="h-2 [&>div]:bg-primary" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
