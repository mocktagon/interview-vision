import { Candidate } from "@/types/candidate";

export const mockCandidates: Candidate[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    role: "Senior Accountant",
    email: "sarah.j@email.com",
    phone: "+1 234-567-8901",
    stage: "selected",
    scores: {
      screening: 92,
      prelims: 88,
      fitment: 95,
      overall: 92
    },
    skills: {
      "Financial Reporting": 95,
      "Tax Compliance": 88,
      "Audit Management": 90,
      "GAAP Standards": 92,
      "Excel/Analytics": 85
    },
    experience: 8,
    location: "New York, NY",
    availability: "2 weeks",
    topPerformer: true,
    eligibleForRoles: ["Senior Accountant", "Accounting Manager"],
    appliedDate: "2024-09-15",
    lastUpdated: "2024-10-10",
    notes: "Exceptional candidate with strong technical skills and leadership potential"
  },
  {
    id: "2",
    name: "Michael Chen",
    role: "Financial Analyst",
    email: "m.chen@email.com",
    stage: "fitment",
    scores: {
      screening: 85,
      prelims: 90,
      fitment: 87,
      overall: 87
    },
    skills: {
      "Financial Modeling": 92,
      "Data Analysis": 90,
      "Excel/Analytics": 95,
      "Financial Reporting": 82,
      "Forecasting": 88
    },
    experience: 5,
    location: "San Francisco, CA",
    availability: "Immediate",
    topPerformer: true,
    eligibleForRoles: ["Financial Analyst", "Senior Analyst"],
    appliedDate: "2024-09-20",
    lastUpdated: "2024-10-08"
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    role: "Tax Specialist",
    email: "e.rodriguez@email.com",
    stage: "final",
    scores: {
      screening: 90,
      prelims: 85,
      fitment: 88,
      overall: 88
    },
    skills: {
      "Tax Compliance": 95,
      "Tax Planning": 90,
      "IRS Regulations": 92,
      "Financial Reporting": 80,
      "Client Relations": 85
    },
    experience: 6,
    location: "Chicago, IL",
    availability: "1 month",
    topPerformer: true,
    eligibleForRoles: ["Tax Specialist", "Senior Tax Accountant"],
    appliedDate: "2024-09-18",
    lastUpdated: "2024-10-09"
  },
  {
    id: "4",
    name: "David Park",
    role: "Junior Accountant",
    email: "d.park@email.com",
    stage: "prelims",
    scores: {
      screening: 78,
      prelims: 75,
      overall: 76
    },
    skills: {
      "Financial Reporting": 70,
      "Accounts Payable": 80,
      "Accounts Receivable": 78,
      "Excel/Analytics": 72,
      "Bookkeeping": 82
    },
    experience: 2,
    location: "Austin, TX",
    availability: "2 weeks",
    eligibleForRoles: ["Junior Accountant"],
    appliedDate: "2024-09-25",
    lastUpdated: "2024-10-05"
  },
  {
    id: "5",
    name: "Jennifer Kim",
    role: "Accounting Manager",
    email: "j.kim@email.com",
    stage: "final",
    scores: {
      screening: 95,
      prelims: 92,
      fitment: 93,
      overall: 93
    },
    skills: {
      "Team Leadership": 95,
      "Financial Reporting": 90,
      "Process Improvement": 88,
      "GAAP Standards": 92,
      "Strategic Planning": 90
    },
    experience: 12,
    location: "Boston, MA",
    availability: "1 month",
    topPerformer: true,
    eligibleForRoles: ["Accounting Manager", "Controller"],
    appliedDate: "2024-09-12",
    lastUpdated: "2024-10-11"
  },
  {
    id: "6",
    name: "Robert Taylor",
    role: "Financial Analyst",
    email: "r.taylor@email.com",
    stage: "screening",
    scores: {
      screening: 72,
      overall: 72
    },
    skills: {
      "Financial Modeling": 75,
      "Data Analysis": 70,
      "Excel/Analytics": 78,
      "Financial Reporting": 68,
      "Forecasting": 72
    },
    experience: 3,
    location: "Seattle, WA",
    availability: "Immediate",
    eligibleForRoles: ["Financial Analyst"],
    appliedDate: "2024-10-01",
    lastUpdated: "2024-10-03"
  },
  {
    id: "7",
    name: "Amanda Liu",
    role: "Senior Accountant",
    email: "a.liu@email.com",
    stage: "fitment",
    scores: {
      screening: 88,
      prelims: 86,
      fitment: 89,
      overall: 88
    },
    skills: {
      "Financial Reporting": 90,
      "Tax Compliance": 85,
      "Audit Management": 88,
      "GAAP Standards": 87,
      "Excel/Analytics": 82
    },
    experience: 7,
    location: "Denver, CO",
    availability: "3 weeks",
    topPerformer: true,
    eligibleForRoles: ["Senior Accountant", "Accounting Supervisor"],
    appliedDate: "2024-09-22",
    lastUpdated: "2024-10-07"
  },
  {
    id: "8",
    name: "James Wilson",
    role: "Audit Associate",
    email: "j.wilson@email.com",
    stage: "prelims",
    scores: {
      screening: 80,
      prelims: 82,
      overall: 81
    },
    skills: {
      "Audit Management": 85,
      "Risk Assessment": 80,
      "Financial Analysis": 78,
      "Compliance": 82,
      "Documentation": 80
    },
    experience: 4,
    location: "Atlanta, GA",
    availability: "2 weeks",
    eligibleForRoles: ["Audit Associate", "Senior Auditor"],
    appliedDate: "2024-09-28",
    lastUpdated: "2024-10-06"
  }
];
