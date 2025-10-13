export interface Candidate {
  id: string;
  name: string;
  role: string;
  email: string;
  phone?: string;
  profilePicture?: string;
  stage: 'screening' | 'prelims' | 'fitment' | 'final' | 'selected' | 'rejected';
  scores: {
    screening?: number;
    prelims?: number;
    fitment?: number;
    overall?: number;
  };
  skills: {
    [key: string]: number; // skill name to proficiency (0-100)
  };
  experience: number; // years
  location: string;
  availability: string;
  topPerformer?: boolean;
  eligibleForRoles?: string[];
  appliedDate: string;
  lastUpdated: string;
  notes?: string;
  socials?: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  smartInsights?: {
    personality: string[];
    strengths: string[];
    potentialChallenges: string[];
    culturalFit: string;
  };
  interviewInsights?: {
    communicationStyle: string;
    problemSolvingApproach: string;
    leadershipPotential: string;
    keyQuotes: string[];
  };
  interviewReports?: {
    round: string;
    date: string;
    interviewer: string;
    summary: string;
    recommendation: 'strong-yes' | 'yes' | 'maybe' | 'no';
  }[];
}

export interface CandidateListStats {
  total: number;
  byStage: {
    [key: string]: number;
  };
  topPerformers: number;
  eligible: number;
  averageScore: number;
  skillsDistribution: {
    [key: string]: number;
  };
}
