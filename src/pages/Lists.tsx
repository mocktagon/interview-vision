import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { mockLists } from "@/data/mockLists";
import { CandidateList } from "@/types/list";
import { ListCard } from "@/components/ListCard";
import { EmptyListCard } from "@/components/EmptyListCard";
import { ScoreDistributionChart } from "@/components/ScoreDistributionChart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FolderOpen, Users, TrendingUp, Zap, Sparkles, Brain, ChevronLeft, ChevronRight, Calendar, ArrowRight, Search, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Lists = () => {
  const navigate = useNavigate();
  const [lists, setLists] = useState<CandidateList[]>(mockLists);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAnalyticsPanelOpen, setIsAnalyticsPanelOpen] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const [swipeDecisions, setSwipeDecisions] = useState<Record<string, 'good-fit' | 'nope' | 'maybe'>>({});

  // Load swipe decisions from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('listSwipeDecisions');
    if (stored) {
      setSwipeDecisions(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (mainContentRef.current) {
        setIsScrolled(mainContentRef.current.scrollTop > 20);
      }
    };

    const mainContent = mainContentRef.current;
    if (mainContent) {
      mainContent.addEventListener('scroll', handleScroll);
      return () => mainContent.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const filteredLists = lists.filter(list =>
    list.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (list.description?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalCandidates = lists.reduce((sum, list) => sum + list.candidates.length, 0);
  const totalLists = lists.length;
  const avgListSize = totalLists > 0 ? Math.round(totalCandidates / totalLists) : 0;
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

  const handleDeleteList = (listId: string) => {
    setLists(prevLists => prevLists.filter(list => list.id !== listId));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main 
        ref={mainContentRef}
        className="flex-1 overflow-y-auto"
        style={{ 
          marginRight: isAnalyticsPanelOpen ? 'calc(30% + 1rem)' : '0',
          transition: 'margin-right 0.3s ease'
        }}
      >
        <div className="container mx-auto px-6 pt-8 pb-8 space-y-6">
          {/* Greeting - Vanishes on Scroll */}
          <div 
            className="transition-all duration-300"
            style={{
              opacity: isScrolled ? 0 : 1,
              height: isScrolled ? '0px' : 'auto',
              marginBottom: isScrolled ? '0px' : '1rem',
              overflow: 'hidden'
            }}
          >
            <h1 className="text-2xl font-bold text-foreground">Hi John</h1>
          </div>

          {/* Manage Interviews Button - Sticky on Scroll */}
          <div 
            className={`transition-all duration-300 ${isScrolled ? 'sticky top-0 z-20 bg-background/95 backdrop-blur-sm py-4 -mx-6 px-6' : ''}`}
          >
            <Card 
              className="relative overflow-hidden border border-accent/20 bg-gradient-to-r from-accent/5 to-transparent hover:border-accent/30 transition-all duration-300 cursor-pointer"
              onClick={() => navigate("/interviews")}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-3 rounded-xl bg-accent/10 text-accent">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">Manage Interviews</h3>
                        <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                          New
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Review interview insights, assessments, and candidate evaluations
                      </p>
                    </div>
                  </div>
                  <Button size="lg" className="gap-2 bg-accent hover:bg-accent/90">
                    View Interviews
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
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
                  onDelete={handleDeleteList}
                  swipeStatus={swipeDecisions[list.id] || null}
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
        </div>
      </main>

      {/* Analytics Panel */}
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
                    <FolderOpen className="h-3.5 w-3.5 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground font-medium">Lists</p>
                  </div>
                  <p className="text-xl font-bold text-foreground">{totalLists}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-primary/10 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Users className="h-3.5 w-3.5 text-primary" />
                    <p className="text-xs text-primary font-medium">Total</p>
                  </div>
                  <p className="text-xl font-bold text-primary">{totalCandidates}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-accent/10 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Zap className="h-3.5 w-3.5 text-accent" />
                    <p className="text-xs text-accent font-medium">Diversity</p>
                  </div>
                  <p className="text-xl font-bold text-accent">{avgDiversity}%</p>
                </div>
                <div className="p-2.5 rounded-lg bg-success/10 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <TrendingUp className="h-3.5 w-3.5 text-success" />
                    <p className="text-xs text-success font-medium">Avg Size</p>
                  </div>
                  <p className="text-xl font-bold text-success">{avgListSize}</p>
                </div>
              </div>
              
              <div className="flex-1 min-h-0 overflow-hidden">
                <ScoreDistributionChart 
                  candidates={lists.flatMap(list => list.candidates)} 
                  aiQuery="All Lists Overview"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Lists;
