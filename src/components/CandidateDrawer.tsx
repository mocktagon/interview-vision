import { Candidate } from "@/types/candidate";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock, 
  Star,
  Download,
  Share2
} from "lucide-react";
import { SkillsRadar } from "./SkillsRadar";

interface CandidateDrawerProps {
  candidate: Candidate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const stageLabels: Record<string, string> = {
  screening: 'Screening',
  prelims: 'Preliminary',
  fitment: 'Fitment',
  final: 'Final Review',
  selected: 'Selected',
  rejected: 'Rejected'
};

export function CandidateDrawer({ candidate, open, onOpenChange }: CandidateDrawerProps) {
  if (!candidate) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <div className="flex items-start justify-between">
            <div>
              <SheetTitle className="text-2xl flex items-center gap-2">
                {candidate.name}
                {candidate.topPerformer && (
                  <Star className="h-5 w-5 text-accent fill-accent" />
                )}
              </SheetTitle>
              <SheetDescription className="text-base mt-1">
                {candidate.role}
              </SheetDescription>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">
                {candidate.scores.overall || '-'}
              </div>
              <div className="text-sm text-muted-foreground">Overall Score</div>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Contact Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Contact Information</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${candidate.email}`} className="text-primary hover:underline">
                  {candidate.email}
                </a>
              </div>
              {candidate.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{candidate.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{candidate.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Available in: {candidate.availability}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Scores Breakdown */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Assessment Scores</h3>
            <div className="grid grid-cols-2 gap-3">
              {candidate.scores.screening && (
                <div className="p-4 rounded-lg bg-chart-1/10 border border-chart-1/20">
                  <div className="text-sm text-muted-foreground mb-1">Screening</div>
                  <div className="text-2xl font-bold text-chart-1">
                    {candidate.scores.screening}
                  </div>
                </div>
              )}
              {candidate.scores.prelims && (
                <div className="p-4 rounded-lg bg-chart-2/10 border border-chart-2/20">
                  <div className="text-sm text-muted-foreground mb-1">Preliminary</div>
                  <div className="text-2xl font-bold text-chart-2">
                    {candidate.scores.prelims}
                  </div>
                </div>
              )}
              {candidate.scores.fitment && (
                <div className="p-4 rounded-lg bg-chart-3/10 border border-chart-3/20">
                  <div className="text-sm text-muted-foreground mb-1">Fitment</div>
                  <div className="text-2xl font-bold text-chart-3">
                    {candidate.scores.fitment}
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Skills Radar */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Skills Profile</h3>
            <SkillsRadar skills={candidate.skills} />
          </div>

          <Separator />

          {/* Experience & Status */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Additional Details</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Experience</span>
                <span className="font-medium">{candidate.experience} years</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Current Stage</span>
                <Badge>{stageLabels[candidate.stage]}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Applied</span>
                <span className="font-medium">
                  {new Date(candidate.appliedDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last Updated</span>
                <span className="font-medium">
                  {new Date(candidate.lastUpdated).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {candidate.eligibleForRoles && candidate.eligibleForRoles.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Eligible For</h3>
                <div className="flex flex-wrap gap-2">
                  {candidate.eligibleForRoles.map((role) => (
                    <Badge key={role} variant="secondary">
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {candidate.notes && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">AI-Sourced Insights</h3>
                <p className="text-sm text-muted-foreground">{candidate.notes}</p>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Download Profile
            </Button>
            <Button variant="outline" className="flex-1">
              <Share2 className="h-4 w-4 mr-2" />
              Share with Client
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
