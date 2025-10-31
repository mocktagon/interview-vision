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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col">
      {/* Header */}
      <div className="p-4 pb-2">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(`/list/${listId}`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
            {currentIndex + 1} / {list.candidates.length}
          </Badge>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Role Info */}
      <div className="px-4 py-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Briefcase className="h-4 w-4" />
          <span>Evaluating for: <span className="font-semibold text-foreground">{currentCandidate.role}</span></span>
        </div>
      </div>

      {/* Card Stack Area */}
      <div className="flex-1 flex items-center justify-center p-4 relative">
        <animated.div
          {...bind()}
          style={{ x, rotate, opacity, touchAction: 'none' }}
          className="w-full max-w-md"
        >
          <Card className="p-6 shadow-2xl border-2 cursor-grab active:cursor-grabbing relative overflow-hidden">
            {/* Swipe Indicators */}
            <animated.div 
              style={{ opacity: x.to(x => Math.max(0, x / 100)) }}
              className="absolute top-6 right-6 z-10"
            >
              <div className="bg-success text-success-foreground px-4 py-2 rounded-lg font-bold text-lg transform rotate-12 border-4 border-success">
                GOOD FIT
              </div>
            </animated.div>
            <animated.div 
              style={{ opacity: x.to(x => Math.max(0, -x / 100)) }}
              className="absolute top-6 left-6 z-10"
            >
              <div className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg font-bold text-lg transform -rotate-12 border-4 border-destructive">
                NOPE
              </div>
            </animated.div>

            {/* Candidate Info */}
            <div className="space-y-4">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-1">{currentCandidate.name}</h2>
                <p className="text-lg text-muted-foreground">{currentCandidate.role}</p>
              </div>

              {/* Scores */}
              <div className="flex gap-2 flex-wrap">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                  <Star className="h-3 w-3 mr-1" />
                  Overall: {currentCandidate.scores.overall}
                </Badge>
                <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">
                  <TrendingUp className="h-3 w-3 mr-1" />
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
                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-2">
                    <Sparkles className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-primary mb-1">Personality</p>
                      <p className="text-sm text-foreground">{currentCandidate.smartInsights.personality}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-success">Strengths</p>
                    <div className="flex flex-wrap gap-1">
                      {currentCandidate.smartInsights.strengths.map((strength, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs bg-success/10 text-success border-success/30">
                          {strength}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {currentCandidate.smartInsights.potentialChallenges.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-destructive">Potential Challenges</p>
                      <div className="flex flex-wrap gap-1">
                        {currentCandidate.smartInsights.potentialChallenges.map((challenge, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs bg-destructive/10 text-destructive border-destructive/30">
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
                <div className="pt-2 border-t border-border">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">LinkedIn Profile</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">Endorsements</p>
                      <p className="font-semibold text-foreground">{currentCandidate.socials.linkedinInsights.endorsements.length}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Recommendations</p>
                      <p className="font-semibold text-foreground">{currentCandidate.socials.linkedinInsights.recommendations.length}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Activity Score</p>
                      <p className="font-semibold text-foreground">{currentCandidate.socials.linkedinInsights.activityScore}/10</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Influence</p>
                      <p className="font-semibold text-foreground capitalize">{currentCandidate.socials.linkedinInsights.influenceLevel}</p>
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
            <div className="bg-background/90 backdrop-blur-sm px-6 py-3 rounded-lg border border-border shadow-lg">
              <p className="text-sm text-muted-foreground">👈 Swipe left to reject | Swipe right to accept 👉</p>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="p-6 pb-8">
        <div className="flex items-center justify-center gap-6 max-w-md mx-auto">
          <Button
            size="lg"
            variant="outline"
            className="h-16 w-16 rounded-full border-2 border-destructive/30 hover:bg-destructive/10 hover:border-destructive"
            onClick={() => handleSwipe('no')}
          >
            <X className="h-8 w-8 text-destructive" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="h-14 w-14 rounded-full border-2"
            onClick={handleUndo}
            disabled={history.length === 0}
          >
            <Undo2 className="h-6 w-6" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="h-16 w-16 rounded-full border-2 border-success/30 hover:bg-success/10 hover:border-success"
            onClick={() => handleSwipe('yes')}
          >
            <Heart className="h-8 w-8 text-success" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SwipeView;
