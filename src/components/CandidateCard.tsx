import { Candidate } from "@/types/candidate";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  MapPin, 
  Clock, 
  Star,
  Calendar,
  Briefcase,
  Plus,
  List,
  Award,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";

interface CandidateCardProps {
  candidate: Candidate;
  onViewDetails: (candidate: Candidate) => void;
  onToggleStar?: (candidateId: string) => void;
  onAddToList?: (candidateId: string, listType: 'existing' | 'new') => void;
  swipeStatus?: 'good-fit' | 'nope' | 'maybe' | null;
  onSwipeStatusChange?: (candidateId: string, status: 'good-fit' | 'nope' | 'maybe') => void;
}

const getPerformanceLevel = (score: number) => {
  if (score >= 90) return { 
    label: "Top Star", 
    colorClass: "bg-success/10 text-success border-success/30"
  };
  if (score >= 80) return { 
    label: "High Performer", 
    colorClass: "bg-primary/10 text-primary border-primary/30"
  };
  if (score >= 70) return { 
    label: "Good", 
    colorClass: "bg-accent/10 text-accent border-accent/30"
  };
  if (score >= 60) return { 
    label: "Average", 
    colorClass: "bg-warning/10 text-warning border-warning/30"
  };
  return { 
    label: "Below Average", 
    colorClass: "bg-muted/50 text-muted-foreground border-muted"
  };
};

const stageColors: Record<string, string> = {
  screening: 'bg-chart-1/10 text-chart-1 border-chart-1/20',
  prelims: 'bg-chart-2/10 text-chart-2 border-chart-2/20',
  fitment: 'bg-chart-3/10 text-chart-3 border-chart-3/20',
  final: 'bg-chart-4/10 text-chart-4 border-chart-4/20',
  selected: 'bg-success/10 text-success border-success/20',
  rejected: 'bg-destructive/10 text-destructive border-destructive/20'
};

const stageLabels: Record<string, string> = {
  screening: 'Screening',
  prelims: 'Preliminary',
  fitment: 'Fitment',
  final: 'Final Review',
  selected: 'Selected',
  rejected: 'Rejected'
};

const psychIcons = {
  lion: '🦁',
  owl: '🦉',
  dolphin: '🐬',
  fox: '🦊',
  mountain: '⛰️',
  beach: '🏖️',
  forest: '🌲',
  city: '🏙️'
};

export function CandidateCard({ candidate, onViewDetails, onToggleStar, onAddToList, swipeStatus, onSwipeStatusChange }: CandidateCardProps) {
  const topSkills = Object.entries(candidate.skills)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  const initials = candidate.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const overallScore = candidate.scores.overall || 0;
  const performanceLevel = getPerformanceLevel(overallScore);

  return (
    <Card className="p-5 hover:shadow-lg transition-all duration-200 cursor-pointer border border-border bg-card" onClick={() => onViewDetails(candidate)}>
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <Avatar className="h-12 w-12">
          <AvatarImage 
            src={candidate.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(candidate.name)}`} 
            alt={candidate.name} 
          />
          <AvatarFallback className="text-sm font-medium bg-muted">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-foreground truncate">
                {candidate.name}
              </h3>
              <p className="text-sm text-muted-foreground truncate">{candidate.role}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 -mr-2 -mt-1"
              onClick={(e) => {
                e.stopPropagation();
                onToggleStar?.(candidate.id);
              }}
            >
              <Star className={`h-4 w-4 ${candidate.starred ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
            </Button>
          </div>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Briefcase className="h-3 w-3" />
              {candidate.experience} years
            </span>
            <span className="flex items-center gap-1 truncate">
              <MapPin className="h-3 w-3" />
              {candidate.location}
            </span>
          </div>
        </div>
      </div>

      {/* Overall Score Section */}
      <div className="mb-4 p-4 rounded-lg bg-muted/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Overall Score</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-foreground">{overallScore}</span>
              <span className="text-sm text-muted-foreground">{performanceLevel.label}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Assessment Breakdown */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-muted-foreground mb-2">Assessment Breakdown</p>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Screen</p>
            <p className="text-2xl font-semibold text-foreground">{candidate.scores.screening || 0}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Prelims</p>
            <p className="text-2xl font-semibold text-foreground">{candidate.scores.prelims || 0}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Fitment</p>
            <p className="text-2xl font-semibold text-foreground">{candidate.scores.fitment || 0}</p>
          </div>
        </div>
      </div>

      {/* Key Strengths */}
      {topSkills.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-muted-foreground mb-2">Key Strengths</p>
          <div className="grid grid-cols-3 gap-3">
            {topSkills.map(([skill, score]) => (
              <div key={skill}>
                <p className="text-xs text-foreground font-medium truncate">{skill}</p>
                <p className="text-xs text-muted-foreground">{score}%</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Matched Roles */}
      {candidate.eligibleForRoles && candidate.eligibleForRoles.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-muted-foreground mb-2">Matched Roles</p>
          <p className="text-sm text-foreground">
            {candidate.eligibleForRoles.length > 0 ? candidate.eligibleForRoles.join(', ') : 'None'}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-3 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-sm"
          onClick={(e) => {
            e.stopPropagation();
            onAddToList?.(candidate.id, 'existing');
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
                onSwipeStatusChange?.(candidate.id, 'good-fit');
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
                onSwipeStatusChange?.(candidate.id, 'nope');
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
              onAddToList?.(candidate.id, 'new');
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            New List
          </Button>
        )}
      </div>
    </Card>
  );
}
