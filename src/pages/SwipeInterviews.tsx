import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSpring, animated, config } from "@react-spring/web";
import { useGesture } from "@use-gesture/react";
import { mockInterviews, Interview } from "@/data/mockInterviews";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  ThumbsUp, 
  ThumbsDown, 
  PartyPopper,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  User,
  Calendar,
  Briefcase,
  Award,
  TrendingUp,
  Users,
  Linkedin,
  Github,
  Globe
} from "lucide-react";
import { SkillsRadar } from "@/components/SkillsRadar";
import { Separator } from "@/components/ui/separator";

const SwipeInterviews = () => {
  const { listId } = useParams();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const interviews = mockInterviews.filter(i => i.status === "completed");
  const currentInterview = interviews[currentIndex];
  const isLastInterview = currentIndex === interviews.length - 1;

  const [{ x, rotate, scale }, api] = useSpring(() => ({
    x: 0,
    rotate: 0,
    scale: 1,
    config: config.default,
  }));

  const bind = useGesture(
    {
      onDrag: ({ down, movement: [mx], direction: [xDir], velocity: [vx] }) => {
        const trigger = vx > 0.2;
        const dir = xDir < 0 ? -1 : 1;

        if (!down && trigger) {
          if (dir === 1) {
            handleApprove();
          } else {
            handleReject();
          }
        } else {
          api.start({
            x: down ? mx : 0,
            rotate: down ? mx / 10 : 0,
            scale: down ? 1.05 : 1,
            immediate: down,
          });
        }
      },
    },
    {
      drag: { filterTaps: true },
    }
  );

  const handleApprove = () => {
    api.start({
      x: 1000,
      rotate: 45,
      scale: 0.8,
      config: { ...config.default, duration: 300 },
      onRest: () => {
        setApprovedCount(prev => prev + 1);
        moveToNext();
      },
    });
  };

  const handleReject = () => {
    api.start({
      x: -1000,
      rotate: -45,
      scale: 0.8,
      config: { ...config.default, duration: 300 },
      onRest: () => {
        setRejectedCount(prev => prev + 1);
        moveToNext();
      },
    });
  };

  const moveToNext = () => {
    setTimeout(() => {
      if (isLastInterview) {
        setShowCelebration(true);
      } else {
        setCurrentIndex(prev => prev + 1);
        api.start({ x: 0, rotate: 0, scale: 1, immediate: true });
      }
    }, 100);
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

  if (showCelebration) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-12 pb-8 px-8">
            <PartyPopper className="h-20 w-20 mx-auto mb-6 text-primary animate-bounce" />
            <h2 className="text-3xl font-bold mb-4">All Done! 🎉</h2>
            <p className="text-muted-foreground mb-8">
              You've reviewed all interviews
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 rounded-lg bg-success/10">
                <ThumbsUp className="h-6 w-6 text-success mx-auto mb-2" />
                <div className="text-2xl font-bold text-success">{approvedCount}</div>
                <div className="text-sm text-muted-foreground">Approved</div>
              </div>
              <div className="p-4 rounded-lg bg-destructive/10">
                <ThumbsDown className="h-6 w-6 text-destructive mx-auto mb-2" />
                <div className="text-2xl font-bold text-destructive">{rejectedCount}</div>
                <div className="text-sm text-muted-foreground">Rejected</div>
              </div>
            </div>
            
            <p className="text-sm text-gray-400 mt-8">
              Your selections have been saved. You can close this window now.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentInterview) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">No interviews to review</p>
      </div>
    );
  }

  const recommendationConfig = getRecommendationConfig(currentInterview.recommendation);
  const RecommendationIcon = recommendationConfig.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4 overflow-hidden">
      {/* Progress Bar */}
      <div className="max-w-2xl mx-auto mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">
            Interview {currentIndex + 1} of {interviews.length}
          </span>
          <span className="text-sm text-muted-foreground">
            {Math.round(((currentIndex + 1) / interviews.length) * 100)}%
          </span>
        </div>
        <Progress value={((currentIndex + 1) / interviews.length) * 100} />
      </div>

      {/* Swipe Card */}
      <div className="max-w-2xl mx-auto relative h-[calc(100vh-120px)]">
        <animated.div
          {...bind()}
          style={{
            x,
            rotate,
            scale,
            touchAction: "none",
            position: "absolute",
            width: "100%",
            height: "100%",
          }}
        >
          <Card className="h-full overflow-y-auto !bg-card shadow-2xl">
            <CardHeader className="!bg-gradient-to-r from-primary/10 via-background to-accent/10 border-b pb-6">
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
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-6 z-10">
          <Button
            size="lg"
            variant="destructive"
            className="h-16 w-16 rounded-full shadow-xl"
            onClick={handleReject}
          >
            <ThumbsDown className="h-6 w-6" />
          </Button>
          <Button
            size="lg"
            className="h-16 w-16 rounded-full shadow-xl bg-success hover:bg-success/90"
            onClick={handleApprove}
          >
            <ThumbsUp className="h-6 w-6" />
          </Button>
        </div>

        {/* Swipe Indicators */}
        <animated.div
          style={{
            opacity: x.to((xVal) => Math.abs(xVal as number) / 100),
            position: "absolute",
            top: "50%",
            left: "20px",
            transform: "translateY(-50%)",
          }}
          className="pointer-events-none"
        >
          <div className="bg-destructive/90 text-white px-6 py-3 rounded-full font-bold text-xl shadow-xl rotate-[-20deg]">
            REJECT
          </div>
        </animated.div>
        <animated.div
          style={{
            opacity: x.to((xVal) => Math.abs(xVal as number) / 100),
            position: "absolute",
            top: "50%",
            right: "20px",
            transform: "translateY(-50%)",
          }}
          className="pointer-events-none"
        >
          <div className="bg-success/90 text-white px-6 py-3 rounded-full font-bold text-xl shadow-xl rotate-[20deg]">
            APPROVE
          </div>
        </animated.div>
      </div>
    </div>
  );
};

export default SwipeInterviews;
