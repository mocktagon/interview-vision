import { useState, useMemo } from "react";
import { mockCandidates } from "@/data/mockCandidates";
import { Candidate } from "@/types/candidate";
import { KPICard } from "@/components/KPICard";
import { FunnelChart } from "@/components/FunnelChart";
import { CandidateCard } from "@/components/CandidateCard";
import { CandidateDrawer } from "@/components/CandidateDrawer";
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
  LayoutGrid
} from "lucide-react";

const Index = () => {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("all");

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
    const topPerformers = filteredCandidates.filter(c => c.topPerformer).length;
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
            <div>
              <h1 className="text-2xl font-bold text-foreground">Candidate Intelligence</h1>
              <p className="text-sm text-muted-foreground mt-1">
                AI-powered insights for smarter hiring decisions
              </p>
            </div>
            <Button size="lg">
              Export Report
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

        {/* Funnel Chart */}
        <FunnelChart candidates={filteredCandidates} />

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

        {/* Candidates Grid */}
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
