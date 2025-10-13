import { CandidateList } from "@/types/list";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, MoreVertical, Sparkles, Award, Zap } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ListCardProps {
  list: CandidateList;
  onClick: () => void;
}

export function ListCard({ list, onClick }: ListCardProps) {
  const avgScore = list.candidates.length > 0
    ? (list.candidates.reduce((sum, c) => sum + (c.scores.overall || 0), 0) / list.candidates.length).toFixed(0)
    : 0;

  const topPerformers = list.candidates.filter(c => c.starred).length;

  return (
    <Card className="p-6 transition-all duration-300 hover:shadow-xl cursor-pointer group relative overflow-hidden border-2" onClick={onClick}>
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div 
                className="w-4 h-4 rounded-full shadow-lg" 
                style={{ backgroundColor: list.color }}
              />
              <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                {list.name}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {list.description || "No description"}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>

        {/* AI Insights Badge */}
        {list.aiInsights && (
          <div className="mb-4 p-3 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
            <div className="flex items-start gap-2">
              <Sparkles className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-xs text-foreground/80 italic line-clamp-2">
                "{list.aiInsights.summary}"
              </p>
            </div>
          </div>
        )}

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-background/50 rounded-lg p-3 border border-border/50">
            <div className="flex items-center gap-1 text-muted-foreground mb-1">
              <Users className="h-3 w-3" />
              <span className="text-xs font-medium">Total</span>
            </div>
            <p className="text-xl font-bold text-foreground">{list.candidates.length}</p>
          </div>
          <div className="bg-background/50 rounded-lg p-3 border border-border/50">
            <div className="flex items-center gap-1 text-muted-foreground mb-1">
              <TrendingUp className="h-3 w-3" />
              <span className="text-xs font-medium">Score</span>
            </div>
            <p className="text-xl font-bold text-foreground">{avgScore}</p>
          </div>
          <div className="bg-background/50 rounded-lg p-3 border border-border/50">
            <div className="flex items-center gap-1 text-muted-foreground mb-1">
              <Award className="h-3 w-3" />
              <span className="text-xs font-medium">Stars</span>
            </div>
            <p className="text-xl font-bold text-foreground">{topPerformers}</p>
          </div>
        </div>

        {/* Key Insights */}
        {list.aiInsights && (
          <div className="grid grid-cols-2 gap-2 mb-4">
            <Badge variant="secondary" className="justify-start gap-1 py-1.5">
              <Zap className="h-3 w-3" />
              <span className="text-xs truncate">{list.aiInsights.topSkill}</span>
            </Badge>
            <Badge variant="outline" className="justify-start gap-1 py-1.5">
              <span className="text-xs">Diversity: {list.aiInsights.diversityScore}%</span>
            </Badge>
          </div>
        )}

        {/* Candidate Avatars */}
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {list.candidates.slice(0, 5).map((candidate, idx) => (
              <Avatar key={candidate.id} className="h-8 w-8 border-2 border-background ring-1 ring-border">
                <AvatarImage src={candidate.profilePicture} />
                <AvatarFallback className="text-xs bg-gradient-to-br from-primary/20 to-accent/20">
                  {candidate.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            ))}
            {list.candidates.length > 5 && (
              <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center ring-1 ring-border">
                <span className="text-xs font-medium text-muted-foreground">
                  +{list.candidates.length - 5}
                </span>
              </div>
            )}
          </div>
          <span className="text-xs text-muted-foreground ml-auto">
            {new Date(list.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>
    </Card>
  );
}
