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
        {/* AI Generate List - Prompt Section */}
        <Card className="relative overflow-hidden border border-primary/20 bg-gradient-to-r from-primary/5 to-transparent hover:border-primary/30 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">Generate AI List</h3>
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                      <Brain className="h-3 w-3 mr-1" />
                      AI Powered
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Create curated talent pools based on interview analysis and skills
                  </p>
                </div>
              </div>
              <Button size="lg" className="gap-2">
                <Sparkles className="h-4 w-4" />
                Generate List
              </Button>
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
