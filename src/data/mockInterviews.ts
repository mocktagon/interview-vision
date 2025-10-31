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
    [key: string]: number;
  };
  tags: string[];
  summary: string;
  recommendation: "strong_hire" | "hire" | "maybe" | "no_hire";
}

export const mockInterviews: Interview[] = [
  {
    id: "1",
    candidateName: "Sarah Chen",
    role: "Senior Accountant",
    date: "2024-03-15",
    interviewer: "Michael Roberts",
    round: "Technical Round 2",
    status: "completed",
    insights: {
      "Foundational Bookkeeping": 92,
      "Data Accuracy and Attention to Detail": 88,
      "Account Reconciliation": 85,
      "Accounts Payable (AP) Management": 90,
      "Accounts Receivable (AR) Management": 87,
      "Financial Reporting Fundamentals": 91,
      "Understanding of GAAP": 84,
      "Accounting Software Proficiency": 89
    },
    tags: ["GAAP Expert", "Detail-Oriented", "QuickBooks Pro", "Financial Reporting"],
    summary: "Excellent technical accounting skills with strong attention to detail. Great understanding of GAAP principles.",
    recommendation: "strong_hire"
  },
  {
    id: "2",
    candidateName: "Marcus Johnson",
    role: "Financial Controller",
    date: "2024-03-14",
    interviewer: "Emily Zhang",
    round: "Leadership Round",
    status: "completed",
    insights: {
      "Foundational Bookkeeping": 88,
      "Data Accuracy and Attention to Detail": 95,
      "Account Reconciliation": 92,
      "Accounts Payable (AP) Management": 90,
      "Accounts Receivable (AR) Management": 89,
      "Financial Reporting Fundamentals": 94,
      "Understanding of GAAP": 93,
      "Accounting Software Proficiency": 91
    },
    tags: ["Strategic Thinker", "Compliance Expert", "Team Leadership", "Process Improvement"],
    summary: "Outstanding leadership qualities with proven track record in financial management. Excellent regulatory compliance.",
    recommendation: "strong_hire"
  },
  {
    id: "3",
    candidateName: "Priya Sharma",
    role: "Staff Accountant",
    date: "2024-03-13",
    interviewer: "David Kim",
    round: "Technical Assessment",
    status: "completed",
    insights: {
      "Foundational Bookkeeping": 87,
      "Data Accuracy and Attention to Detail": 82,
      "Account Reconciliation": 85,
      "Accounts Payable (AP) Management": 88,
      "Accounts Receivable (AR) Management": 84,
      "Financial Reporting Fundamentals": 80,
      "Understanding of GAAP": 79,
      "Accounting Software Proficiency": 90
    },
    tags: ["Fast Learner", "Tech-Savvy", "Month-End Close", "Excel Expert"],
    summary: "Strong technical skills with excellent software proficiency. Good foundation in accounting principles.",
    recommendation: "hire"
  },
  {
    id: "4",
    candidateName: "Alex Rivera",
    role: "Junior Accountant",
    date: "2024-03-16",
    interviewer: "Sarah Williams",
    round: "Initial Screening",
    status: "scheduled",
    insights: {
      "Foundational Bookkeeping": 0,
      "Data Accuracy and Attention to Detail": 0,
      "Account Reconciliation": 0,
      "Accounts Payable (AP) Management": 0,
      "Accounts Receivable (AR) Management": 0,
      "Financial Reporting Fundamentals": 0,
      "Understanding of GAAP": 0,
      "Accounting Software Proficiency": 0
    },
    tags: [],
    summary: "",
    recommendation: "maybe"
  },
  {
    id: "5",
    candidateName: "Jessica Wu",
    role: "Tax Accountant",
    date: "2024-03-12",
    interviewer: "Robert Chen",
    round: "Technical Deep Dive",
    status: "completed",
    insights: {
      "Foundational Bookkeeping": 86,
      "Data Accuracy and Attention to Detail": 91,
      "Account Reconciliation": 89,
      "Accounts Payable (AP) Management": 85,
      "Accounts Receivable (AR) Management": 83,
      "Financial Reporting Fundamentals": 88,
      "Understanding of GAAP": 92,
      "Accounting Software Proficiency": 87
    },
    tags: ["Tax Expertise", "Research-Oriented", "Compliance Focus", "Analytical"],
    summary: "Exceptional technical skills in tax accounting. Strong research background with practical compliance knowledge.",
    recommendation: "hire"
  },
  {
    id: "6",
    candidateName: "Tom Anderson",
    role: "Accounts Payable Specialist",
    date: "2024-03-11",
    interviewer: "Lisa Park",
    round: "Process Review",
    status: "completed",
    insights: {
      "Foundational Bookkeeping": 80,
      "Data Accuracy and Attention to Detail": 86,
      "Account Reconciliation": 84,
      "Accounts Payable (AP) Management": 94,
      "Accounts Receivable (AR) Management": 78,
      "Financial Reporting Fundamentals": 82,
      "Understanding of GAAP": 81,
      "Accounting Software Proficiency": 88
    },
    tags: ["AP Specialist", "Vendor Relations", "Process Efficiency", "SAP Expert"],
    summary: "Strong AP management skills with excellent vendor relationship management. Focus on process optimization.",
    recommendation: "hire"
  }
];
