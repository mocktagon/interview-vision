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
    color: "hsl(var(--primary))"
  },
  {
    id: "2",
    name: "Leadership Pool",
    description: "High-potential candidates for senior roles",
    createdDate: "2024-02-01",
    lastUpdated: "2024-03-12",
    candidates: mockCandidates.slice(3, 6),
    color: "hsl(var(--accent))"
  },
  {
    id: "3",
    name: "Q2 Shortlist",
    description: "Priority candidates for Q2 hiring",
    createdDate: "2024-03-01",
    lastUpdated: "2024-03-13",
    candidates: mockCandidates.slice(6, 10),
    color: "hsl(var(--success))"
  }
];
