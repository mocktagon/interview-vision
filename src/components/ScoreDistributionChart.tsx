import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Candidate } from "@/types/candidate";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, Cell, ZAxis, Legend } from "recharts";
import { Star, TrendingUp } from "lucide-react";

interface ScoreDistributionChartProps {
  candidates: Candidate[];
}

export const ScoreDistributionChart = ({ candidates }: ScoreDistributionChartProps) => {
  // Group candidates by individual scores
  const scoreMap = new Map<number, { count: number; starred: number; candidates: Candidate[] }>();
  
  candidates.forEach(candidate => {
    const score = Math.round(candidate.scores.overall || 0);
    const existing = scoreMap.get(score) || { count: 0, starred: 0, candidates: [] };
    scoreMap.set(score, {
      count: existing.count + 1,
      starred: existing.starred + (candidate.starred ? 1 : 0),
      candidates: [...existing.candidates, candidate]
    });
  });

  // Convert to array and sort by score
  const distribution = Array.from(scoreMap.entries())
    .map(([score, data]) => ({
      score,
      count: data.count,
      starred: data.starred,
      candidates: data.candidates,
      color: score >= 90 
        ? "hsl(var(--success))" 
        : score >= 80 
        ? "hsl(var(--primary))" 
        : score >= 70 
        ? "hsl(var(--accent))" 
        : score >= 60
        ? "hsl(var(--warning))"
        : "hsl(var(--muted))"
    }))
    .sort((a, b) => a.score - b.score);

  const topStarsCount = candidates.filter(c => (c.scores.overall || 0) >= 90).length;
  const avgScore = candidates.length > 0 
    ? Math.round(candidates.reduce((sum, c) => sum + (c.scores.overall || 0), 0) / candidates.length)
    : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Score Distribution Analysis</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Unit-level view of candidate performance scores
            </p>
          </div>
          <div className="flex gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-success/10 border border-success/20">
              <Star className="h-4 w-4 text-success fill-success" />
              <div className="text-right">
                <div className="text-2xl font-bold text-success">{topStarsCount}</div>
                <div className="text-xs text-success/80">Top Stars (90+)</div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
              <TrendingUp className="h-4 w-4 text-primary" />
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">{avgScore}</div>
                <div className="text-xs text-primary/80">Average Score</div>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={distribution} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="score"
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              label={{ value: 'Score', position: 'insideBottom', offset: -10, fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              label={{ value: 'Number of Candidates', angle: -90, position: 'insideLeft', fill: "hsl(var(--muted-foreground))" }}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                color: "hsl(var(--foreground))",
                padding: "12px"
              }}
              formatter={(value: any, name: string) => {
                if (name === "count") return [value, "Candidates"];
                if (name === "starred") return [value, "Starred"];
                return [value, name];
              }}
              labelFormatter={(label) => `Score: ${label}`}
            />
            <Legend 
              wrapperStyle={{ color: "hsl(var(--foreground))", paddingTop: "20px" }}
              formatter={(value) => value === "count" ? "Total Candidates" : "Starred Candidates"}
            />
            <Bar dataKey="count" radius={[8, 8, 0, 0]} maxBarSize={50}>
              {distribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} opacity={0.9} />
              ))}
            </Bar>
            <Bar dataKey="starred" fill="hsl(var(--warning))" radius={[8, 8, 0, 0]} maxBarSize={50} opacity={0.7} />
          </BarChart>
        </ResponsiveContainer>
        
        <div className="mt-6 grid grid-cols-5 gap-3">
          <div className="text-center p-3 rounded-lg border border-success/30 bg-success/5">
            <div className="text-xs text-muted-foreground mb-1">Top Stars</div>
            <div className="text-xl font-bold text-success">90-100</div>
            <div className="text-sm text-muted-foreground mt-1">
              {candidates.filter(c => (c.scores.overall || 0) >= 90).length} candidates
            </div>
          </div>
          <div className="text-center p-3 rounded-lg border border-primary/30 bg-primary/5">
            <div className="text-xs text-muted-foreground mb-1">High Performers</div>
            <div className="text-xl font-bold text-primary">80-89</div>
            <div className="text-sm text-muted-foreground mt-1">
              {candidates.filter(c => (c.scores.overall || 0) >= 80 && (c.scores.overall || 0) < 90).length} candidates
            </div>
          </div>
          <div className="text-center p-3 rounded-lg border border-accent/30 bg-accent/5">
            <div className="text-xs text-muted-foreground mb-1">Good</div>
            <div className="text-xl font-bold text-accent">70-79</div>
            <div className="text-sm text-muted-foreground mt-1">
              {candidates.filter(c => (c.scores.overall || 0) >= 70 && (c.scores.overall || 0) < 80).length} candidates
            </div>
          </div>
          <div className="text-center p-3 rounded-lg border border-warning/30 bg-warning/5">
            <div className="text-xs text-muted-foreground mb-1">Average</div>
            <div className="text-xl font-bold text-warning">60-69</div>
            <div className="text-sm text-muted-foreground mt-1">
              {candidates.filter(c => (c.scores.overall || 0) >= 60 && (c.scores.overall || 0) < 70).length} candidates
            </div>
          </div>
          <div className="text-center p-3 rounded-lg border border-muted bg-muted/5">
            <div className="text-xs text-muted-foreground mb-1">Below Average</div>
            <div className="text-xl font-bold text-muted-foreground">0-59</div>
            <div className="text-sm text-muted-foreground mt-1">
              {candidates.filter(c => (c.scores.overall || 0) < 60).length} candidates
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
