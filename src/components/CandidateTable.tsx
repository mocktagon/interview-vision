import { useState } from "react";
import { Candidate } from "@/types/candidate";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Star } from "lucide-react";

interface CandidateTableProps {
  candidates: Candidate[];
  onViewCandidate: (candidate: Candidate) => void;
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

export function CandidateTable({ candidates, onViewCandidate }: CandidateTableProps) {
  const [sortField, setSortField] = useState<keyof Candidate | 'overall'>('lastUpdated');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const sortedCandidates = [...candidates].sort((a, b) => {
    let aVal: any, bVal: any;

    if (sortField === 'overall') {
      aVal = a.scores.overall || 0;
      bVal = b.scores.overall || 0;
    } else {
      aVal = a[sortField];
      bVal = b[sortField];
    }

    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (field: keyof Candidate | 'overall') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead 
              className="cursor-pointer hover:bg-muted/80 transition-colors"
              onClick={() => handleSort('name')}
            >
              Candidate
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/80 transition-colors"
              onClick={() => handleSort('role')}
            >
              Target Role
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/80 transition-colors"
              onClick={() => handleSort('overall')}
            >
              Overall Score
            </TableHead>
            <TableHead>Skills Highlight</TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/80 transition-colors"
              onClick={() => handleSort('stage')}
            >
              Stage
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/80 transition-colors"
              onClick={() => handleSort('experience')}
            >
              Experience
            </TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedCandidates.map((candidate) => {
            const topSkills = Object.entries(candidate.skills)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 2);

            return (
              <TableRow 
                key={candidate.id}
                className="hover:bg-muted/30 transition-colors cursor-pointer"
                onClick={() => onViewCandidate(candidate)}
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {candidate.name}
                        {candidate.topPerformer && (
                          <Star className="h-4 w-4 text-accent fill-accent" />
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {candidate.location}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-medium">{candidate.role}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-foreground">
                      {candidate.scores.overall || '-'}
                    </span>
                    <span className="text-sm text-muted-foreground">/100</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {topSkills.map(([skill, score]) => (
                      <Badge 
                        key={skill} 
                        variant="secondary"
                        className="text-xs"
                      >
                        {skill} {score}%
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={stageColors[candidate.stage]}>
                    {stageLabels[candidate.stage]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{candidate.experience} yrs</span>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewCandidate(candidate);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
