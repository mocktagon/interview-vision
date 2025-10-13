import { Candidate } from "./candidate";

export interface CandidateList {
  id: string;
  name: string;
  description?: string;
  createdDate: string;
  lastUpdated: string;
  candidates: Candidate[];
  color?: string;
}
