import { Candidate } from "@/types/candidate";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Mail, 
  MapPin, 
  Clock, 
  Star,
  Eye,
  Calendar,
  Briefcase,
  Circle
} from "lucide-react";

interface CandidateCardProps {
  candidate: Candidate;
  onViewDetails: (candidate: Candidate) => void;
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

const psychColors: Record<string, string> = {
  red: 'text-red-500',
  blue: 'text-blue-500',
  green: 'text-green-500',
  yellow: 'text-yellow-500'
};

const psychLabels = {
  animal: {
    lion: 'Lion - Natural Leader',
    owl: 'Owl - Analytical Thinker',
    dolphin: 'Dolphin - Team Player',
    fox: 'Fox - Strategic Adapter'
  },
  color: {
    red: 'Red - Action-Oriented',
    blue: 'Blue - Detail-Focused',
    green: 'Green - Balanced Approach',
    yellow: 'Yellow - Innovative Spirit'
  },
  environment: {
    mountain: 'Mountain - Goal-Driven',
    beach: 'Beach - Flexible & Calm',
    forest: 'Forest - Growth-Minded',
    city: 'City - Fast-Paced'
  },
  symbol: {
    compass: 'Compass - Direction Seeker',
    bridge: 'Bridge - Connector',
    tree: 'Tree - Deep Roots',
    puzzle: 'Puzzle - Problem Solver'
  }
};

export function CandidateCard({ candidate, onViewDetails }: CandidateCardProps) {
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
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                {candidate.name}
              </h3>
              {candidate.topPerformer && (
                <Star className="h-4 w-4 text-accent fill-accent" />
              )}
            </div>
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
        <Badge className={stageColors[candidate.stage]}>
          {stageLabels[candidate.stage]}
        </Badge>
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

      {/* Eligible Roles */}
      {candidate.eligibleForRoles && candidate.eligibleForRoles.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-medium text-muted-foreground mb-2">Eligible For</p>
          <div className="flex flex-wrap gap-1">
            {candidate.eligibleForRoles.slice(0, 2).map((role) => (
              <Badge key={role} variant="secondary" className="text-xs">
                {role}
              </Badge>
            ))}
            {candidate.eligibleForRoles.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{candidate.eligibleForRoles.length - 2} more
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Psych Assessment */}
      {candidate.psychAssessment && (
        <div className="pt-3 border-t border-border">
          <p className="text-xs font-medium text-muted-foreground mb-2">Personality Profile</p>
          <TooltipProvider>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 text-xs bg-secondary/50 px-2 py-1 rounded">
                    <span className="text-base">🦁🦉🐬🦊</span>
                    <span className="font-medium">
                      {candidate.psychAssessment.animal === 'lion' && '🦁'}
                      {candidate.psychAssessment.animal === 'owl' && '🦉'}
                      {candidate.psychAssessment.animal === 'dolphin' && '🐬'}
                      {candidate.psychAssessment.animal === 'fox' && '🦊'}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">{psychLabels.animal[candidate.psychAssessment.animal]}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center justify-center w-7 h-7 rounded bg-secondary/50">
                    <Circle className={`h-4 w-4 fill-current ${psychColors[candidate.psychAssessment.color]}`} />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">{psychLabels.color[candidate.psychAssessment.color]}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 text-xs bg-secondary/50 px-2 py-1 rounded">
                    <span className="text-base">
                      {candidate.psychAssessment.environment === 'mountain' && '⛰️'}
                      {candidate.psychAssessment.environment === 'beach' && '🏖️'}
                      {candidate.psychAssessment.environment === 'forest' && '🌲'}
                      {candidate.psychAssessment.environment === 'city' && '🏙️'}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">{psychLabels.environment[candidate.psychAssessment.environment]}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 text-xs bg-secondary/50 px-2 py-1 rounded">
                    <span className="text-base">
                      {candidate.psychAssessment.symbol === 'compass' && '🧭'}
                      {candidate.psychAssessment.symbol === 'bridge' && '🌉'}
                      {candidate.psychAssessment.symbol === 'tree' && '🌳'}
                      {candidate.psychAssessment.symbol === 'puzzle' && '🧩'}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">{psychLabels.symbol[candidate.psychAssessment.symbol]}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>
      )}

      {/* Contact & Availability */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            Available: {candidate.availability}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            Applied: {new Date(candidate.appliedDate).toLocaleDateString()}
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(candidate);
          }}
        >
          <Eye className="h-3 w-3 mr-1" />
          Full Profile
        </Button>
      </div>
    </Card>
  );
}
