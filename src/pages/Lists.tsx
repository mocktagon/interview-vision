import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockLists } from "@/data/mockLists";
import { CandidateList } from "@/types/list";
import { ListCard } from "@/components/ListCard";
import { EmptyListCard } from "@/components/EmptyListCard";
import { KPICard } from "@/components/KPICard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FolderOpen, Users, Star, CheckCircle, Search, Plus, TrendingUp, Zap, Sparkles, ArrowRight, Brain, MessageSquare, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Lists = () => {
  const navigate = useNavigate();
  const [lists] = useState<CandidateList[]>(mockLists);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLists = lists.filter(list =>
    list.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (list.description?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalCandidates = lists.reduce((sum, list) => sum + list.candidates.length, 0);
  const totalLists = lists.length;
  const avgListSize = totalLists > 0 ? Math.round(totalCandidates / totalLists) : 0;
  const allStarred = lists.reduce((sum, list) => sum + list.candidates.filter(c => c.starred).length, 0);
  const avgDiversity = totalLists > 0 
    ? Math.round(lists.reduce((sum, list) => sum + (list.aiInsights?.diversityScore || 0), 0) / totalLists) 
    : 0;

  const handleCreateList = () => {
    // TODO: Open create list dialog
    console.log("Create new list");
  };

  const handleViewList = (listId: string) => {
    navigate(`/list/${listId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Talent Lists</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Organize and manage your candidate pools
              </p>
            </div>
            <Button size="lg" onClick={handleCreateList}>
              <Plus className="h-4 w-4 mr-2" />
              New List
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* AI Recommended List - Hero Section */}
        <Card className="relative overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/5 hover:border-primary/40 transition-all duration-300 cursor-pointer group" onClick={() => handleViewList("ai-recommended")}>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <CardHeader className="relative pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-2xl">AI Recommended List</CardTitle>
                    <Badge variant="default" className="bg-primary/20 text-primary border-primary/30">
                      <Brain className="h-3 w-3 mr-1" />
                      AI Generated
                    </Badge>
                  </div>
                  <CardDescription className="text-base">
                    Curated talent pool based on interview performance and cultural fit analysis
                  </CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="text-primary group-hover:translate-x-1 transition-transform">
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="relative space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-card/50 border border-border">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Users className="h-4 w-4" />
                  <p className="text-xs font-medium">Candidates</p>
                </div>
                <p className="text-2xl font-bold text-foreground">12</p>
              </div>
              <div className="p-4 rounded-lg bg-card/50 border border-border">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Award className="h-4 w-4" />
                  <p className="text-xs font-medium">Avg Interview Score</p>
                </div>
                <p className="text-2xl font-bold text-primary">94%</p>
              </div>
              <div className="p-4 rounded-lg bg-card/50 border border-border">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <MessageSquare className="h-4 w-4" />
                  <p className="text-xs font-medium">Interviews Analyzed</p>
                </div>
                <p className="text-2xl font-bold text-foreground">48</p>
              </div>
              <div className="p-4 rounded-lg bg-card/50 border border-border">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Zap className="h-4 w-4" />
                  <p className="text-xs font-medium">Cultural Fit</p>
                </div>
                <p className="text-2xl font-bold text-accent">89%</p>
              </div>
            </div>

            {/* AI Insights */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2 text-primary">
                  <Brain className="h-4 w-4" />
                  Interview Insights
                </h4>
                <p className="text-sm text-muted-foreground">
                  Candidates demonstrate exceptional problem-solving skills with 92% success rate in technical assessments. Strong communication patterns detected across all interview rounds.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2 text-accent">
                  <MessageSquare className="h-4 w-4" />
                  Key Findings
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 85% show leadership potential in behavioral interviews</li>
                  <li>• Average 7+ years experience in relevant domains</li>
                  <li>• High alignment with company values and culture</li>
                </ul>
              </div>
            </div>

            {/* Top Skills from Interviews */}
            <div>
              <h4 className="font-semibold text-sm mb-3 text-foreground">Top Skills from Interview Analysis</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="px-3 py-1">System Design</Badge>
                <Badge variant="secondary" className="px-3 py-1">Problem Solving</Badge>
                <Badge variant="secondary" className="px-3 py-1">Leadership</Badge>
                <Badge variant="secondary" className="px-3 py-1">Communication</Badge>
                <Badge variant="secondary" className="px-3 py-1">Team Collaboration</Badge>
                <Badge variant="secondary" className="px-3 py-1">Technical Architecture</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <KPICard
            title="Total Lists"
            value={totalLists}
            subtitle="Active talent pools"
            icon={FolderOpen}
            variant="default"
          />
          <KPICard
            title="Total Candidates"
            value={totalCandidates}
            subtitle="Across all lists"
            icon={Users}
            variant="primary"
          />
          <KPICard
            title="Avg Diversity"
            value={`${avgDiversity}%`}
            subtitle="Inclusion score"
            icon={Zap}
            variant="accent"
            trend={{ value: 8, isPositive: true }}
          />
          <KPICard
            title="Top Performers"
            value={allStarred}
            subtitle="Starred talents"
            icon={Star}
            variant="success"
          />
          <KPICard
            title="Avg List Size"
            value={avgListSize}
            subtitle="Candidates per list"
            icon={TrendingUp}
            variant="default"
          />
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search lists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Lists Grid */}
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Your Lists</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Click on a list to view candidates
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLists.map((list) => (
              <ListCard
                key={list.id}
                list={list}
                onClick={() => handleViewList(list.id)}
              />
            ))}
            <EmptyListCard onClick={handleCreateList} />
          </div>

          {filteredLists.length === 0 && lists.length > 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No lists match your search</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Lists;
