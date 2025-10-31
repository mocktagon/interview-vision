import { Interview } from "@/data/mockInterviews";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, User, CheckCircle2, Clock, XCircle, AlertCircle, List, Plus, CheckCircle } from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";

interface InterviewCardProps {
  interview: Interview;
  onClick?: () => void;
  onAddToList?: (interviewId: string, listType: 'existing' | 'new') => void;
  swipeStatus?: 'good-fit' | 'nope' | 'maybe' | null;
  onSwipeStatusChange?: (interviewId: string, status: 'good-fit' | 'nope' | 'maybe') => void;
}

export function InterviewCard({ interview, onClick, onAddToList, swipeStatus, onSwipeStatusChange }: InterviewCardProps) {
  const isCompleted = interview.status === "completed";
  
  const radarData = Object.entries(interview.insights).map(([skill, value]) => ({
    skill,
    value
  }));

  const overallScore = isCompleted 
    ? Math.round(
        Object.values(interview.insights).reduce((sum, val) => sum + val, 0) / 
        Object.values(interview.insights).length
      )
    : 0;

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-success";
    if (score >= 80) return "text-primary";
    if (score >= 70) return "text-accent";
    return "text-muted-foreground";
  };

  const getRecommendationConfig = () => {
    switch (interview.recommendation) {
      case "strong_hire":
        return { 
          icon: CheckCircle2, 
          label: "Strong Hire", 
          className: "bg-success/10 text-success border-success/20" 
        };
      case "hire":
        return { 
          icon: CheckCircle2, 
          label: "Hire", 
          className: "bg-primary/10 text-primary border-primary/20" 
        };
      case "maybe":
        return { 
          icon: AlertCircle, 
          label: "Maybe", 
          className: "bg-accent/10 text-accent border-accent/20" 
        };
      case "no_hire":
        return { 
          icon: XCircle, 
          label: "No Hire", 
          className: "bg-destructive/10 text-destructive border-destructive/20" 
        };
    }
  };

  const recommendationConfig = getRecommendationConfig();
  const RecommendationIcon = recommendationConfig.icon;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Card 
      className="group hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-primary/30 relative overflow-hidden !bg-card"
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardContent className="p-5 relative">
        {/* Header with Score Badge */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <Avatar className="h-12 w-12 border-2 border-primary/10 flex-shrink-0">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {getInitials(interview.candidateName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                {interview.candidateName}
              </h3>
              <p className="text-sm text-muted-foreground truncate">{interview.role}</p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <Badge variant="outline" className="text-xs">
                  {interview.round}
                </Badge>
                {isCompleted && (
                  <Badge className={recommendationConfig.className}>
                    <RecommendationIcon className="h-3 w-3 mr-1" />
                    {recommendationConfig.label}
                  </Badge>
                )}
                {!isCompleted && (
                  <Badge variant="outline" className="bg-muted/50">
                    <Clock className="h-3 w-3 mr-1" />
                    Scheduled
                  </Badge>
                )}
              </div>
            </div>
          </div>
          {isCompleted && (
            <div className="flex-shrink-0 text-center ml-2">
              <div className={`text-3xl font-bold ${getScoreColor(overallScore)}`}>
                {overallScore}
              </div>
              <div className="text-xs text-muted-foreground">Score</div>
            </div>
          )}
        </div>

        {/* Mini Radar Chart */}
        {isCompleted && (
          <div className="mb-4 -mx-2">
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis 
                  dataKey="skill" 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 9 }}
                />
                <Radar
                  name="Score"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}

        {!isCompleted && (
          <div className="mb-4 h-[180px] flex items-center justify-center bg-muted/30 rounded-lg">
            <div className="text-center">
              <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Interview Scheduled</p>
            </div>
          </div>
        )}

        {/* Tags */}
        {interview.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {interview.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {interview.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{interview.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Summary */}
        {interview.summary && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
            {interview.summary}
          </p>
        )}

        {/* Footer Info */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50 mb-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <User className="h-3.5 w-3.5" />
            <span>{interview.interviewer}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>{new Date(interview.date).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-sm"
            onClick={(e) => {
              e.stopPropagation();
              onAddToList?.(interview.id, 'existing');
            }}
          >
            <List className="h-4 w-4 mr-2" />
            Add to List
          </Button>
          
          {swipeStatus ? (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className={`h-9 w-9 ${swipeStatus === 'good-fit' ? 'bg-success/10 hover:bg-success/20' : 'hover:bg-muted'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSwipeStatusChange?.(interview.id, 'good-fit');
                }}
              >
                <CheckCircle className={`h-4 w-4 ${swipeStatus === 'good-fit' ? 'text-success' : 'text-muted-foreground'}`} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`h-9 w-9 ${swipeStatus === 'nope' ? 'bg-destructive/10 hover:bg-destructive/20' : 'hover:bg-muted'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSwipeStatusChange?.(interview.id, 'nope');
                }}
              >
                <XCircle className={`h-4 w-4 ${swipeStatus === 'nope' ? 'text-destructive' : 'text-muted-foreground'}`} />
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-sm"
              onClick={(e) => {
                e.stopPropagation();
                onAddToList?.(interview.id, 'new');
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              New List
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
