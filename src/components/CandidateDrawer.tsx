import { Candidate } from "@/types/candidate";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock, 
  Star,
  Download,
  Share2,
  Linkedin,
  Globe,
  Github,
  Lightbulb,
  MessageSquare,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  ThumbsUp,
  Brain,
  Award,
  Quote,
  Users2,
  Zap
} from "lucide-react";
import { SkillsRadar } from "./SkillsRadar";
import { CandidateScoreComparison } from "./CandidateScoreComparison";

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

const recommendationStyles: Record<string, { label: string; color: string }> = {
  'strong-yes': { label: 'Strong Yes', color: 'bg-success/10 text-success border-success/20' },
  'yes': { label: 'Yes', color: 'bg-chart-2/10 text-chart-2 border-chart-2/20' },
  'maybe': { label: 'Maybe', color: 'bg-chart-3/10 text-chart-3 border-chart-3/20' },
  'no': { label: 'No', color: 'bg-destructive/10 text-destructive border-destructive/20' }
};

export function CandidateDrawer({ candidate, open, onOpenChange }: CandidateDrawerProps) {
  if (!candidate) return null;

  const initials = candidate.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-3xl overflow-y-auto">
        <SheetHeader>
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage 
                src={candidate.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(candidate.name)}`} 
                alt={candidate.name} 
              />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <SheetTitle className="text-2xl flex items-center gap-2">
                {candidate.name}
                {candidate.starred && (
                  <Star className="h-5 w-5 text-accent fill-accent" />
                )}
              </SheetTitle>
              <SheetDescription className="text-base mt-1">
                {candidate.role} • {candidate.experience} years experience
              </SheetDescription>
              {candidate.socials && (
                <div className="flex gap-2 mt-2">
                  {candidate.socials.linkedin && (
                    <a href={candidate.socials.linkedin} target="_blank" rel="noopener noreferrer" 
                       className="text-muted-foreground hover:text-primary transition-colors">
                      <Linkedin className="h-4 w-4" />
                    </a>
                  )}
                  {candidate.socials.github && (
                    <a href={candidate.socials.github} target="_blank" rel="noopener noreferrer"
                       className="text-muted-foreground hover:text-primary transition-colors">
                      <Github className="h-4 w-4" />
                    </a>
                  )}
                  {candidate.socials.portfolio && (
                    <a href={candidate.socials.portfolio} target="_blank" rel="noopener noreferrer"
                       className="text-muted-foreground hover:text-primary transition-colors">
                      <Globe className="h-4 w-4" />
                    </a>
                  )}
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">
                {candidate.scores.overall || '-'}
              </div>
              <div className="text-sm text-muted-foreground">Overall</div>
              <Badge className="mt-2">{stageLabels[candidate.stage]}</Badge>
            </div>
          </div>
        </SheetHeader>

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            <TabsTrigger value="psych">Psych</TabsTrigger>
            <TabsTrigger value="interview">Interviews</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* ATS vs AI Scoring Comparison */}
            {candidate.atsScore && candidate.aiInterviewScore && (
              <CandidateScoreComparison 
                candidateName={candidate.name}
                atsScore={candidate.atsScore}
                aiScore={candidate.aiInterviewScore}
              />
            )}

            {/* Contact Information */}
            <Card className="p-4">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Contact Information
              </h3>
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
                  <span>Available: {candidate.availability}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Applied: {new Date(candidate.appliedDate).toLocaleDateString()}</span>
                </div>
              </div>
            </Card>

            {/* Assessment Scores */}
            <Card className="p-4">
              <h3 className="font-semibold text-lg mb-3">Assessment Scores</h3>
              <div className="grid grid-cols-3 gap-3">
                {candidate.scores.screening && (
                  <div className="p-4 rounded-lg bg-chart-1/10 border border-chart-1/20 text-center">
                    <div className="text-sm text-muted-foreground mb-1">Screening</div>
                    <div className="text-2xl font-bold text-chart-1">
                      {candidate.scores.screening}
                    </div>
                  </div>
                )}
                {candidate.scores.prelims && (
                  <div className="p-4 rounded-lg bg-chart-2/10 border border-chart-2/20 text-center">
                    <div className="text-sm text-muted-foreground mb-1">Preliminary</div>
                    <div className="text-2xl font-bold text-chart-2">
                      {candidate.scores.prelims}
                    </div>
                  </div>
                )}
                {candidate.scores.fitment && (
                  <div className="p-4 rounded-lg bg-chart-3/10 border border-chart-3/20 text-center">
                    <div className="text-sm text-muted-foreground mb-1">Fitment</div>
                    <div className="text-2xl font-bold text-chart-3">
                      {candidate.scores.fitment}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Social & LinkedIn Insights */}
            {candidate.socials?.linkedinInsights && (
              <Card className="p-4 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Linkedin className="h-5 w-5 text-primary" />
                  LinkedIn Insights
                </h3>
                
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-2 bg-background/50 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">Activity Score</div>
                    <div className="text-xl font-bold text-primary">
                      {candidate.socials.linkedinInsights.activityScore}
                    </div>
                  </div>
                  <div className="text-center p-2 bg-background/50 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">Followers</div>
                    <div className="text-xl font-bold text-primary">
                      {candidate.socials.linkedinInsights.followerCount?.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-center p-2 bg-background/50 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">Influence</div>
                    <div className="text-sm font-bold text-accent">
                      {candidate.socials.linkedinInsights.influenceLevel}
                    </div>
                  </div>
                </div>

                {candidate.socials.linkedinInsights.endorsements.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="h-4 w-4 text-accent" />
                      <h4 className="font-medium text-sm">Top Endorsements</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {candidate.socials.linkedinInsights.endorsements.map((endorsement, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {endorsement}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {candidate.socials.linkedinInsights.recommendations.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Quote className="h-4 w-4 text-primary" />
                      <h4 className="font-medium text-sm">LinkedIn Recommendations</h4>
                    </div>
                    <div className="space-y-3">
                      {candidate.socials.linkedinInsights.recommendations.map((rec, idx) => (
                        <div key={idx} className="p-3 bg-background/70 rounded-lg border border-border/50">
                          <div className="flex items-start gap-2 mb-2">
                            <Users2 className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm">{rec.name}</p>
                              <p className="text-xs text-muted-foreground">{rec.title}</p>
                              <p className="text-xs text-muted-foreground italic">{rec.relationship}</p>
                            </div>
                          </div>
                          <p className="text-sm text-foreground/80 italic pl-6 border-l-2 border-primary/30">
                            "{rec.quote}"
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            )}

            {candidate.socials?.githubInsights && (
              <Card className="p-4 bg-gradient-to-r from-foreground/5 to-muted/10 border-border">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Github className="h-5 w-5" />
                  GitHub Activity
                </h3>
                
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div className="text-center p-2 bg-background/50 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">Contributions</div>
                    <div className="text-xl font-bold">{candidate.socials.githubInsights.contributions}</div>
                  </div>
                  <div className="text-center p-2 bg-background/50 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">Stars</div>
                    <div className="text-xl font-bold">{candidate.socials.githubInsights.starredRepos}</div>
                  </div>
                  <div className="text-center p-2 bg-background/50 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">Influence</div>
                    <div className="text-sm font-bold text-success">{candidate.socials.githubInsights.influence}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-accent" />
                  <h4 className="font-medium text-sm">Top Languages</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {candidate.socials.githubInsights.topLanguages.map((lang, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}

            {candidate.eligibleForRoles && candidate.eligibleForRoles.length > 0 && (
              <Card className="p-4">
                <h3 className="font-semibold text-lg mb-3">Eligible For</h3>
                <div className="flex flex-wrap gap-2">
                  {candidate.eligibleForRoles.map((role) => (
                    <Badge key={role} variant="secondary">
                      {role}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}

            {candidate.notes && (
              <Card className="p-4 bg-primary/5 border-primary/10">
                <h3 className="font-semibold text-lg mb-2">Quick Notes</h3>
                <p className="text-sm text-muted-foreground">{candidate.notes}</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="insights" className="space-y-6 mt-6">
            {candidate.smartInsights && (
              <>
                <Card className="p-4">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-accent" />
                    Personality Traits
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {candidate.smartInsights.personality.map((trait, idx) => (
                      <Badge key={idx} variant="secondary" className="text-sm">
                        {trait}
                      </Badge>
                    ))}
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-success" />
                    Key Strengths
                  </h3>
                  <ul className="space-y-2">
                    {candidate.smartInsights.strengths.map((strength, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card className="p-4">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-chart-3" />
                    Areas for Development
                  </h3>
                  <ul className="space-y-2">
                    {candidate.smartInsights.potentialChallenges.map((challenge, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <AlertCircle className="h-4 w-4 text-chart-3 mt-0.5 flex-shrink-0" />
                        <span>{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card className="p-4 bg-accent/5 border-accent/20">
                  <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                    <ThumbsUp className="h-5 w-5 text-accent" />
                    Cultural Fit Assessment
                  </h3>
                  <p className="text-sm">{candidate.smartInsights.culturalFit}</p>
                </Card>
              </>
            )}

            {candidate.interviewInsights && (
              <>
                <Separator />
                <Card className="p-4">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    Interview Analysis
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">Communication Style</h4>
                      <p className="text-sm">{candidate.interviewInsights.communicationStyle}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">Problem Solving</h4>
                      <p className="text-sm">{candidate.interviewInsights.problemSolvingApproach}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">Leadership Potential</h4>
                      <p className="text-sm">{candidate.interviewInsights.leadershipPotential}</p>
                    </div>
                    {candidate.interviewInsights.keyQuotes.length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-2">Notable Quotes</h4>
                        <div className="space-y-2">
                          {candidate.interviewInsights.keyQuotes.map((quote, idx) => (
                            <div key={idx} className="pl-4 border-l-2 border-primary/30 italic text-sm text-muted-foreground">
                              "{quote}"
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="psych" className="space-y-6 mt-6">
            {candidate.psychAssessment ? (
              <>
                <Card className="p-4 bg-accent/5 border-accent/20">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Brain className="h-5 w-5 text-accent" />
                    Personality Assessment
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Based on a 4-question psychological assessment that reveals work style and personality traits.
                  </p>
                </Card>

                <Card className="p-4">
                  <h4 className="font-semibold mb-3">Animal Choice</h4>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">
                      {candidate.psychAssessment.animal === 'lion' && '🦁'}
                      {candidate.psychAssessment.animal === 'owl' && '🦉'}
                      {candidate.psychAssessment.animal === 'dolphin' && '🐬'}
                      {candidate.psychAssessment.animal === 'fox' && '🦊'}
                    </span>
                    <div>
                      <p className="font-medium text-sm capitalize">{candidate.psychAssessment.animal}</p>
                      <p className="text-xs text-muted-foreground">
                        {candidate.psychAssessment.animal === 'lion' && 'Natural Leader - Bold, confident, takes charge'}
                        {candidate.psychAssessment.animal === 'owl' && 'Analytical Thinker - Wise, detail-oriented, observant'}
                        {candidate.psychAssessment.animal === 'dolphin' && 'Team Player - Social, collaborative, empathetic'}
                        {candidate.psychAssessment.animal === 'fox' && 'Strategic Adapter - Clever, resourceful, agile'}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="font-semibold mb-3">Color Preference</h4>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-8 h-8 rounded-full ${
                      candidate.psychAssessment.color === 'red' ? 'bg-red-500' :
                      candidate.psychAssessment.color === 'blue' ? 'bg-blue-500' :
                      candidate.psychAssessment.color === 'green' ? 'bg-green-500' :
                      'bg-yellow-500'
                    }`} />
                    <div>
                      <p className="font-medium text-sm capitalize">{candidate.psychAssessment.color}</p>
                      <p className="text-xs text-muted-foreground">
                        {candidate.psychAssessment.color === 'red' && 'Action-Oriented - Energetic, passionate, results-driven'}
                        {candidate.psychAssessment.color === 'blue' && 'Detail-Focused - Calm, analytical, systematic'}
                        {candidate.psychAssessment.color === 'green' && 'Balanced Approach - Harmonious, stable, growth-minded'}
                        {candidate.psychAssessment.color === 'yellow' && 'Innovative Spirit - Optimistic, creative, enthusiastic'}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="font-semibold mb-3">Environment Choice</h4>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">
                      {candidate.psychAssessment.environment === 'mountain' && '⛰️'}
                      {candidate.psychAssessment.environment === 'beach' && '🏖️'}
                      {candidate.psychAssessment.environment === 'forest' && '🌲'}
                      {candidate.psychAssessment.environment === 'city' && '🏙️'}
                    </span>
                    <div>
                      <p className="font-medium text-sm capitalize">{candidate.psychAssessment.environment}</p>
                      <p className="text-xs text-muted-foreground">
                        {candidate.psychAssessment.environment === 'mountain' && 'Goal-Driven - Ambitious, resilient, loves challenges'}
                        {candidate.psychAssessment.environment === 'beach' && 'Flexible & Calm - Adaptable, relaxed, goes with flow'}
                        {candidate.psychAssessment.environment === 'forest' && 'Growth-Minded - Patient, nurturing, values development'}
                        {candidate.psychAssessment.environment === 'city' && 'Fast-Paced - Dynamic, energetic, thrives in action'}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="font-semibold mb-3">Symbol Choice</h4>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">
                      {candidate.psychAssessment.symbol === 'compass' && '🧭'}
                      {candidate.psychAssessment.symbol === 'bridge' && '🌉'}
                      {candidate.psychAssessment.symbol === 'tree' && '🌳'}
                      {candidate.psychAssessment.symbol === 'puzzle' && '🧩'}
                    </span>
                    <div>
                      <p className="font-medium text-sm capitalize">{candidate.psychAssessment.symbol}</p>
                      <p className="text-xs text-muted-foreground">
                        {candidate.psychAssessment.symbol === 'compass' && 'Direction Seeker - Strategic, focused, values clarity'}
                        {candidate.psychAssessment.symbol === 'bridge' && 'Connector - Builds relationships, facilitates collaboration'}
                        {candidate.psychAssessment.symbol === 'tree' && 'Deep Roots - Values tradition, stable, long-term thinker'}
                        {candidate.psychAssessment.symbol === 'puzzle' && 'Problem Solver - Analytical, loves challenges, detail-oriented'}
                      </p>
                    </div>
                  </div>
                </Card>
              </>
            ) : (
              <Card className="p-8 text-center">
                <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">No psychological assessment completed</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="interview" className="space-y-4 mt-6">
            {candidate.interviewReports && candidate.interviewReports.length > 0 ? (
              candidate.interviewReports.map((report, idx) => (
                <Card key={idx} className="p-4 animate-fade-in">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-base">{report.round} Round</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(report.date).toLocaleDateString()} • {report.interviewer}
                      </p>
                    </div>
                    <Badge className={recommendationStyles[report.recommendation].color}>
                      {recommendationStyles[report.recommendation].label}
                    </Badge>
                  </div>
                  <p className="text-sm">{report.summary}</p>
                </Card>
              ))
            ) : (
              <Card className="p-8 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">No interview reports available yet</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="skills" className="space-y-6 mt-6">
            <Card className="p-4">
              <h3 className="font-semibold text-lg mb-4">Skills Profile</h3>
              <SkillsRadar skills={candidate.skills} />
            </Card>
            
            <Card className="p-4">
              <h3 className="font-semibold text-lg mb-3">Skill Breakdown</h3>
              <div className="space-y-3">
                {Object.entries(candidate.skills)
                  .sort(([, a], [, b]) => b - a)
                  .map(([skill, score]) => (
                    <div key={skill}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{skill}</span>
                        <span className="text-sm text-muted-foreground">{score}%</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-300" 
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="flex gap-2 pt-6 sticky bottom-0 bg-background pb-4 border-t">
          <Button className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Download Profile
          </Button>
          <Button variant="outline" className="flex-1">
            <Share2 className="h-4 w-4 mr-2" />
            Share with Client
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
