import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

interface ATSvsAIChartProps {
  data: {
    category: string;
    ats: number;
    ai: number;
  }[];
  title?: string;
  description?: string;
}

export function ATSvsAIChart({ data, title = "ATS vs FunnelHQ AI Analysis", description = "Comparing traditional resume screening with AI interview insights" }: ATSvsAIChartProps) {
  const atsAvg = Math.round(data.reduce((sum, item) => sum + item.ats, 0) / data.length);
  const aiAvg = Math.round(data.reduce((sum, item) => sum + item.ai, 0) / data.length);
  const improvement = aiAvg - atsAvg;

  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              {improvement > 0 ? (
                <TrendingUp className="h-4 w-4 text-success" />
              ) : (
                <TrendingDown className="h-4 w-4 text-destructive" />
              )}
              <span className={`text-sm font-semibold ${improvement > 0 ? 'text-success' : 'text-destructive'}`}>
                {improvement > 0 ? '+' : ''}{improvement}% AI Advantage
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              ATS: {atsAvg}% | AI: {aiAvg}%
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="category" 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px'
              }}
            />
            <Legend />
            <Bar dataKey="ats" name="ATS Score" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="ai" name="FunnelHQ AI" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
