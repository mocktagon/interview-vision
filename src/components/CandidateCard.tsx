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
  Award
} from "lucide-react";

interface CandidateCardProps {
  candidate: Candidate;
  onViewDetails: (candidate: Candidate) => void;
  onToggleStar?: (candidateId: string) => void;
  onAddToList?: (candidateId: string, listType: 'existing' | 'new') => void;
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

export function CandidateCard({ candidate, onViewDetails, onToggleStar, onAddToList }: CandidateCardProps) {
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
    <Card className="p-3 hover:shadow-lg transition-all duration-200 cursor-pointer group" onClick={() => onViewDetails(candidate)}>
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-start gap-2 flex-1">
          <Avatar className="h-10 w-10">
            <AvatarImage 
              src={candidate.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(candidate.name)}`} 
              alt={candidate.name} 
            />
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
              {candidate.name}
            </h3>
            <p className="text-xs font-medium text-primary truncate">{candidate.role}</p>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
              <span className="flex items-center gap-0.5">
                <Briefcase className="h-2.5 w-2.5" />
                {candidate.experience}y
              </span>
              <span className="flex items-center gap-0.5 truncate">
                <MapPin className="h-2.5 w-2.5" />
                {candidate.location}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation();
              onToggleStar?.(candidate.id);
            }}
          >
            <Star className={`h-3 w-3 ${candidate.starred ? 'fill-accent text-accent' : 'text-muted-foreground'}`} />
          </Button>
          <Badge className={`${stageColors[candidate.stage]} text-[9px] px-1.5 py-0`}>
            {stageLabels[candidate.stage]}
          </Badge>
        </div>
      </div>

      {/* Performance Badge */}
      <div className="mb-2">
        <Badge className={`${performanceLevel.colorClass} font-medium border text-[10px] px-2 py-0.5`}>
          <Award className="h-2.5 w-2.5 mr-1" />
          {performanceLevel.label} ({overallScore})
        </Badge>
      </div>

      {/* Assessment Scores */}
      <div className="mb-2 space-y-1.5">
        <div className="flex items-center justify-between text-[10px]">
          <span className="font-medium text-foreground">Assessment</span>
        </div>
        
        <div className="space-y-1">
          {candidate.scores.screening && (
            <div className="space-y-0.5">
              <div className="flex items-center justify-between text-[9px]">
                <span className="text-muted-foreground">Screening</span>
                <span className="font-semibold text-chart-1">{candidate.scores.screening}</span>
              </div>
              <Progress value={candidate.scores.screening} className="h-1" />
            </div>
          )}
          
          {candidate.scores.prelims && (
            <div className="space-y-0.5">
              <div className="flex items-center justify-between text-[9px]">
                <span className="text-muted-foreground">Prelims</span>
                <span className="font-semibold text-chart-2">{candidate.scores.prelims}</span>
              </div>
              <Progress value={candidate.scores.prelims} className="h-1" />
            </div>
          )}
          
          {candidate.scores.fitment && (
            <div className="space-y-0.5">
              <div className="flex items-center justify-between text-[9px]">
                <span className="text-muted-foreground">Fitment</span>
                <span className="font-semibold text-chart-3">{candidate.scores.fitment}</span>
              </div>
              <Progress value={candidate.scores.fitment} className="h-1" />
            </div>
          )}
        </div>
      </div>

      {/* Top Skills */}
      <div className="mb-2">
        <p className="text-[9px] font-medium text-muted-foreground mb-1">Top Skills</p>
        <div className="space-y-1">
          {topSkills.slice(0, 2).map(([skill, score]) => (
            <div key={skill} className="flex items-center justify-between">
              <span className="text-[9px] text-foreground truncate">{skill}</span>
              <div className="flex items-center gap-1">
                <Progress value={score} className="h-0.5 w-12" />
                <span className="text-[9px] font-semibold text-foreground w-6 text-right">{score}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Eligible Roles */}
      {candidate.eligibleForRoles && candidate.eligibleForRoles.length > 0 && (
        <div className="mb-2">
          <p className="text-[9px] font-medium text-muted-foreground mb-1">Eligible For</p>
          <div className="flex flex-wrap gap-0.5">
            {candidate.eligibleForRoles.slice(0, 2).map((role) => (
              <Badge key={role} variant="secondary" className="text-[8px] px-1.5 py-0">
                {role}
              </Badge>
            ))}
            {candidate.eligibleForRoles.length > 2 && (
              <Badge variant="secondary" className="text-[8px] px-1.5 py-0">
                +{candidate.eligibleForRoles.length - 2}
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Psych Assessment */}
      {candidate.psychAssessment && (
        <div className="pt-2 border-t border-border">
          <p className="text-[9px] font-medium text-muted-foreground mb-1">Profile</p>
          <div className="flex items-center gap-1">
            <span className="text-sm">{psychIcons[candidate.psychAssessment.animal]}</span>
            <span className="text-sm">{psychIcons[candidate.psychAssessment.environment]}</span>
          </div>
        </div>
      )}

      {/* Contact & Availability - Removed to save space */}
      <div className="pt-2 border-t border-border mt-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full text-[10px] h-7 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(candidate);
          }}
        >
          View Details
        </Button>
      </div>
    </Card>
  );
}
