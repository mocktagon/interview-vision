import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FunnelStage {
  stage: string;
  atsCount: number;
  aiCount: number;
  total: number;
}

interface FunnelComparisonChartProps {
  data: FunnelStage[];
  title?: string;
}

export function FunnelComparisonChart({ data, title = "Candidate Pipeline: ATS vs AI Screening" }: FunnelComparisonChartProps) {
  const maxCount = Math.max(...data.map(d => d.total));
  
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>Quality candidates at each pipeline stage</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((stage, index) => {
          const atsPercent = (stage.atsCount / stage.total) * 100;
          const aiPercent = (stage.aiCount / stage.total) * 100;
          const stageWidth = (stage.total / maxCount) * 100;
          const improvement = Math.round(aiPercent - atsPercent);
          
          return (
            <div key={stage.stage} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{stage.stage}</span>
                  <Badge variant="secondary" className="text-xs">
                    {stage.total} candidates
                  </Badge>
                </div>
                {improvement !== 0 && (
                  <Badge 
                    variant={improvement > 0 ? "default" : "secondary"}
                    className={improvement > 0 ? "bg-success/10 text-success border-success/20" : "bg-destructive/10 text-destructive border-destructive/20"}
                  >
                    {improvement > 0 ? '+' : ''}{improvement}%
                  </Badge>
                )}
              </div>
              
              {/* Funnel Visualization */}
              <div className="relative h-16 flex items-center justify-center">
                <div 
                  className="relative h-full bg-gradient-to-r from-muted to-muted/50 rounded-sm transition-all duration-300"
                  style={{ width: `${stageWidth}%` }}
                >
                  {/* ATS Layer */}
                  <div 
                    className="absolute top-0 left-0 h-1/2 bg-muted rounded-t-sm flex items-center justify-center"
                    style={{ width: `${atsPercent}%` }}
                  >
                    {atsPercent > 15 && (
                      <span className="text-xs font-medium text-muted-foreground">
                        ATS: {stage.atsCount}
                      </span>
                    )}
                  </div>
                  
                  {/* AI Layer */}
                  <div 
                    className="absolute bottom-0 left-0 h-1/2 bg-primary rounded-b-sm flex items-center justify-center"
                    style={{ width: `${aiPercent}%` }}
                  >
                    {aiPercent > 15 && (
                      <span className="text-xs font-medium text-primary-foreground">
                        AI: {stage.aiCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Metrics */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-muted" />
                  <span className="text-muted-foreground">ATS Passed: {atsPercent.toFixed(0)}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-muted-foreground">AI Passed: {aiPercent.toFixed(0)}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
