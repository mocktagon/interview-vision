import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Candidate } from "@/types/candidate";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, ComposedChart, Line } from "recharts";
import { Star, TrendingUp } from "lucide-react";

interface ScoreDistributionChartProps {
  candidates: Candidate[];
}

export const ScoreDistributionChart = ({ candidates }: ScoreDistributionChartProps) => {
  // Create histogram bins (0-10, 10-20, ..., 90-100)
  const binSize = 10;
  const bins = Array.from({ length: 10 }, (_, i) => ({
    binStart: i * binSize,
    binEnd: (i + 1) * binSize,
    count: 0,
    starred: 0,
    density: 0,
    color: (i + 1) * binSize >= 90 
      ? "hsl(var(--success))" 
      : (i + 1) * binSize >= 80 
      ? "hsl(var(--primary))" 
      : (i + 1) * binSize >= 70 
      ? "hsl(var(--accent))" 
      : (i + 1) * binSize >= 60
      ? "hsl(var(--warning))"
      : "hsl(var(--muted))"
  }));

  // Fill bins with candidate data
  candidates.forEach(candidate => {
    const score = candidate.scores.overall || 0;
    const binIndex = Math.min(Math.floor(score / binSize), 9);
    bins[binIndex].count += 1;
    if (candidate.starred) {
      bins[binIndex].starred += 1;
    }
  });

  // Calculate density for continuous curve
  const totalCandidates = candidates.length;
  bins.forEach(bin => {
    bin.density = totalCandidates > 0 ? (bin.count / totalCandidates) * 100 : 0;
  });

  const distribution = bins.map(bin => ({
    range: `${bin.binStart}-${bin.binEnd}`,
    midpoint: bin.binStart + binSize / 2,
    count: bin.count,
    starred: bin.starred,
    density: bin.density,
    color: bin.color
  }));

  const topStarsCount = candidates.filter(c => (c.scores.overall || 0) >= 90).length;
  const avgScore = candidates.length > 0 
    ? Math.round(candidates.reduce((sum, c) => sum + (c.scores.overall || 0), 0) / candidates.length)
    : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Score Distribution Histogram</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Continuous distribution of candidate performance
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
          <ComposedChart data={distribution} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <defs>
              <linearGradient id="densityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="range"
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              label={{ value: 'Score Range', position: 'insideBottom', offset: -10, fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis 
              yAxisId="left"
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              label={{ value: 'Frequency', angle: -90, position: 'insideLeft', fill: "hsl(var(--muted-foreground))" }}
              allowDecimals={false}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="hsl(var(--primary))"
              tick={{ fill: "hsl(var(--primary))", fontSize: 12 }}
              label={{ value: 'Density (%)', angle: 90, position: 'insideRight', fill: "hsl(var(--primary))" }}
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
                if (name === "density") return [`${Number(value).toFixed(1)}%`, "Density"];
                if (name === "starred") return [value, "Starred"];
                return [value, name];
              }}
              labelFormatter={(label) => `Score Range: ${label}`}
            />
            <Bar 
              yAxisId="left"
              dataKey="count" 
              fill="hsl(var(--accent))" 
              radius={[4, 4, 0, 0]}
              opacity={0.8}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="density"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={{ fill: "hsl(var(--primary))", r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="density"
              fill="url(#densityGradient)"
              stroke="none"
            />
          </ComposedChart>
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
