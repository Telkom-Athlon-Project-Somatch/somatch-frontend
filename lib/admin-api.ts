// API Client for Admin Scholarship Management
import { Scholarship, ScholarshipListResponse, AdminStats, ScholarshipUpdate } from "@/types/scholarship";

const BASE_URL = process.env.NEXT_PUBLIC_AI_API_URL || "http://localhost:8000";
const ADMIN_BASE = `${BASE_URL}/api/admin`;

export async function fetchScholarships(params: {
  search?: string;
  status?: string;
  sort_by?: string;
  sort_order?: string;
  page?: number;
  page_size?: number;
}): Promise<ScholarshipListResponse> {
  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (params.status && params.status !== "all") query.set("status", params.status);
  if (params.sort_by) query.set("sort_by", params.sort_by);
  if (params.sort_order) query.set("sort_order", params.sort_order);
  if (params.page) query.set("page", String(params.page));
  if (params.page_size) query.set("page_size", String(params.page_size));

  const res = await fetch(`${ADMIN_BASE}/scholarships?${query.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch scholarships");
  return res.json();
}

export async function fetchStats(): Promise<AdminStats> {
  const res = await fetch(`${ADMIN_BASE}/scholarships/stats`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}

export async function fetchScholarshipById(id: string): Promise<Scholarship> {
  const res = await fetch(`${ADMIN_BASE}/scholarships/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Scholarship not found");
  return res.json();
}

export async function updateScholarshipStatus(id: string, status: string): Promise<Scholarship> {
  const res = await fetch(`${ADMIN_BASE}/scholarships/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update status");
  return res.json();
}

export async function updateScholarship(id: string, updates: ScholarshipUpdate): Promise<Scholarship> {
  const res = await fetch(`${ADMIN_BASE}/scholarships/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update scholarship");
  return res.json();
}

export async function bulkUpdateStatus(ids: string[], status: string): Promise<{ updated: number; message: string }> {
  const res = await fetch(`${ADMIN_BASE}/scholarships/bulk-status`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids, status }),
  });
  if (!res.ok) throw new Error("Failed to bulk update");
  return res.json();
}

export async function deleteScholarship(id: string): Promise<void> {
  const res = await fetch(`${ADMIN_BASE}/scholarships/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete scholarship");
}
