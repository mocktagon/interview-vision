import { useState, useMemo, useEffect } from "react";
import { mockCandidates } from "@/data/mockCandidates";
import { Candidate } from "@/types/candidate";
import { KPICard } from "@/components/KPICard";
import { CandidateCard } from "@/components/CandidateCard";
import { CandidateDrawer } from "@/components/CandidateDrawer";
import { ScoreDistributionChart } from "@/components/ScoreDistributionChart";
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
  Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const navigate = useNavigate();
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [isAnalyticsPanelOpen, setIsAnalyticsPanelOpen] = useState(true);
  const [aiSearchQuery, setAiSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

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
      const matchesSearch = 
        candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStage = stageFilter === "all" || candidate.stage === stageFilter;
      
      return matchesSearch && matchesStage;
    });
  }, [searchQuery, stageFilter]);

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
      {/* Header - Minimizes on scroll */}
      <header className={`border-b border-border bg-card/95 backdrop-blur-sm flex-shrink-0 relative z-10 transition-all duration-300 ${isScrolled ? 'py-2' : 'py-3'}`}>
        <div className={`container mx-auto transition-all duration-300 ${isAnalyticsPanelOpen ? 'pr-[calc(30%+3rem)]' : 'pr-16'}`} style={{ paddingLeft: '1.5rem' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className={`font-bold text-foreground transition-all duration-300 ${isScrolled ? 'text-base' : 'text-xl'}`}>Candidate Intelligence</h1>
                {!isScrolled && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                  AI-powered insights for smarter hiring decisions
                </p>
                )}
              </div>
            </div>
            <Button size={isScrolled ? "sm" : "default"} className={`transition-all duration-300 ${isScrolled ? 'h-8 text-xs' : 'h-9'}`}>
              {isScrolled ? 'Export' : 'Export Report'}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden relative">
        <div className={`container mx-auto h-full flex flex-col transition-all duration-300 ${isAnalyticsPanelOpen ? 'pr-[calc(30%+1.5rem)]' : 'pr-16'}`} style={{ paddingLeft: '1.5rem', paddingRight: isAnalyticsPanelOpen ? 'calc(30% + 1.5rem)' : '4rem' }}>
          {/* AI Search Bar - Minimizes on scroll */}
          <div className={`flex-shrink-0 transition-all duration-300 ${isScrolled ? 'py-2' : 'py-4'}`}>
            <div className="relative max-w-4xl mx-auto">
              {!isScrolled && <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-lg blur-xl" />}
              <div className={`relative bg-card border-2 border-primary/30 rounded-lg shadow-lg transition-all duration-300 ${isScrolled ? 'p-2' : 'p-3'}`}>
                <div className={`flex items-center transition-all duration-300 ${isScrolled ? 'gap-1.5' : 'gap-2'}`}>
                  {!isScrolled && (
                    <div className="p-1.5 rounded-lg bg-primary/10">
                      <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                    </div>
                  )}
                  <div className="flex-1">
                    <Input
                      placeholder={isScrolled ? "Ask AI..." : "Ask AI to analyze candidates... (e.g., 'Show top performers' or 'Highlight scores above 85')"}
                      value={aiSearchQuery}
                      onChange={(e) => setAiSearchQuery(e.target.value)}
                      className={`border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/60 transition-all duration-300 ${isScrolled ? 'text-xs' : 'text-sm'}`}
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
              <div className="flex flex-col sm:flex-row gap-3 mb-4 flex-shrink-0 sticky top-0 bg-background/95 backdrop-blur-sm py-3 z-10">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search candidates by name, role, or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={stageFilter} onValueChange={setStageFilter}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stages</SelectItem>
                    <SelectItem value="screening">Screening</SelectItem>
                    <SelectItem value="prelims">Preliminary</SelectItem>
                    <SelectItem value="fitment">Fitment</SelectItem>
                    <SelectItem value="final">Final Review</SelectItem>
                    <SelectItem value="selected">Selected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Candidates Grid - Scrollable Content */}
              <div className="flex-1 pb-4">
                <div className="mb-3 flex-shrink-0">
                  <div className="flex items-center gap-2 mb-1">
                    <LayoutGrid className="h-4 w-4 text-primary" />
                    <h2 className="text-base font-semibold">Candidate Profiles</h2>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Multi-stage assessment with AI-powered insights
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {filteredCandidates.map((candidate) => (
                    <CandidateCard
                      key={candidate.id}
                      candidate={candidate}
                      onViewDetails={handleViewCandidate}
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

        {/* Right Side - Analytics Panel (Full Height Sidebar) */}
        <div className={`fixed top-0 right-0 h-screen bg-card border-l border-border transition-all duration-300 z-20 shadow-xl ${isAnalyticsPanelOpen ? 'w-[30%]' : 'w-12'}`}>
          <Collapsible open={isAnalyticsPanelOpen} onOpenChange={setIsAnalyticsPanelOpen} className="h-full">
            <div className="relative h-full flex flex-col">
              {/* Collapse/Expand Tab */}
              <CollapsibleTrigger asChild>
                <button
                  className={`absolute top-1/2 -translate-y-1/2 h-40 bg-card border border-border hover:bg-accent/10 transition-all duration-300 flex items-center justify-center group shadow-lg ${
                    isAnalyticsPanelOpen 
                      ? '-left-10 w-10 rounded-l-xl' 
                      : '-left-12 w-12 rounded-l-lg'
                  }`}
                >
                  <div className="relative flex items-center justify-center w-full h-full">
                    <span 
                      className={`font-semibold text-muted-foreground group-hover:text-primary transition-colors whitespace-nowrap ${
                        isAnalyticsPanelOpen ? 'text-xs' : 'text-sm'
                      }`}
                      style={{ 
                        writingMode: 'vertical-rl',
                        textOrientation: 'mixed',
                        transform: 'rotate(180deg)'
                      }}
                    >
                      {isAnalyticsPanelOpen ? (
                        <>Smart Insights →</>
                      ) : (
                        <>← Smart Insights</>
                      )}
                    </span>
                  </div>
                </button>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="animate-accordion-down h-full flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 pt-6">
                  <div className="mb-4 text-center">
                    <h3 className="text-sm font-semibold text-foreground mb-3">Smart Insights</h3>
                  </div>
                  
                  {/* KPI Cards in Analytics Panel */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <KPICard
                      title="Total"
                      value={filteredCandidates.length}
                      subtitle="Candidates"
                      icon={Users}
                      variant="default"
                    />
                    <KPICard
                      title="Eligible"
                      value={stats.eligible}
                      subtitle="Matched"
                      icon={CheckCircle}
                      variant="success"
                    />
                    <KPICard
                      title="Top Stars"
                      value={stats.topPerformers}
                      subtitle="Top 10%"
                      icon={Star}
                      variant="accent"
                      trend={{ value: 12, isPositive: true }}
                    />
                    <KPICard
                      title="Avg Score"
                      value={stats.avgScore}
                      subtitle="Overall"
                      icon={TrendingUp}
                      variant="primary"
                    />
                  </div>
                  
                  <ScoreDistributionChart candidates={filteredCandidates} aiQuery={aiSearchQuery} />
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
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
