import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { mockInterviews, Interview } from "@/data/mockInterviews";
import { InterviewCard } from "@/components/InterviewCard";
import { InterviewSwipeQRSection } from "@/components/InterviewSwipeQRSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, Filter, CheckCircle2, Clock, AlertCircle, XCircle, RefreshCw, X, TrendingUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ManageInterviews = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [recommendationFilter, setRecommendationFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [minScore, setMinScore] = useState<number>(0);
  const [swipeDecisions, setSwipeDecisions] = useState<Record<string, 'good-fit' | 'nope' | 'maybe'>>({});

  // Load swipe decisions from localStorage
  const loadSwipeDecisions = () => {
    const stored = localStorage.getItem('swipeDecisions_all');
    if (stored) {
      setSwipeDecisions(JSON.parse(stored));
    }
  };

  useEffect(() => {
    loadSwipeDecisions();
  }, []);

  const filteredInterviews = mockInterviews.filter((interview) => {
    const matchesSearch =
      interview.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interview.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interview.interviewer.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || interview.status === statusFilter;

    const matchesRecommendation =
      recommendationFilter === "all" || interview.recommendation === recommendationFilter;

    const matchesRole =
      roleFilter === "all" || interview.role === roleFilter;

    // Calculate overall score for completed interviews
    const overallScore = interview.status === "completed"
      ? Math.round(
          Object.values(interview.insights).reduce((sum, val) => sum + val, 0) / 
          Object.values(interview.insights).length
        )
      : 0;
    
    const matchesScore = overallScore >= minScore;

    return matchesSearch && matchesStatus && matchesRecommendation && matchesRole && matchesScore;
  });

  const uniqueRoles = Array.from(new Set(mockInterviews.map((i) => i.role)));

  const getStatusCount = (status: string) => {
    if (status === "all") return mockInterviews.length;
    return mockInterviews.filter((i) => i.status === status).length;
  };

  const getRecommendationCount = (rec: string) => {
    if (rec === "all") return mockInterviews.filter((i) => i.status === "completed").length;
    return mockInterviews.filter((i) => i.recommendation === rec).length;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="hover:bg-muted"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Manage Interviews</h1>
              <p className="text-muted-foreground mt-1">
                Review and analyze candidate interviews
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2">
            {filteredInterviews.length} Interviews
          </Badge>
        </div>

        {/* Filters Section */}
        <div className="space-y-4">
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by candidate, role, or interviewer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap gap-2 items-center">
            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Clock className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status ({getStatusCount("all")})</SelectItem>
                <SelectItem value="completed">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    Completed ({getStatusCount("completed")})
                  </div>
                </SelectItem>
                <SelectItem value="scheduled">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-accent" />
                    Scheduled ({getStatusCount("scheduled")})
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Recommendation Filter */}
            <Select value={recommendationFilter} onValueChange={setRecommendationFilter}>
              <SelectTrigger className="w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Recommendation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Recommendations ({getRecommendationCount("all")})</SelectItem>
                <SelectItem value="strong_hire">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    Strong Hire ({getRecommendationCount("strong_hire")})
                  </div>
                </SelectItem>
                <SelectItem value="hire">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Hire ({getRecommendationCount("hire")})
                  </div>
                </SelectItem>
                <SelectItem value="maybe">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-accent" />
                    Maybe ({getRecommendationCount("maybe")})
                  </div>
                </SelectItem>
                <SelectItem value="no_hire">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-destructive" />
                    No Hire ({getRecommendationCount("no_hire")})
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Role Filter */}
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {uniqueRoles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Score Filter */}
            <Select value={minScore.toString()} onValueChange={(v) => setMinScore(Number(v))}>
              <SelectTrigger className="w-[180px]">
                <TrendingUp className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Min Score" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Any Score</SelectItem>
                <SelectItem value="90">90+ (Excellent)</SelectItem>
                <SelectItem value="80">80+ (Very Good)</SelectItem>
                <SelectItem value="70">70+ (Good)</SelectItem>
                <SelectItem value="60">60+ (Average)</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            {(statusFilter !== "all" || recommendationFilter !== "all" || roleFilter !== "all" || searchQuery || minScore > 0) && (
              <Button
                variant="ghost"
                onClick={() => {
                  setStatusFilter("all");
                  setRecommendationFilter("all");
                  setRoleFilter("all");
                  setSearchQuery("");
                  setMinScore(0);
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
              onClick={loadSwipeDecisions}
              title="Refresh review statuses from mobile"
              className="ml-auto"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          {/* Active Filters Summary */}
          {(statusFilter !== "all" || recommendationFilter !== "all" || roleFilter !== "all" || minScore > 0) && (
            <div className="flex items-center gap-2 text-xs flex-wrap">
              <span className="font-medium text-muted-foreground">Active filters:</span>
              {statusFilter !== "all" && (
                <Badge variant="secondary" className="text-xs gap-1.5 cursor-pointer hover:bg-secondary/80 transition-colors">
                  Status: {statusFilter}
                  <X 
                    className="h-3 w-3 hover:text-destructive transition-colors" 
                    onClick={() => setStatusFilter("all")}
                  />
                </Badge>
              )}
              {recommendationFilter !== "all" && (
                <Badge variant="secondary" className="text-xs gap-1.5 cursor-pointer hover:bg-secondary/80 transition-colors">
                  Rec: {recommendationFilter.replace('_', ' ')}
                  <X 
                    className="h-3 w-3 hover:text-destructive transition-colors" 
                    onClick={() => setRecommendationFilter("all")}
                  />
                </Badge>
              )}
              {roleFilter !== "all" && (
                <Badge variant="secondary" className="text-xs gap-1.5 cursor-pointer hover:bg-secondary/80 transition-colors">
                  Role: {roleFilter}
                  <X 
                    className="h-3 w-3 hover:text-destructive transition-colors" 
                    onClick={() => setRoleFilter("all")}
                  />
                </Badge>
              )}
              {minScore > 0 && (
                <Badge variant="secondary" className="text-xs gap-1.5 cursor-pointer hover:bg-secondary/80 transition-colors">
                  Score ≥ {minScore}
                  <X 
                    className="h-3 w-3 hover:text-destructive transition-colors" 
                    onClick={() => setMinScore(0)}
                  />
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Swipe QR Section - Below Filters with Dynamic Refresh */}
        <InterviewSwipeQRSection 
          listId="all"
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          recommendationFilter={recommendationFilter}
          roleFilter={roleFilter}
        />

        {/* Interviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInterviews.map((interview) => (
            <InterviewCard
              key={interview.id}
              interview={interview}
              swipeStatus={swipeDecisions[interview.id] || null}
              onClick={() => console.log("View interview:", interview.id)}
              onAddToList={(interviewId, listType) => {
                console.log("Add to list:", interviewId, listType);
                // TODO: Implement list functionality
              }}
              onSwipeStatusChange={(interviewId, status) => {
                const newDecisions = { ...swipeDecisions, [interviewId]: status };
                setSwipeDecisions(newDecisions);
                localStorage.setItem('swipeDecisions_all', JSON.stringify(newDecisions));
              }}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredInterviews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No interviews match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageInterviews;
