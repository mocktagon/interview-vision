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
  List
} from "lucide-react";

interface CandidateCardProps {
  candidate: Candidate;
  onViewDetails: (candidate: Candidate) => void;
  onToggleStar?: (candidateId: string) => void;
  onAddToList?: (candidateId: string, listType: 'existing' | 'new') => void;
}

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

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group" onClick={() => onViewDetails(candidate)}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          <Avatar className="h-12 w-12">
            <AvatarImage 
              src={candidate.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(candidate.name)}`} 
              alt={candidate.name} 
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {candidate.name}
            </h3>
            <p className="text-sm font-medium text-primary mb-1">{candidate.role}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Briefcase className="h-3 w-3" />
                {candidate.experience} yrs
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {candidate.location}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              onToggleStar?.(candidate.id);
            }}
          >
            <Star className={`h-4 w-4 ${candidate.starred ? 'fill-accent text-accent' : 'text-muted-foreground'}`} />
          </Button>
          <Badge className={stageColors[candidate.stage]}>
            {stageLabels[candidate.stage]}
          </Badge>
        </div>
      </div>

      {/* Assessment Scores */}
      <div className="mb-4 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">Assessment Progress</span>
        </div>
        
        <div className="space-y-2">
          {candidate.scores.screening && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Screening Round</span>
                <span className="font-semibold text-chart-1">{candidate.scores.screening}/100</span>
              </div>
              <Progress value={candidate.scores.screening} className="h-1.5" />
            </div>
          )}
          
          {candidate.scores.prelims && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Preliminary Assessment</span>
                <span className="font-semibold text-chart-2">{candidate.scores.prelims}/100</span>
              </div>
              <Progress value={candidate.scores.prelims} className="h-1.5" />
            </div>
          )}
          
          {candidate.scores.fitment && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Role Fitment</span>
                <span className="font-semibold text-chart-3">{candidate.scores.fitment}/100</span>
              </div>
              <Progress value={candidate.scores.fitment} className="h-1.5" />
            </div>
          )}
        </div>
      </div>

      {/* Top Skills */}
      <div className="mb-4">
        <p className="text-xs font-medium text-muted-foreground mb-2">Top Skills</p>
        <div className="space-y-2">
          {topSkills.map(([skill, score]) => (
            <div key={skill} className="flex items-center justify-between">
              <span className="text-xs text-foreground">{skill}</span>
              <div className="flex items-center gap-2">
                <Progress value={score} className="h-1.5 w-20" />
                <span className="text-xs font-semibold text-foreground w-8 text-right">{score}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Smart Insight */}
      {candidate.smartInsights && candidate.smartInsights.strengths.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-muted-foreground italic">
            "{candidate.smartInsights.strengths[0]}"
          </p>
        </div>
      )}

      {/* Psych Assessment */}
      {candidate.psychAssessment && (
        <div className="pt-3 border-t border-border">
          <p className="text-xs font-medium text-muted-foreground mb-2">Profile</p>
          <div className="flex items-center gap-1.5">
            <span className="text-lg">{psychIcons[candidate.psychAssessment.animal]}</span>
            <span className="text-lg">{psychIcons[candidate.psychAssessment.environment]}</span>
          </div>
        </div>
      )}

      {/* Contact & Availability */}
      <div className="pt-3 border-t border-border space-y-3">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {candidate.availability}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(candidate.appliedDate).toLocaleDateString()}
          </div>
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              onAddToList?.(candidate.id, 'existing');
            }}
          >
            <List className="h-3 w-3" />
            Add to List
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              onAddToList?.(candidate.id, 'new');
            }}
          >
            <Plus className="h-3 w-3" />
            New List
          </Button>
        </div>
      </div>
    </Card>
  );
}
