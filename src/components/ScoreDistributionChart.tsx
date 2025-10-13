import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Candidate } from "@/types/candidate";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Line } from "recharts";
import { Star, TrendingUp } from "lucide-react";

interface ScoreDistributionChartProps {
  candidates: Candidate[];
  aiQuery?: string;
}

export const ScoreDistributionChart = ({ candidates, aiQuery }: ScoreDistributionChartProps) => {
  // Generate dummy ATS scores - clustered high with low variance (showing they're not discriminative)
  const atsScores = candidates.map(() => {
    // ATS scores tend to cluster between 75-95, showing poor discrimination
    return 75 + Math.random() * 20 + (Math.random() > 0.5 ? 5 : 0);
  });

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
    let aiDensity = 0;
    let atsDensity = 0;
    let starredDensity = 0;
    
    // AI Interview scores (actual scores)
    candidates.forEach((candidate, idx) => {
      const aiScore = candidate.scores.overall || 0;
      const atsScore = atsScores[idx];
      
      aiDensity += gaussianKernel(x, aiScore, bandwidth);
      atsDensity += gaussianKernel(x, atsScore, bandwidth);
      
      if (candidate.starred) {
        starredDensity += gaussianKernel(x, aiScore, bandwidth);
      }
    });
    
    // Normalize
    const normalizedAIDensity = candidates.length > 0 ? aiDensity / candidates.length : 0;
    const normalizedATSDensity = candidates.length > 0 ? atsDensity / candidates.length : 0;
    const normalizedStarredDensity = candidates.length > 0 ? starredDensity / candidates.length : 0;
    
    return {
      score: Math.round(x * 10) / 10,
      aiDensity: normalizedAIDensity * 100,
      atsDensity: normalizedATSDensity * 100,
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
  
  const maxDensity = Math.max(...kdeData.map(d => Math.max(d.aiDensity, d.atsDensity)));

  return (
    <Card>
      <CardHeader className="p-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm">Candidate Distribution</CardTitle>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              <span className="text-primary font-medium">FunnelHQ</span> vs <span className="text-destructive font-medium">ATS</span>
            </p>
            {aiQuery && (
              <div className="mt-1 flex items-center gap-1 text-[10px]">
                <div className="h-1 w-1 rounded-full bg-primary animate-pulse" />
                <span className="text-primary font-medium truncate">{aiQuery}</span>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-success/10 border border-success/20">
              <Star className="h-3 w-3 text-success fill-success" />
              <div className="text-right">
                <div className="text-sm font-bold text-success">{topStarsCount}</div>
                <div className="text-[8px] text-success/80">Top 90+</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-primary/10 border border-primary/20">
              <TrendingUp className="h-3 w-3 text-primary" />
              <div className="text-right">
                <div className="text-sm font-bold text-primary">{avgScore.toFixed(1)}</div>
                <div className="text-[8px] text-primary/80">Mean</div>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-2">
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={kdeData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
            <defs>
              <linearGradient id="aiDensityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05}/>
              </linearGradient>
              <linearGradient id="atsDensityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="score"
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }}
              label={{ value: 'Score', position: 'insideBottom', offset: -5, fill: "hsl(var(--muted-foreground))", fontSize: 9 }}
              domain={[0, 100]}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }}
              label={{ value: 'Density', angle: -90, position: 'insideLeft', fill: "hsl(var(--muted-foreground))", fontSize: 9 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
                color: "hsl(var(--foreground))",
                padding: "6px",
                fontSize: "10px"
              }}
              formatter={(value: any, name: string) => {
                if (name === "aiDensity") return [`${Number(value).toFixed(2)}`, "FunnelHQ"];
                if (name === "atsDensity") return [`${Number(value).toFixed(2)}`, "ATS"];
                if (name === "starredDensity") return [`${Number(value).toFixed(2)}`, "Top Performers"];
                return [value, name];
              }}
              labelFormatter={(label) => `Score: ${Number(label).toFixed(1)}`}
            />
            
            {/* Reference lines for score zones */}
            <ReferenceLine x={90} stroke="hsl(var(--success))" strokeDasharray="2 2" strokeOpacity={0.3} />
            <ReferenceLine x={80} stroke="hsl(var(--primary))" strokeDasharray="2 2" strokeOpacity={0.3} />
            <ReferenceLine x={70} stroke="hsl(var(--accent))" strokeDasharray="2 2" strokeOpacity={0.3} />
            <ReferenceLine x={60} stroke="hsl(var(--warning))" strokeDasharray="2 2" strokeOpacity={0.3} />
            
            
            {/* ATS Resume Scoring - clustered and less discriminative */}
            <Area
              type="monotone"
              dataKey="atsDensity"
              stroke="hsl(var(--destructive))"
              strokeWidth={1.5}
              strokeDasharray="3 3"
              fill="url(#atsDensityGradient)"
              name="ATS"
            />
            
            {/* FunnelHQ Analysis */}
            <Area
              type="monotone"
              dataKey="aiDensity"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#aiDensityGradient)"
              name="FunnelHQ"
            />
          </AreaChart>
        </ResponsiveContainer>
        
        {/* Key Insight */}
        <div className="mt-2 p-2 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-start gap-1.5">
            <div className="p-1 rounded-lg bg-primary/10 flex-shrink-0">
              <Star className="h-3 w-3 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-[10px] text-foreground mb-0.5">Key Insight</h4>
              <p className="text-[9px] text-muted-foreground leading-tight">
                <span className="text-destructive font-medium">ATS</span> clusters at 75-95. 
                <span className="text-primary font-medium"> FunnelHQ</span> shows wider distribution.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-2 grid grid-cols-2 gap-1.5">
          <div className="text-center p-1.5 rounded-lg border border-success/30 bg-success/5">
            <div className="text-[8px] text-muted-foreground mb-0.5">Top</div>
            <div className="text-xs font-bold text-success">90+</div>
            <div className="text-[8px] text-muted-foreground mt-0.5">
              {candidates.filter(c => (c.scores.overall || 0) >= 90).length}
            </div>
          </div>
          <div className="text-center p-1.5 rounded-lg border border-primary/30 bg-primary/5">
            <div className="text-[8px] text-muted-foreground mb-0.5">High</div>
            <div className="text-xs font-bold text-primary">80-89</div>
            <div className="text-[8px] text-muted-foreground mt-0.5">
              {candidates.filter(c => (c.scores.overall || 0) >= 80 && (c.scores.overall || 0) < 90).length}
            </div>
          </div>
          <div className="text-center p-1.5 rounded-lg border border-accent/30 bg-accent/5">
            <div className="text-[8px] text-muted-foreground mb-0.5">Good</div>
            <div className="text-xs font-bold text-accent">70-79</div>
            <div className="text-[8px] text-muted-foreground mt-0.5">
              {candidates.filter(c => (c.scores.overall || 0) >= 70 && (c.scores.overall || 0) < 80).length}
            </div>
          </div>
          <div className="text-center p-1.5 rounded-lg border border-warning/30 bg-warning/5">
            <div className="text-[8px] text-muted-foreground mb-0.5">Avg</div>
            <div className="text-xs font-bold text-warning">60-69</div>
            <div className="text-[8px] text-muted-foreground mt-0.5">
              {candidates.filter(c => (c.scores.overall || 0) >= 60 && (c.scores.overall || 0) < 70).length}
            </div>
          </div>
          <div className="text-center p-1.5 rounded-lg border border-muted bg-muted/5">
            <div className="text-[8px] text-muted-foreground mb-0.5">Low</div>
            <div className="text-xs font-bold text-muted-foreground">&lt;60</div>
            <div className="text-[8px] text-muted-foreground mt-0.5">
              {candidates.filter(c => (c.scores.overall || 0) < 60).length}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
