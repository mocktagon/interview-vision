import { CandidateList } from "@/types/list";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, TrendingUp, Calendar, MoreVertical } from "lucide-react";
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
    <Card className="p-6 transition-all duration-200 hover:shadow-lg cursor-pointer group" onClick={onClick}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: list.color }}
            />
            <h3 className="text-lg font-semibold text-foreground">{list.name}</h3>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {list.description || "No description"}
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <div className="flex items-center gap-1 text-muted-foreground mb-1">
            <Users className="h-3 w-3" />
            <span className="text-xs">Candidates</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{list.candidates.length}</p>
        </div>
        <div>
          <div className="flex items-center gap-1 text-muted-foreground mb-1">
            <TrendingUp className="h-3 w-3" />
            <span className="text-xs">Avg Score</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{avgScore}</p>
        </div>
        <div>
          <div className="flex items-center gap-1 text-muted-foreground mb-1">
            <Calendar className="h-3 w-3" />
            <span className="text-xs">Top</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{topPerformers}</p>
        </div>
      </div>

      {/* Candidate Avatars */}
      <div className="flex items-center gap-2">
        <div className="flex -space-x-2">
          {list.candidates.slice(0, 5).map((candidate, idx) => (
            <Avatar key={candidate.id} className="h-8 w-8 border-2 border-background">
              <AvatarImage src={candidate.profilePicture} />
              <AvatarFallback className="text-xs">
                {candidate.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          ))}
          {list.candidates.length > 5 && (
            <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
              <span className="text-xs font-medium text-muted-foreground">
                +{list.candidates.length - 5}
              </span>
            </div>
          )}
        </div>
        <span className="text-xs text-muted-foreground ml-auto">
          Updated {new Date(list.lastUpdated).toLocaleDateString()}
        </span>
      </div>
    </Card>
  );
}
