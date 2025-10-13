import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Candidate } from "@/types/candidate";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Line } from "recharts";
import { Star, TrendingUp } from "lucide-react";

interface ScoreDistributionChartProps {
  candidates: Candidate[];
}

export const ScoreDistributionChart = ({ candidates }: ScoreDistributionChartProps) => {
  // Kernel Density Estimation with Gaussian kernel
  const gaussianKernel = (x: number, xi: number, bandwidth: number): number => {
    const u = (x - xi) / bandwidth;
    return Math.exp(-0.5 * u * u) / (bandwidth * Math.sqrt(2 * Math.PI));
  };

  const bandwidth = 5; // Smoothing parameter
  const points = 100; // Number of points for smooth curve
  
  // Generate x-axis points
  const xPoints = Array.from({ length: points }, (_, i) => i * (100 / (points - 1)));
  
  // Calculate KDE for each point
  const kdeData = xPoints.map(x => {
    let density = 0;
    let starredDensity = 0;
    
    candidates.forEach(candidate => {
      const score = candidate.scores.overall || 0;
      const kernelValue = gaussianKernel(x, score, bandwidth);
      density += kernelValue;
      if (candidate.starred) {
        starredDensity += kernelValue;
      }
    });
    
    // Normalize
    const normalizedDensity = candidates.length > 0 ? density / candidates.length : 0;
    const normalizedStarredDensity = candidates.length > 0 ? starredDensity / candidates.length : 0;
    
    return {
      score: Math.round(x * 10) / 10,
      density: normalizedDensity * 100,
      starredDensity: normalizedStarredDensity * 100,
      color: x >= 90 
        ? "hsl(var(--success))" 
        : x >= 80 
        ? "hsl(var(--primary))" 
        : x >= 70 
        ? "hsl(var(--accent))" 
        : x >= 60
        ? "hsl(var(--warning))"
        : "hsl(var(--muted))"
    };
  });

  const topStarsCount = candidates.filter(c => (c.scores.overall || 0) >= 90).length;
  const avgScore = candidates.length > 0 
    ? candidates.reduce((sum, c) => sum + (c.scores.overall || 0), 0) / candidates.length
    : 0;
  
  const maxDensity = Math.max(...kdeData.map(d => d.density));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Kernel Density Distribution</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Smooth probability density of candidate scores
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
                <div className="text-2xl font-bold text-primary">{avgScore.toFixed(1)}</div>
                <div className="text-xs text-primary/80">Mean Score</div>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={kdeData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <defs>
              <linearGradient id="densityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05}/>
              </linearGradient>
              <linearGradient id="starredGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--warning))" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="hsl(var(--warning))" stopOpacity={0}/>
              </linearGradient>
              {/* Color zones */}
              <linearGradient id="colorZone" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="hsl(var(--muted))" stopOpacity={0.1}/>
                <stop offset="60%" stopColor="hsl(var(--warning))" stopOpacity={0.1}/>
                <stop offset="70%" stopColor="hsl(var(--accent))" stopOpacity={0.1}/>
                <stop offset="80%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                <stop offset="90%" stopColor="hsl(var(--success))" stopOpacity={0.15}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="score"
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              label={{ value: 'Score', position: 'insideBottom', offset: -10, fill: "hsl(var(--muted-foreground))" }}
              domain={[0, 100]}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              label={{ value: 'Probability Density', angle: -90, position: 'insideLeft', fill: "hsl(var(--muted-foreground))" }}
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
                if (name === "density") return [`${Number(value).toFixed(2)}`, "Density"];
                if (name === "starredDensity") return [`${Number(value).toFixed(2)}`, "Starred Density"];
                return [value, name];
              }}
              labelFormatter={(label) => `Score: ${Number(label).toFixed(1)}`}
            />
            
            {/* Reference lines for score zones */}
            <ReferenceLine x={90} stroke="hsl(var(--success))" strokeDasharray="3 3" strokeOpacity={0.5} />
            <ReferenceLine x={80} stroke="hsl(var(--primary))" strokeDasharray="3 3" strokeOpacity={0.5} />
            <ReferenceLine x={70} stroke="hsl(var(--accent))" strokeDasharray="3 3" strokeOpacity={0.5} />
            <ReferenceLine x={60} stroke="hsl(var(--warning))" strokeDasharray="3 3" strokeOpacity={0.5} />
            
            {/* Mean line */}
            <ReferenceLine 
              x={avgScore} 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              label={{ 
                value: `μ=${avgScore.toFixed(1)}`, 
                position: 'top',
                fill: "hsl(var(--primary))",
                fontSize: 12,
                fontWeight: 600
              }}
            />
            
            {/* Starred candidates density */}
            <Area
              type="monotone"
              dataKey="starredDensity"
              stroke="hsl(var(--warning))"
              strokeWidth={2}
              fill="url(#starredGradient)"
              name="Starred Density"
            />
            
            {/* Main density curve */}
            <Area
              type="monotone"
              dataKey="density"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              fill="url(#densityGradient)"
              name="Density"
            />
          </AreaChart>
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
