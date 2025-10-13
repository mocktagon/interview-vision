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
  starred?: boolean;
  eligibleForRoles?: string[];
  appliedDate: string;
  lastUpdated: string;
  notes?: string;
  socials?: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
    linkedinInsights?: {
      endorsements: string[];
      recommendations: {
        name: string;
        title: string;
        relationship: string;
        quote: string;
      }[];
      activityScore: number;
      followerCount?: number;
      influenceLevel?: string;
    };
    githubInsights?: {
      contributions: number;
      topLanguages: string[];
      starredRepos: number;
      influence: string;
    };
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
  psychAssessment?: {
    animal: 'lion' | 'owl' | 'dolphin' | 'fox';
    color: 'red' | 'blue' | 'green' | 'yellow';
    environment: 'mountain' | 'beach' | 'forest' | 'city';
    symbol: 'compass' | 'bridge' | 'tree' | 'puzzle';
  };
  atsScore?: {
    overall: number;
    resumeMatch: number;
    skillsMatch: number;
    experienceMatch: number;
    educationMatch: number;
  };
  aiInterviewScore?: {
    overall: number;
    technicalSkills: number;
    problemSolving: number;
    communication: number;
    culturalFit: number;
    leadership: number;
  };
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
