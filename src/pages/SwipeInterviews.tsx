import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { mockInterviews, Interview } from "@/data/mockInterviews";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  PartyPopper,
  CheckCircle2,
  AlertCircle,
  XCircle,
  User,
  Calendar,
  Briefcase,
  Award,
  TrendingUp,
  Users,
  Linkedin,
  Sparkles,
  CheckCircle,
  ArrowLeft,
  Undo2
} from "lucide-react";
import { SkillsRadar } from "@/components/SkillsRadar";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

const SwipeInterviews = () => {
  const { listId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Get OTP from URL
  const urlOtp = searchParams.get('otp') || '';
  
  // OTP verification state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState(false);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState<{ index: number; decision: 'yes' | 'no' }[]>([]);
  const [swipeFeedback, setSwipeFeedback] = useState<'yes' | 'no' | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  // If no OTP in URL, redirect
  useEffect(() => {
    if (!urlOtp) {
      navigate('/interviews');
    }
  }, [urlOtp, navigate]);

  const interviews = mockInterviews.filter(i => i.status === "completed");
  const currentInterview = interviews[currentIndex];

  // Verify OTP
  const verifyOtp = () => {
    if (otpInput === urlOtp) {
      setIsAuthenticated(true);
      setOtpError(false);
    } else {
      setOtpError(true);
      setTimeout(() => setOtpError(false), 500);
    }
  };

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
    if (currentIndex >= interviews.length) return;
    
    setHistory(prev => [...prev, { index: currentIndex, decision }]);
    
    const direction = decision === 'yes' ? 1 : -1;
    
    // Show feedback animation
    setSwipeFeedback(decision);
    
    api.start({
      x: direction * 500,
      rotate: direction * 30,
      opacity: 0,
      config: { tension: 200, friction: 20 },
    });

    // Move to next interview after feedback animation
    setTimeout(() => {
      setSwipeFeedback(null);
      if (currentIndex < interviews.length - 1) {
        setCurrentIndex(prev => prev + 1);
        api.set({ x: 0, rotate: 0, opacity: 1 });
      } else {
        setShowCelebration(true);
      }
    }, 400);
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

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  const getRecommendationConfig = (recommendation: Interview["recommendation"]) => {
    switch (recommendation) {
      case "strong_hire":
        return { icon: CheckCircle2, label: "Strong Hire", className: "bg-success/10 text-success border-success/20" };
      case "hire":
        return { icon: CheckCircle2, label: "Hire", className: "bg-primary/10 text-primary border-primary/20" };
      case "maybe":
        return { icon: AlertCircle, label: "Maybe", className: "bg-accent/10 text-accent border-accent/20" };
      case "no_hire":
        return { icon: XCircle, label: "No Hire", className: "bg-destructive/10 text-destructive border-destructive/20" };
    }
  };

  const overallScore = currentInterview ? Math.round(
    (currentInterview.insights.communication +
      currentInterview.insights.technicalSkills +
      currentInterview.insights.problemSolving +
      currentInterview.insights.culturalFit +
      currentInterview.insights.leadership +
      currentInterview.insights.adaptability) / 6
  ) : 0;

  // OTP verification screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <Card className="p-8 max-w-md w-full bg-[#1a1a1a] border-[#2a2a2a]">
          <div className="text-center mb-6">
            <div className="inline-flex p-3 rounded-full bg-white/10 mb-4">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Access Code Required</h2>
            <p className="text-sm text-gray-400">Enter the 6-digit code shown on your desktop</p>
          </div>
          
          <div className="space-y-4">
            <Input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
              onKeyDown={(e) => e.key === 'Enter' && verifyOtp()}
              placeholder="000000"
              className={`text-center text-2xl font-mono tracking-widest h-14 bg-[#0a0a0a] border-[#2a2a2a] text-white ${
                otpError ? 'border-red-500 animate-shake' : ''
              }`}
            />
            
            {otpError && (
              <p className="text-sm text-red-400 text-center">Invalid code. Please try again.</p>
            )}
            
            <Button 
              onClick={verifyOtp} 
              className="w-full h-12 text-base"
              disabled={otpInput.length !== 6}
            >
              Continue
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Celebration screen
  if (showCelebration) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-blue-500/10 animate-pulse" />
        
        <Card className="p-12 max-w-lg w-full bg-[#1a1a1a] border-[#2a2a2a] text-center relative z-10">
          <div className="inline-flex p-6 rounded-full bg-gradient-to-br from-green-500/20 to-blue-500/20 mb-6 animate-bounce">
            <PartyPopper className="h-16 w-16 text-green-400" />
          </div>
          
          <h2 className="text-4xl font-bold text-white mb-4">All Done! 🎉</h2>
          <p className="text-lg text-gray-300 mb-8">
            You've reviewed all {interviews.length} interviews. Great job!
          </p>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center p-4 rounded-lg bg-[#0a0a0a] border border-green-500/20">
              <span className="text-gray-400">Selected</span>
              <span className="text-2xl font-bold text-green-400">
                {history.filter(h => h.decision === 'yes').length}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-lg bg-[#0a0a0a] border border-red-500/20">
              <span className="text-gray-400">Passed</span>
              <span className="text-2xl font-bold text-red-400">
                {history.filter(h => h.decision === 'no').length}
              </span>
            </div>
          </div>
          
          <p className="text-sm text-gray-400 mt-8">
            Your selections have been saved. You can close this window now.
          </p>
        </Card>
      </div>
    );
  }

  if (!currentInterview) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">No interviews to review</h2>
          <Button onClick={() => navigate('/interviews')}>Return to Interviews</Button>
        </div>
      </div>
    );
  }

  const recommendationConfig = getRecommendationConfig(currentInterview.recommendation);
  const RecommendationIcon = recommendationConfig.icon;
  const progressPercentage = ((currentIndex + 1) / interviews.length) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="p-4 pb-3 border-b border-border bg-card">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate('/interviews')} className="hover:bg-secondary">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleUndo}
              disabled={history.length === 0}
              className="hover:bg-secondary"
            >
              <Undo2 className="h-4 w-4 mr-1" />
              Undo
            </Button>
          </div>
          <Badge variant="outline" className="bg-secondary border-border font-medium text-foreground">
            {currentIndex + 1} / {interviews.length}
          </Badge>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-foreground transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Role Info */}
      <div className="px-4 py-3 border-b border-border bg-card space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Briefcase className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Evaluating:</span>
          <span className="font-semibold text-foreground">{currentInterview.role}</span>
        </div>
      </div>

      {/* Card Stack Area */}
      <div className="flex-1 flex items-center justify-center p-6 relative bg-secondary/30">
        {/* Swipe Feedback Animation */}
        {swipeFeedback && (
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none animate-fade-in">
            {swipeFeedback === 'yes' ? (
              <div className="animate-scale-in">
                <CheckCircle className="h-32 w-32 text-success drop-shadow-2xl" strokeWidth={2.5} />
              </div>
            ) : (
              <div className="animate-scale-in">
                <XCircle className="h-32 w-32 text-destructive drop-shadow-2xl" strokeWidth={2.5} />
              </div>
            )}
          </div>
        )}
        
        <animated.div
          {...bind()}
          style={{ x, rotate, opacity, touchAction: 'none' }}
          className="w-full max-w-md"
        >
          <Card className="max-h-[calc(100vh-250px)] overflow-y-auto shadow-lg border border-border cursor-grab active:cursor-grabbing relative bg-card">
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

            <CardHeader className="bg-gradient-to-r from-primary/10 via-background to-accent/10 border-b pb-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <Avatar className="h-16 w-16 border-2 border-primary/20">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">
                      {getInitials(currentInterview.candidateName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-1">{currentInterview.candidateName}</h2>
                    <p className="text-muted-foreground mb-3">{currentInterview.role}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline">{currentInterview.round}</Badge>
                      <Badge className={recommendationConfig.className}>
                        <RecommendationIcon className="h-3 w-3 mr-1" />
                        {recommendationConfig.label}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary">{overallScore}</div>
                  <div className="text-xs text-muted-foreground">Overall Score</div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Interview Details */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-primary" />
                  Interview Details
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Interviewer:</span>
                    <span className="font-medium">{currentInterview.interviewer}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-medium">
                      {new Date(currentInterview.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {currentInterview.summary && (
                  <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                    {currentInterview.summary}
                  </p>
                )}
              </div>

              <Separator />

              {/* Skills Radar */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Award className="h-4 w-4 text-primary" />
                  Competency Assessment
                </h3>
                <SkillsRadar skills={currentInterview.insights} />
              </div>

              <Separator />

              {/* Key Tags */}
              {currentInterview.tags.length > 0 && (
                <>
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      Key Highlights
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {currentInterview.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Separator />
                </>
              )}

              {/* Mock LinkedIn Insights */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Linkedin className="h-4 w-4 text-primary" />
                  Professional Profile
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <span className="text-muted-foreground">Connections</span>
                    <span className="font-semibold">500+</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <span className="text-muted-foreground">Endorsements</span>
                    <span className="font-semibold">48 skills endorsed</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <span className="text-muted-foreground">Recommendations</span>
                    <span className="font-semibold">12 recommendations</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <span className="text-muted-foreground">Activity Score</span>
                    <Badge className="bg-success/10 text-success border-success/20">High</Badge>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Profile Insights */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Profile Insights
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                    <p className="text-muted-foreground mb-1">Work Style</p>
                    <p className="font-medium">Collaborative problem-solver with strong communication</p>
                  </div>
                  <div className="p-3 rounded-lg bg-accent/5 border border-accent/10">
                    <p className="text-muted-foreground mb-1">Best Fit For</p>
                    <p className="font-medium">Cross-functional teams requiring technical leadership</p>
                  </div>
                  <div className="p-3 rounded-lg bg-success/5 border border-success/10">
                    <p className="text-muted-foreground mb-1">Growth Potential</p>
                    <p className="font-medium">High potential for senior IC or management track</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </animated.div>

        {/* Action Buttons */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
          <Button
            size="lg"
            variant="destructive"
            className="h-16 w-16 rounded-full shadow-xl hover:scale-110 transition-transform"
            onClick={() => handleSwipe('no')}
          >
            <XCircle className="h-7 w-7" />
          </Button>
          <Button
            size="lg"
            className="h-16 w-16 rounded-full shadow-xl bg-success hover:bg-success/90 hover:scale-110 transition-transform"
            onClick={() => handleSwipe('yes')}
          >
            <CheckCircle className="h-7 w-7" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SwipeInterviews;
