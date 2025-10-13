import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Candidate } from "@/types/candidate";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts";
import { Star } from "lucide-react";

interface ScoreDistributionChartProps {
  candidates: Candidate[];
}

export const ScoreDistributionChart = ({ candidates }: ScoreDistributionChartProps) => {
  // Define score ranges
  const scoreRanges = [
    { range: "90-100", min: 90, max: 100, color: "hsl(var(--success))", label: "Top Stars" },
    { range: "80-89", min: 80, max: 89, color: "hsl(var(--primary))", label: "High Performers" },
    { range: "70-79", min: 70, max: 79, color: "hsl(var(--accent))", label: "Good" },
    { range: "60-69", min: 60, max: 69, color: "hsl(var(--warning))", label: "Average" },
    { range: "0-59", min: 0, max: 59, color: "hsl(var(--muted))", label: "Below Average" },
  ];

  // Calculate distribution
  const distribution = scoreRanges.map(({ range, min, max, color, label }) => {
    const count = candidates.filter(c => {
      const score = c.scores.overall || 0;
      return score >= min && score <= max;
    }).length;
    
    const starred = candidates.filter(c => {
      const score = c.scores.overall || 0;
      return score >= min && score <= max && c.starred;
    }).length;

    return {
      range,
      count,
      starred,
      color,
      label,
      percentage: candidates.length > 0 ? Math.round((count / candidates.length) * 100) : 0
    };
  });

  const topStarsCount = distribution[0].count;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Score Distribution</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Candidate distribution across performance levels
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-success/10 border border-success/20">
            <Star className="h-4 w-4 text-success fill-success" />
            <div className="text-right">
              <div className="text-2xl font-bold text-success">{topStarsCount}</div>
              <div className="text-xs text-success/80">Top Stars (90+)</div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={distribution}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="range" 
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                color: "hsl(var(--foreground))"
              }}
              formatter={(value: any, name: string) => {
                if (name === "count") return [value, "Candidates"];
                if (name === "starred") return [value, "Starred"];
                return [value, name];
              }}
              labelFormatter={(label) => {
                const item = distribution.find(d => d.range === label);
                return item ? `${item.label} (${label})` : label;
              }}
            />
            <Legend 
              wrapperStyle={{ color: "hsl(var(--foreground))" }}
              formatter={(value) => value === "count" ? "Total Candidates" : "Starred"}
            />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {distribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
            <Bar dataKey="starred" fill="hsl(var(--warning))" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        
        <div className="mt-4 grid grid-cols-5 gap-2">
          {distribution.map((item) => (
            <div key={item.range} className="text-center p-2 rounded-lg border" style={{ borderColor: item.color }}>
              <div className="text-xs text-muted-foreground mb-1">{item.range}</div>
              <div className="text-lg font-bold" style={{ color: item.color }}>{item.count}</div>
              <div className="text-xs text-muted-foreground">{item.percentage}%</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
