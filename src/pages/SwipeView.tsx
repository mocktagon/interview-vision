import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockLists } from "@/data/mockLists";
import { Candidate } from "@/types/candidate";
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Undo2, X, Heart, Sparkles, Briefcase, Star, TrendingUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const SwipeView = () => {
  const { listId } = useParams();
  const navigate = useNavigate();
  const list = mockLists.find(l => l.id === listId);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState<{ index: number; decision: 'yes' | 'no' }[]>([]);

  const currentCandidate = list?.candidates[currentIndex];

  const [{ x, rotate, opacity }, api] = useSpring(() => ({
    x: 0,
    rotate: 0,
    opacity: 1,
  }));

  const bind = useDrag(
    ({ down, movement: [mx], velocity: [vx], direction: [dx] }) => {
      const trigger = vx > 0.2 || Math.abs(mx) > 100;

      if (!down && trigger) {
        const decision = dx > 0 ? 'yes' : 'no';
        handleSwipe(decision);
      }

      api.start({
        x: down ? mx : 0,
        rotate: down ? mx / 20 : 0,
        opacity: down ? 1 - Math.abs(mx) / 200 : 1,
        immediate: down,
      });
    },
    { axis: 'x' }
  );

  const handleSwipe = (decision: 'yes' | 'no') => {
    setHistory(prev => [...prev, { index: currentIndex, decision }]);
    
    api.start({
      x: decision === 'yes' ? 500 : -500,
      rotate: decision === 'yes' ? 30 : -30,
      opacity: 0,
      config: { duration: 300 },
      onRest: () => {
        if (currentIndex < (list?.candidates.length || 0) - 1) {
          setCurrentIndex(prev => prev + 1);
          api.set({ x: 0, rotate: 0, opacity: 1 });
        } else {
          toast({
            title: "All candidates reviewed!",
            description: `You've reviewed all ${list?.candidates.length} candidates.`,
          });
          setTimeout(() => navigate(`/list/${listId}`), 1500);
        }
      },
    });
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    
    const lastAction = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    setCurrentIndex(lastAction.index);
    api.set({ x: 0, rotate: 0, opacity: 1 });
    
    toast({
      title: "Undone!",
      description: "Previous decision reversed.",
    });
  };

  const getPerformanceTier = (score: number) => {
    if (score >= 80) return { color: 'bg-success', label: 'Top 20%', textColor: 'text-success' };
    if (score >= 50) return { color: 'bg-yellow-500', label: 'Top 20-50%', textColor: 'text-yellow-600' };
    return { color: 'bg-orange-500', label: 'Below 50%', textColor: 'text-orange-600' };
  };

  const getInsightTags = (candidate: Candidate) => {
    const tags = [];
    
    if (candidate.scores.overall >= 85) tags.push({ label: 'Top Performer', variant: 'success' as const });
    if (candidate.starred) tags.push({ label: 'Starred', variant: 'default' as const });
    if (candidate.experience >= 5) tags.push({ label: 'Experienced', variant: 'secondary' as const });
    if (candidate.smartInsights?.culturalFit === 'Excellent') tags.push({ label: 'Cultural Fit', variant: 'success' as const });
    
    return tags;
  };

  if (!list || !currentCandidate) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">No candidates to review</h2>
          <Button onClick={() => navigate('/')}>Return Home</Button>
        </div>
      </div>
    );
  }

  const progressPercentage = ((currentIndex + 1) / list.candidates.length) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="p-4 pb-2 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(`/list/${listId}`)} className="hover:bg-secondary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Badge variant="outline" className="bg-secondary border-border font-medium">
            {currentIndex + 1} / {list.candidates.length}
          </Badge>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-0.5 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-foreground transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Role Info */}
      <div className="px-4 py-4 border-b border-border space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Briefcase className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Evaluating for:</span>
          <span className="font-semibold text-foreground">{currentCandidate.role}</span>
        </div>
        
        {/* Performance Indicator */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden flex">
              <div className="flex-1 bg-success"></div>
              <div className="flex-1 bg-yellow-500"></div>
              <div className="flex-1 bg-orange-500"></div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-success"></div>
              <span>Top 20%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
              <span>20-50%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
              <span>Below 50%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Stack Area */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        <animated.div
          {...bind()}
          style={{ x, rotate, opacity, touchAction: 'none' }}
          className="w-full max-w-md"
        >
          <Card className="p-8 shadow-xl border border-border cursor-grab active:cursor-grabbing relative overflow-hidden bg-card">
            {/* Performance Indicator Accent */}
            <div className={`absolute top-0 left-0 right-0 h-0.5 ${getPerformanceTier(currentCandidate.scores.overall).color}`}></div>
            {/* Swipe Indicators */}
            <animated.div 
              style={{ opacity: x.to(x => Math.max(0, x / 100)) }}
              className="absolute top-8 right-8 z-10"
            >
              <div className="bg-success/90 text-success-foreground px-5 py-2.5 rounded-xl font-bold text-base transform rotate-12 border-2 border-success backdrop-blur-sm">
                GOOD FIT
              </div>
            </animated.div>
            <animated.div 
              style={{ opacity: x.to(x => Math.max(0, -x / 100)) }}
              className="absolute top-8 left-8 z-10"
            >
              <div className="bg-destructive/90 text-destructive-foreground px-5 py-2.5 rounded-xl font-bold text-base transform -rotate-12 border-2 border-destructive backdrop-blur-sm">
                NOPE
              </div>
            </animated.div>

            {/* Candidate Info */}
            <div className="space-y-5 pt-2">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className="text-3xl font-bold text-foreground mb-1 tracking-tight">{currentCandidate.name}</h2>
                  <p className="text-base text-muted-foreground">{currentCandidate.role}</p>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 ${getPerformanceTier(currentCandidate.scores.overall).color}/10 border-${getPerformanceTier(currentCandidate.scores.overall).color.replace('bg-', '')}/30`}>
                  <div className={`w-2 h-2 rounded-full ${getPerformanceTier(currentCandidate.scores.overall).color}`}></div>
                  <span className={`text-xs font-bold ${getPerformanceTier(currentCandidate.scores.overall).textColor}`}>
                    {getPerformanceTier(currentCandidate.scores.overall).label}
                  </span>
                </div>
              </div>

              {/* Scores */}
              <div className="flex gap-2.5 flex-wrap">
                <Badge variant="outline" className="bg-secondary/50 border-border text-foreground font-medium">
                  <Star className="h-3.5 w-3.5 mr-1.5" />
                  Score: {currentCandidate.scores.overall}
                </Badge>
                <Badge variant="outline" className="bg-secondary/50 border-border text-foreground font-medium">
                  <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
                  {currentCandidate.experience}y exp
                </Badge>
              </div>

              {/* Insight Tags */}
              <div className="flex flex-wrap gap-2">
                {getInsightTags(currentCandidate).map((tag, idx) => (
                  <Badge key={idx} variant={tag.variant}>
                    {tag.label}
                  </Badge>
                ))}
              </div>

              {/* Key Insights */}
              {currentCandidate.smartInsights && (
                <div className="space-y-4 pt-2">
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-secondary/50 border border-border">
                    <Sparkles className="h-5 w-5 text-foreground mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Personality Analysis</p>
                      <p className="text-sm text-foreground leading-relaxed">{currentCandidate.smartInsights.personality}</p>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <p className="text-xs font-semibold text-foreground flex items-center gap-2 uppercase tracking-wide">
                      <div className="w-1.5 h-1.5 rounded-full bg-success"></div>
                      Key Strengths
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {currentCandidate.smartInsights.strengths.map((strength, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs bg-secondary/50 border-border text-foreground font-medium">
                          {strength}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {currentCandidate.smartInsights.potentialChallenges.length > 0 && (
                    <div className="space-y-2.5">
                      <p className="text-xs font-semibold text-foreground flex items-center gap-2 uppercase tracking-wide">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                        Areas to Watch
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {currentCandidate.smartInsights.potentialChallenges.map((challenge, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs bg-secondary/50 border-border text-foreground font-medium">
                            {challenge}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* LinkedIn Insights */}
              {currentCandidate.socials?.linkedinInsights && (
                <div className="pt-4 border-t border-border/50">
                  <p className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wide">LinkedIn Insights</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-secondary/80 flex items-center justify-center border border-border">
                        <span className="text-base font-bold text-foreground">{currentCandidate.socials.linkedinInsights.endorsements.length}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Endorsements</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-secondary/80 flex items-center justify-center border border-border">
                        <span className="text-base font-bold text-foreground">{currentCandidate.socials.linkedinInsights.recommendations.length}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Recommendations</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-secondary/80 flex items-center justify-center border border-border">
                        <span className="text-base font-bold text-foreground">{currentCandidate.socials.linkedinInsights.activityScore}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Activity Score</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-secondary/80 flex items-center justify-center border border-border">
                        <span className="text-[11px] font-bold text-foreground uppercase">{currentCandidate.socials.linkedinInsights.influenceLevel.slice(0, 3)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Influence</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </animated.div>

        {/* Instruction overlay for first card */}
        {currentIndex === 0 && history.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-card/95 backdrop-blur-md px-6 py-3 rounded-xl border border-border shadow-lg">
              <p className="text-sm text-muted-foreground font-medium">
                <span className="text-foreground">←</span> Swipe to decide <span className="text-foreground">→</span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="p-6 pb-8 border-t border-border">
        <div className="flex items-center justify-center gap-8 max-w-md mx-auto">
          <Button
            size="lg"
            variant="outline"
            className="h-14 w-14 rounded-full border-2 border-border hover:bg-secondary hover:border-destructive/50 transition-all"
            onClick={() => handleSwipe('no')}
          >
            <X className="h-7 w-7 text-destructive" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="h-12 w-12 rounded-full border-2 border-border hover:bg-secondary transition-all"
            onClick={handleUndo}
            disabled={history.length === 0}
          >
            <Undo2 className="h-5 w-5" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="h-14 w-14 rounded-full border-2 border-border hover:bg-secondary hover:border-success/50 transition-all"
            onClick={() => handleSwipe('yes')}
          >
            <Heart className="h-7 w-7 text-success" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SwipeView;
