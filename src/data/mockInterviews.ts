export interface Interview {
  id: string;
  candidateName: string;
  role: string;
  date: string;
  interviewer: string;
  round: string;
  avatar?: string;
  status: "pending" | "completed" | "scheduled";
  insights: {
    communication: number;
    technicalSkills: number;
    problemSolving: number;
    culturalFit: number;
    leadership: number;
    adaptability: number;
  };
  tags: string[];
  summary: string;
  recommendation: "strong_hire" | "hire" | "maybe" | "no_hire";
}

export const mockInterviews: Interview[] = [
  {
    id: "1",
    candidateName: "Sarah Chen",
    role: "Senior Frontend Engineer",
    date: "2024-03-15",
    interviewer: "Michael Roberts",
    round: "Technical Round 2",
    status: "completed",
    insights: {
      communication: 92,
      technicalSkills: 88,
      problemSolving: 85,
      culturalFit: 90,
      leadership: 78,
      adaptability: 87
    },
    tags: ["React Expert", "Strong Communicator", "Team Player", "Architectural Thinking"],
    summary: "Excellent technical skills with strong system design knowledge. Great cultural fit and communication.",
    recommendation: "strong_hire"
  },
  {
    id: "2",
    candidateName: "Marcus Johnson",
    role: "Product Manager",
    date: "2024-03-14",
    interviewer: "Emily Zhang",
    round: "Leadership Round",
    status: "completed",
    insights: {
      communication: 95,
      technicalSkills: 75,
      problemSolving: 88,
      culturalFit: 92,
      leadership: 94,
      adaptability: 89
    },
    tags: ["Strategic Thinker", "User-Centric", "Data-Driven", "Strong Leadership"],
    summary: "Outstanding leadership qualities with proven track record. Excellent stakeholder management.",
    recommendation: "strong_hire"
  },
  {
    id: "3",
    candidateName: "Priya Sharma",
    role: "UX Designer",
    date: "2024-03-13",
    interviewer: "David Kim",
    round: "Portfolio Review",
    status: "completed",
    insights: {
      communication: 87,
      technicalSkills: 82,
      problemSolving: 85,
      culturalFit: 88,
      leadership: 72,
      adaptability: 90
    },
    tags: ["Creative", "User Research", "Figma Expert", "Design Systems"],
    summary: "Strong portfolio with excellent user research skills. Good understanding of design systems.",
    recommendation: "hire"
  },
  {
    id: "4",
    candidateName: "Alex Rivera",
    role: "DevOps Engineer",
    date: "2024-03-16",
    interviewer: "Sarah Williams",
    round: "Technical Deep Dive",
    status: "scheduled",
    insights: {
      communication: 0,
      technicalSkills: 0,
      problemSolving: 0,
      culturalFit: 0,
      leadership: 0,
      adaptability: 0
    },
    tags: [],
    summary: "",
    recommendation: "maybe"
  },
  {
    id: "5",
    candidateName: "Jessica Wu",
    role: "Data Scientist",
    date: "2024-03-12",
    interviewer: "Robert Chen",
    round: "Technical Assessment",
    status: "completed",
    insights: {
      communication: 83,
      technicalSkills: 91,
      problemSolving: 89,
      culturalFit: 85,
      leadership: 80,
      adaptability: 88
    },
    tags: ["ML Expert", "Python", "Statistical Analysis", "Research-Oriented"],
    summary: "Exceptional technical skills in ML and data analysis. Strong research background with practical applications.",
    recommendation: "hire"
  },
  {
    id: "6",
    candidateName: "Tom Anderson",
    role: "Backend Engineer",
    date: "2024-03-11",
    interviewer: "Lisa Park",
    round: "System Design",
    status: "completed",
    insights: {
      communication: 78,
      technicalSkills: 86,
      problemSolving: 84,
      culturalFit: 82,
      leadership: 75,
      adaptability: 81
    },
    tags: ["Scalability Focus", "Microservices", "Database Expert", "Performance"],
    summary: "Solid backend skills with good understanding of distributed systems. Could improve communication.",
    recommendation: "hire"
  }
];
