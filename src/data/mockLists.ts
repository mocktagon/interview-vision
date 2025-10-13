import { CandidateList } from "@/types/list";
import { mockCandidates } from "./mockCandidates";

export const mockLists: CandidateList[] = [
  {
    id: "1",
    name: "Frontend Engineers",
    description: "Strong candidates for React/TypeScript positions",
    createdDate: "2024-01-15",
    lastUpdated: "2024-03-10",
    candidates: mockCandidates.slice(0, 3),
    color: "hsl(var(--primary))",
    aiInsights: {
      summary: "High skill alignment with 85% technical proficiency match",
      topSkill: "React & TypeScript",
      diversityScore: 82,
      hiringVelocity: "+15% faster than average",
      recommendation: "Strong team fit, prioritize for immediate interviews"
    }
  },
  {
    id: "2",
    name: "Leadership Pool",
    description: "High-potential candidates for senior roles",
    createdDate: "2024-02-01",
    lastUpdated: "2024-03-12",
    candidates: mockCandidates.slice(3, 6),
    color: "hsl(var(--accent))",
    aiInsights: {
      summary: "Exceptional leadership potential with proven track record",
      topSkill: "Strategic Thinking",
      diversityScore: 90,
      hiringVelocity: "+8% above target",
      recommendation: "Consider for C-level pipeline development"
    }
  },
  {
    id: "3",
    name: "Q2 Shortlist",
    description: "Priority candidates for Q2 hiring",
    createdDate: "2024-03-01",
    lastUpdated: "2024-03-13",
    candidates: mockCandidates.slice(6, 10),
    color: "hsl(var(--success))",
    aiInsights: {
      summary: "Diverse skill set with strong cultural alignment",
      topSkill: "Full-Stack Development",
      diversityScore: 88,
      hiringVelocity: "On track for Q2 goals",
      recommendation: "Schedule final rounds within 2 weeks"
    }
  }
];
