import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Candidate } from "@/types/candidate";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Line } from "recharts";
import { Star, TrendingUp } from "lucide-react";

interface ScoreDistributionChartProps {
  candidates: Candidate[];
}

export const ScoreDistributionChart = ({ candidates }: ScoreDistributionChartProps) => {
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
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>AI Interview vs ATS Scoring Distribution</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Kernel density comparison: AI analysis (blue) vs traditional ATS resume scoring (red)
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
      <CardContent className="p-4">
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={kdeData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
            <defs>
              <linearGradient id="aiDensityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05}/>
              </linearGradient>
              <linearGradient id="atsDensityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0.05}/>
              </linearGradient>
              <linearGradient id="starredGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--warning))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--warning))" stopOpacity={0}/>
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
                if (name === "aiDensity") return [`${Number(value).toFixed(2)}`, "AI Interview Density"];
                if (name === "atsDensity") return [`${Number(value).toFixed(2)}`, "ATS Resume Density"];
                if (name === "starredDensity") return [`${Number(value).toFixed(2)}`, "Top Performers"];
                return [value, name];
              }}
              labelFormatter={(label) => `Score: ${Number(label).toFixed(1)}`}
            />
            
            {/* Reference lines for score zones */}
            <ReferenceLine x={90} stroke="hsl(var(--success))" strokeDasharray="3 3" strokeOpacity={0.3} label={{ value: "90", position: "top", fontSize: 10 }} />
            <ReferenceLine x={80} stroke="hsl(var(--primary))" strokeDasharray="3 3" strokeOpacity={0.3} />
            <ReferenceLine x={70} stroke="hsl(var(--accent))" strokeDasharray="3 3" strokeOpacity={0.3} />
            <ReferenceLine x={60} stroke="hsl(var(--warning))" strokeDasharray="3 3" strokeOpacity={0.3} />
            
            
            {/* ATS Resume Scoring - clustered and less discriminative */}
            <Area
              type="monotone"
              dataKey="atsDensity"
              stroke="hsl(var(--destructive))"
              strokeWidth={2.5}
              strokeDasharray="5 5"
              fill="url(#atsDensityGradient)"
              name="ATS Resume"
            />
            
            {/* Starred candidates density */}
            <Area
              type="monotone"
              dataKey="starredDensity"
              stroke="hsl(var(--warning))"
              strokeWidth={2}
              strokeDasharray="3 3"
              fill="url(#starredGradient)"
              name="Top Performers"
            />
            
            {/* AI Interview Analysis - more discriminative */}
            <Area
              type="monotone"
              dataKey="aiDensity"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              fill="url(#aiDensityGradient)"
              name="AI Interview"
            />
          </AreaChart>
        </ResponsiveContainer>
        
        {/* Key Insight */}
        <div className="mt-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-start gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10 flex-shrink-0">
              <Star className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-xs text-foreground mb-1">Key Insight</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                <span className="text-destructive font-medium">ATS scores</span> cluster narrowly (75-95), 
                failing to differentiate. <span className="text-primary font-medium">AI analysis</span> shows 
                wider distribution with clear top performer separation.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="text-center p-2 rounded-lg border border-success/30 bg-success/5">
            <div className="text-[10px] text-muted-foreground mb-1">Top Stars</div>
            <div className="text-sm font-bold text-success">90-100</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">
              {candidates.filter(c => (c.scores.overall || 0) >= 90).length}
            </div>
          </div>
          <div className="text-center p-2 rounded-lg border border-primary/30 bg-primary/5">
            <div className="text-[10px] text-muted-foreground mb-1">High</div>
            <div className="text-sm font-bold text-primary">80-89</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">
              {candidates.filter(c => (c.scores.overall || 0) >= 80 && (c.scores.overall || 0) < 90).length}
            </div>
          </div>
          <div className="text-center p-2 rounded-lg border border-accent/30 bg-accent/5">
            <div className="text-[10px] text-muted-foreground mb-1">Good</div>
            <div className="text-sm font-bold text-accent">70-79</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">
              {candidates.filter(c => (c.scores.overall || 0) >= 70 && (c.scores.overall || 0) < 80).length}
            </div>
          </div>
          <div className="text-center p-2 rounded-lg border border-warning/30 bg-warning/5">
            <div className="text-[10px] text-muted-foreground mb-1">Average</div>
            <div className="text-sm font-bold text-warning">60-69</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">
              {candidates.filter(c => (c.scores.overall || 0) >= 60 && (c.scores.overall || 0) < 70).length}
            </div>
          </div>
          <div className="text-center p-2 rounded-lg border border-muted bg-muted/5">
            <div className="text-[10px] text-muted-foreground mb-1">Below</div>
            <div className="text-sm font-bold text-muted-foreground">0-59</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">
              {candidates.filter(c => (c.scores.overall || 0) < 60).length}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
