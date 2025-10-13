import { useState, useMemo } from "react";
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
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
                <h1 className="text-2xl font-bold text-foreground">Candidate Intelligence</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  AI-powered insights for smarter hiring decisions
                </p>
              </div>
            </div>
            <Button size="lg">
              Export Report
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* AI Search Bar */}
        <div className="mb-6 relative">
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-lg blur-xl" />
            <div className="relative bg-card border-2 border-primary/30 rounded-lg p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                </div>
                <div className="flex-1">
                  <Input
                    placeholder="Ask AI to analyze candidates... (e.g., 'Show top performers with leadership skills' or 'Highlight candidates scoring above 85')"
                    value={aiSearchQuery}
                    onChange={(e) => setAiSearchQuery(e.target.value)}
                    className="border-0 bg-transparent text-base focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/60"
                  />
                </div>
                <Badge className="bg-primary/10 text-primary border-primary/30 gap-1.5">
                  <Zap className="h-3 w-3" />
                  AI Powered
                </Badge>
              </div>
              {aiSearchQuery && (
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <Sparkles className="h-3 w-3 text-primary" />
                    AI analyzing: "{aiSearchQuery}"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-6 items-start relative">
          {/* Left Side - Main Content (Scrollable Candidates) */}
          <div className={`transition-all duration-300 ${isAnalyticsPanelOpen ? 'w-[calc(70%-1.5rem)]' : 'w-[calc(100%-3rem)]'} space-y-6`}>
            {/* KPI Cards - Horizontal Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <KPICard
                title="Total Candidates"
                value={filteredCandidates.length}
                subtitle="Active in pipeline"
                icon={Users}
                variant="default"
              />
              <KPICard
                title="Eligible for Fitment"
                value={stats.eligible}
                subtitle="Matched to roles"
                icon={CheckCircle}
                variant="success"
              />
              <KPICard
                title="Top Performers"
                value={stats.topPerformers}
                subtitle="Top 10% of candidates"
                icon={Star}
                variant="accent"
                trend={{ value: 12, isPositive: true }}
              />
              <KPICard
                title="Average Score"
                value={stats.avgScore}
                subtitle="Overall assessment"
                icon={TrendingUp}
                variant="primary"
              />
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
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

            {/* Candidates Grid - Scrollable */}
            <div>
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <LayoutGrid className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Candidate Profiles</h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  Comprehensive candidate information with multi-stage assessment scores
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
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

          {/* Right Side - Analytics Panel (Fixed & Collapsible) */}
          <div className={`transition-all duration-300 ${isAnalyticsPanelOpen ? 'w-[30%]' : 'w-12'}`}>
            <div className="fixed top-24 right-6" style={{ width: isAnalyticsPanelOpen ? 'calc(30% - 3rem)' : '3rem' }}>
              <Collapsible open={isAnalyticsPanelOpen} onOpenChange={setIsAnalyticsPanelOpen}>
                <div className="relative">
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute -left-6 top-4 z-10 h-8 w-8 rounded-full border-2 bg-background shadow-md hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {isAnalyticsPanelOpen ? (
                        <ChevronRight className="h-4 w-4" />
                      ) : (
                        <ChevronLeft className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="animate-accordion-down">
                    <div className="max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 space-y-4">
                      <ScoreDistributionChart candidates={filteredCandidates} aiQuery={aiSearchQuery} />
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            </div>
          </div>
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
