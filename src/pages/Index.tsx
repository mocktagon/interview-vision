import { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import { mockCandidates } from "@/data/mockCandidates";
import { Candidate } from "@/types/candidate";
import { KPICard } from "@/components/KPICard";
import { CandidateCard } from "@/components/CandidateCard";
import { CandidateDrawer } from "@/components/CandidateDrawer";
import { ScoreDistributionChart } from "@/components/ScoreDistributionChart";
import { SwipeQRSection } from "@/components/SwipeQRSection";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Users, 
  TrendingUp, 
  Star, 
  CheckCircle,
  Search,
  Filter,
  LayoutGrid,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
  RefreshCw,
  X
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const { listId } = useParams();
  const navigate = useNavigate();
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [isAnalyticsPanelOpen, setIsAnalyticsPanelOpen] = useState(true);
  const [aiSearchQuery, setAiSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [swipeDecisions, setSwipeDecisions] = useState<Record<string, 'good-fit' | 'nope' | 'maybe'>>({});
  const [showGoodFitsOnly, setShowGoodFitsOnly] = useState(false);
  const [minScore, setMinScore] = useState<number>(0);
  const [minExperience, setMinExperience] = useState<number>(0);
  const [swipeStatus, setSwipeStatus] = useState<string>("all");
  const [starredOnly, setStarredOnly] = useState(false);

  // Load swipe decisions from localStorage
  useEffect(() => {
    const decisions = JSON.parse(localStorage.getItem('swipeDecisions') || '{}');
    setSwipeDecisions(decisions);
  }, []);

  const handleSwipeStatusChange = (candidateId: string, status: 'good-fit' | 'nope' | 'maybe') => {
    const decisions = JSON.parse(localStorage.getItem('swipeDecisions') || '{}');
    decisions[candidateId] = status;
    localStorage.setItem('swipeDecisions', JSON.stringify(decisions));
    setSwipeDecisions(decisions);
  };

  const handleRefreshStatuses = () => {
    const decisions = JSON.parse(localStorage.getItem('swipeDecisions') || '{}');
    setSwipeDecisions(decisions);
  };

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      setIsScrolled(target.scrollTop > 20);
    };

    const scrollContainer = document.querySelector('.main-scroll-container');
    scrollContainer?.addEventListener('scroll', handleScroll);

    return () => scrollContainer?.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredCandidates = useMemo(() => {
    return mockCandidates.filter(candidate => {
      // Search filter - matches name, role, or email
      const matchesSearch = 
        candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Stage filter - filter by recruitment stage
      const matchesStage = stageFilter === "all" || candidate.stage === stageFilter;
      
      // Score filter - minimum overall score threshold
      const matchesScore = candidate.scores.overall >= minScore;
      
      // Experience filter - minimum years of experience
      const matchesExperience = candidate.experience >= minExperience;
      
      // Swipe status filter - filter by review decision
      const matchesSwipeStatus = 
        swipeStatus === "all" ||
        (swipeStatus === "good-fit" && swipeDecisions[candidate.id] === 'good-fit') ||
        (swipeStatus === "nope" && swipeDecisions[candidate.id] === 'nope') ||
        (swipeStatus === "not-reviewed" && !swipeDecisions[candidate.id]);
      
      // Starred filter - show only starred candidates
      const matchesStarred = !starredOnly || candidate.starred;
      
      // Legacy good fits filter (kept for QR functionality)
      const matchesGoodFit = !showGoodFitsOnly || swipeDecisions[candidate.id] === 'good-fit';
      
      return matchesSearch && matchesStage && matchesScore && matchesExperience && 
             matchesSwipeStatus && matchesStarred && matchesGoodFit;
    });
  }, [searchQuery, stageFilter, showGoodFitsOnly, swipeDecisions, minScore, minExperience, swipeStatus, starredOnly]);

  const stats = useMemo(() => {
    const topPerformers = filteredCandidates.filter(c => c.starred).length;
    const eligible = filteredCandidates.filter(c => c.eligibleForRoles && c.eligibleForRoles.length > 0).length;
    const avgScore = filteredCandidates.reduce((sum, c) => sum + (c.scores.overall || 0), 0) / filteredCandidates.length;
    const selected = filteredCandidates.filter(c => c.stage === 'selected').length;
    
    return { topPerformers, eligible, avgScore: avgScore.toFixed(0), selected };
  }, [filteredCandidates]);

  const handleViewCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setDrawerOpen(true);
  };

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden relative">
      <main className="flex-1 overflow-hidden relative">
        <div className={`container mx-auto h-full flex flex-col transition-all duration-300 ${isAnalyticsPanelOpen ? 'pr-[calc(30%+1.5rem)]' : 'pr-16'}`} style={{ paddingLeft: '1.5rem', paddingRight: isAnalyticsPanelOpen ? 'calc(30% + 1.5rem)' : '4rem' }}>
          {/* Back Button & Greeting - Vanishes on scroll */}
          {!isScrolled && (
            <div className="py-4 flex-shrink-0 transition-all duration-300">
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="mb-2 -ml-2"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Lists
              </Button>
              <h1 className="text-2xl font-semibold text-foreground">Hi John</h1>
            </div>
          )}
          
          {/* Back Button - Sticky when scrolled */}
          {isScrolled && (
            <div className="flex-shrink-0 sticky top-0 bg-background/95 backdrop-blur-sm z-20 py-2">
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="-ml-2"
                size="sm"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
          )}
          
          {/* AI Search Bar - Sticky */}
          <div className={`flex-shrink-0 transition-all duration-300 sticky top-0 bg-background/95 backdrop-blur-sm z-20 ${isScrolled ? 'py-3 shadow-sm' : 'py-2'}`}>
            <div className="relative max-w-4xl mx-auto">
              {!isScrolled && <div className="absolute inset-0 bg-primary/10 rounded-lg blur-sm" />}
              <div className={`relative bg-card border border-border rounded-lg shadow-sm transition-all duration-300 ${isScrolled ? 'p-2.5' : 'p-3'}`}>
                <div className={`flex items-center transition-all duration-300 ${isScrolled ? 'gap-2' : 'gap-3'}`}>
                  {!isScrolled && (
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div className="flex-1">
                    <Input
                      placeholder={isScrolled ? "Ask AI..." : "Ask AI to analyze candidates..."}
                      value={aiSearchQuery}
                      onChange={(e) => setAiSearchQuery(e.target.value)}
                      className={`border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/60 transition-all duration-300 ${isScrolled ? 'text-sm' : 'text-base'}`}
                    />
                  </div>
                  <Badge className="bg-primary/10 text-primary border-primary/30 gap-1.5">
                    <Zap className="h-3 w-3" />
                    AI Powered
                  </Badge>
                </div>
                {aiSearchQuery && (
                  <div className="mt-2 pt-2 border-t border-border">
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1.5">
                      <Sparkles className="h-2.5 w-2.5 text-primary" />
                      AI analyzing: "{aiSearchQuery}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 min-h-0 pb-4 overflow-y-auto main-scroll-container">
            {/* Main Content (Scrollable Candidates) */}
            <div className="h-full flex flex-col">
              {/* Search and Filters */}
              <div className="flex flex-col gap-3 mb-4 flex-shrink-0 sticky top-0 bg-background/95 backdrop-blur-sm py-3 z-10">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, role, or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Filter Controls */}
                <div className="flex flex-wrap gap-2 items-center">
                  {/* Stage Filter */}
                  <Select value={stageFilter} onValueChange={setStageFilter}>
                    <SelectTrigger className="w-[180px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Recruitment Stage" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border z-50">
                      <SelectItem value="all">All Stages</SelectItem>
                      <SelectItem value="screening">Screening</SelectItem>
                      <SelectItem value="prelims">Preliminary</SelectItem>
                      <SelectItem value="fitment">Fitment</SelectItem>
                      <SelectItem value="final">Final Review</SelectItem>
                      <SelectItem value="selected">Selected</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Score Filter */}
                  <Select value={minScore.toString()} onValueChange={(v) => setMinScore(Number(v))}>
                    <SelectTrigger className="w-[180px]">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Min Score" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border z-50">
                      <SelectItem value="0">Any Score</SelectItem>
                      <SelectItem value="80">80+ (Top Performers)</SelectItem>
                      <SelectItem value="70">70+ (High Potential)</SelectItem>
                      <SelectItem value="60">60+ (Good Candidates)</SelectItem>
                      <SelectItem value="50">50+ (Above Average)</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Experience Filter */}
                  <Select value={minExperience.toString()} onValueChange={(v) => setMinExperience(Number(v))}>
                    <SelectTrigger className="w-[180px]">
                      <Users className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Experience" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border z-50">
                      <SelectItem value="0">Any Experience</SelectItem>
                      <SelectItem value="1">1+ years</SelectItem>
                      <SelectItem value="3">3+ years (Mid-level)</SelectItem>
                      <SelectItem value="5">5+ years (Senior)</SelectItem>
                      <SelectItem value="8">8+ years (Expert)</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Swipe Status Filter */}
                  <Select value={swipeStatus} onValueChange={setSwipeStatus}>
                    <SelectTrigger className="w-[180px]">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Review Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border z-50">
                      <SelectItem value="all">All Reviews</SelectItem>
                      <SelectItem value="good-fit">✓ Good Fits</SelectItem>
                      <SelectItem value="nope">✗ Rejected</SelectItem>
                      <SelectItem value="not-reviewed">○ Not Reviewed</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Starred Toggle */}
                  <Button
                    variant={starredOnly ? "default" : "outline"}
                    onClick={() => setStarredOnly(!starredOnly)}
                    className="gap-2"
                  >
                    <Star className={`h-4 w-4 ${starredOnly ? 'fill-current' : ''}`} />
                    Starred Only
                  </Button>

                  {/* Clear Filters */}
                  {(searchQuery || stageFilter !== "all" || minScore > 0 || minExperience > 0 || 
                    swipeStatus !== "all" || starredOnly || showGoodFitsOnly) && (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setSearchQuery("");
                        setStageFilter("all");
                        setMinScore(0);
                        setMinExperience(0);
                        setSwipeStatus("all");
                        setStarredOnly(false);
                        setShowGoodFitsOnly(false);
                      }}
                      className="gap-2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                      Clear Filters
                    </Button>
                  )}

                  {/* Refresh Button */}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleRefreshStatuses}
                    title="Refresh review statuses from mobile"
                    className="ml-auto"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>

                {/* Active Filters Summary */}
                {(minScore > 0 || minExperience > 0 || swipeStatus !== "all" || starredOnly || stageFilter !== "all") && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-medium">Active filters:</span>
                    {stageFilter !== "all" && <Badge variant="secondary" className="text-xs">Stage: {stageFilter}</Badge>}
                    {minScore > 0 && <Badge variant="secondary" className="text-xs">Score ≥ {minScore}</Badge>}
                    {minExperience > 0 && <Badge variant="secondary" className="text-xs">{minExperience}+ years</Badge>}
                    {swipeStatus !== "all" && <Badge variant="secondary" className="text-xs">{swipeStatus === "good-fit" ? "Good Fits" : swipeStatus === "nope" ? "Rejected" : "Not Reviewed"}</Badge>}
                    {starredOnly && <Badge variant="secondary" className="text-xs">Starred</Badge>}
                  </div>
                )}
              </div>

              {/* Candidates Grid - Scrollable Content */}
              <div className="flex-1 pb-4 space-y-6">
                 {/* Mobile Review QR Section */}
                 <div className="w-full animate-slide-in-right transform-gpu" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
           <SwipeQRSection 
             listId={listId || '1'}
             searchQuery={searchQuery}
             selectedStage={stageFilter}
             showGoodFitsOnly={showGoodFitsOnly}
           />
                 </div>

                 {/* Candidates Section */}
                 <div className="animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
                   <div className="mb-4 flex-shrink-0">
                     <div className="flex items-center gap-2 mb-2">
                       <LayoutGrid className="h-5 w-5 text-primary" />
                       <h2 className="text-lg font-semibold">Candidates</h2>
                     </div>
                     <p className="text-sm text-muted-foreground">
                       Showing {filteredCandidates.length} of {mockCandidates.length} candidates
                     </p>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                     {filteredCandidates.map((candidate) => (
                       <CandidateCard
                         key={candidate.id}
                         candidate={candidate}
                         onViewDetails={handleViewCandidate}
                         swipeStatus={swipeDecisions[candidate.id] || null}
                         onSwipeStatusChange={handleSwipeStatusChange}
                       />
                     ))}
                   </div>
                   
                   {filteredCandidates.length === 0 && (
                     <div className="text-center py-12">
                       <p className="text-muted-foreground">No candidates match your filters</p>
                     </div>
                   )}
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Analytics Panel (Full Height Sidebar) */}
        <div className={`fixed top-0 right-0 h-screen bg-card border-l border-border transition-all duration-300 z-30 ${isAnalyticsPanelOpen ? 'w-[30%]' : 'w-0'}`}>
          {/* Toggle Button - Top Right Corner */}
          <button
            onClick={() => setIsAnalyticsPanelOpen(!isAnalyticsPanelOpen)}
            className="absolute top-4 -left-10 h-10 w-10 bg-card border border-border rounded-lg hover:bg-accent/10 hover:border-primary/30 transition-all duration-300 flex items-center justify-center shadow-md group"
          >
            {isAnalyticsPanelOpen ? (
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            ) : (
              <ChevronLeft className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            )}
          </button>
          
          {isAnalyticsPanelOpen && (
            <div className="h-full flex flex-col overflow-hidden">
              <div className="flex-1 flex flex-col p-4 overflow-hidden">
                <div className="mb-4 text-center flex-shrink-0">
                  <h3 className="text-base font-semibold text-foreground">Analytics</h3>
                </div>
                
                {/* Compact KPI Cards */}
                <div className="grid grid-cols-2 gap-2 mb-4 flex-shrink-0">
                  <div className="p-2.5 rounded-lg bg-muted/30 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Users className="h-3.5 w-3.5 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground font-medium">Total</p>
                    </div>
                    <p className="text-xl font-bold text-foreground">{filteredCandidates.length}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-success/10 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <CheckCircle className="h-3.5 w-3.5 text-success" />
                      <p className="text-xs text-success font-medium">Eligible</p>
                    </div>
                    <p className="text-xl font-bold text-success">{stats.eligible}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-accent/10 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Star className="h-3.5 w-3.5 text-accent" />
                      <p className="text-xs text-accent font-medium">Top 10%</p>
                    </div>
                    <p className="text-xl font-bold text-accent">{stats.topPerformers}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-primary/10 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <TrendingUp className="h-3.5 w-3.5 text-primary" />
                      <p className="text-xs text-primary font-medium">Avg Score</p>
                    </div>
                    <p className="text-xl font-bold text-primary">{stats.avgScore}</p>
                  </div>
                </div>
                
                <div className="flex-1 min-h-0 overflow-hidden">
                  <ScoreDistributionChart candidates={filteredCandidates} aiQuery={aiSearchQuery} />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Candidate Detail Drawer */}
      <CandidateDrawer
        candidate={selectedCandidate}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  );
};

export default Index;
