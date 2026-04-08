// Types for Scholarship Management Admin Dashboard

export type ScholarshipStatus = "unverified" | "pending" | "verified" | "suspicious";

export type CrawlDataStatus = "valid" | "invalid" | "incomplete";

export interface Scholarship {
  id: string;
  title: string;
  provider: string;
  deadline: string;
  description: string;
  source_url: string;
  requirements: string[];
  amount?: string;
  education_level?: string;
  location?: string;
  status: ScholarshipStatus | "approved" | "rejected";
  data_status?: CrawlDataStatus;
  eligible_universities?: string[];
  is_university_specific?: boolean;
  trust_score: number;
  ai_summary?: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ScholarshipListResponse {
  scholarships: Scholarship[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  total: number;
  verified: number;
  unverified: number;
  pending?: number;
  suspicious?: number;
  avg_trust_score?: number;
}

export interface ScholarshipUpdate {
  title?: string;
  provider?: string;
  deadline?: string;
  description?: string;
  source_url?: string;
  requirements?: string[];
  amount?: string;
  education_level?: string;
  location?: string;
  status?: ScholarshipStatus | "approved" | "rejected";
  admin_notes?: string;
}
