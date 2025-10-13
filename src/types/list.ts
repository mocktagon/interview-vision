import { Candidate } from "./candidate";

export interface CandidateList {
  id: string;
  name: string;
  description?: string;
  createdDate: string;
  lastUpdated: string;
  candidates: Candidate[];
  color?: string;
  aiInsights?: {
    summary: string;
    topSkill: string;
    diversityScore: number;
    hiringVelocity: string;
    recommendation: string;
  };
}
