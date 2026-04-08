// API Client for Admin Scholarship Management
import { Scholarship, ScholarshipListResponse, AdminStats, ScholarshipUpdate } from "@/types/scholarship";

const BASE_URL = process.env.NEXT_PUBLIC_AI_API_URL || "http://localhost:8000";
const ADMIN_BASE = `${BASE_URL}/api/admin`;

function getHeaders(token?: string | null) {
  const finalToken = token || (typeof window !== "undefined" ? localStorage.getItem("somatch_token") : null);
  return {
    "Content-Type": "application/json",
    ...(finalToken ? { Authorization: `Bearer ${finalToken}` } : {}),
  };
}

export async function fetchScholarships(params: {
  search?: string;
  status?: string;
  sort_by?: string;
  sort_order?: string;
  page?: number;
  page_size?: number;
}, token?: string | null): Promise<ScholarshipListResponse> {
  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (params.status && params.status !== "all") query.set("status", params.status);
  if (params.sort_by) query.set("sort_by", params.sort_by);
  if (params.sort_order) query.set("sort_order", params.sort_order);
  if (params.page) query.set("page", String(params.page));
  if (params.page_size) query.set("page_size", String(params.page_size));

  const res = await fetch(`${ADMIN_BASE}/scholarships?${query.toString()}`, {
    cache: "no-store",
    headers: getHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to fetch scholarships");
  return res.json();
}

export async function fetchStats(token?: string | null): Promise<AdminStats> {
  const res = await fetch(`${ADMIN_BASE}/scholarships/stats`, {
    cache: "no-store",
    headers: getHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}

export async function fetchScholarshipById(id: string, token?: string | null): Promise<Scholarship> {
  const res = await fetch(`${ADMIN_BASE}/scholarships/${id}`, {
    cache: "no-store",
    headers: getHeaders(token),
  });
  if (!res.ok) throw new Error("Scholarship not found");
  return res.json();
}

export async function updateScholarshipStatus(id: string, status: string, token?: string | null): Promise<Scholarship> {
  const res = await fetch(`${ADMIN_BASE}/scholarships/${id}/status`, {
    method: "PATCH",
    headers: getHeaders(token),
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update status");
  return res.json();
}

export async function updateScholarship(id: string, updates: ScholarshipUpdate, token?: string | null): Promise<Scholarship> {
  const res = await fetch(`${ADMIN_BASE}/scholarships/${id}`, {
    method: "PUT",
    headers: getHeaders(token),
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update scholarship");
  return res.json();
}

export async function bulkUpdateStatus(ids: string[], status: string, token?: string | null): Promise<{ updated: number; message: string }> {
  const res = await fetch(`${ADMIN_BASE}/scholarships/bulk-status`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify({ ids, status }),
  });
  if (!res.ok) throw new Error("Failed to bulk update");
  return res.json();
}

export async function deleteScholarship(id: string, token?: string | null): Promise<void> {
  const res = await fetch(`${ADMIN_BASE}/scholarships/${id}`, {
    method: "DELETE",
    headers: getHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to delete scholarship");
}

// ──────────────────────────────────────────────────────────────────
// Staging API — for crawled items with "crawl-" IDs
// ──────────────────────────────────────────────────────────────────

export async function approveStagingEntry(id: string, notes?: string, token?: string | null): Promise<any> {
  const res = await fetch(`${ADMIN_BASE}/staging/${id}/approve`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify({ notes: notes ?? null }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to approve staging entry");
  }
  return res.json();
}

export async function rejectStagingEntry(id: string, notes?: string, token?: string | null): Promise<any> {
  const res = await fetch(`${ADMIN_BASE}/staging/${id}/reject`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify({ notes: notes ?? null }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to reject staging entry");
  }
  return res.json();
}

export async function deleteStagingEntry(id: string, token?: string | null): Promise<void> {
  const res = await fetch(`${ADMIN_BASE}/staging/${id}`, {
    method: "DELETE",
    headers: getHeaders(token),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to delete staging entry");
  }
}

export async function updateStagingEntry(id: string, updates: Record<string, any>, token?: string | null): Promise<any> {
  const res = await fetch(`${ADMIN_BASE}/staging/${id}`, {
    method: "PUT",
    headers: getHeaders(token),
    body: JSON.stringify(updates),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to update staging entry");
  }
  return res.json();
}

/** Route approve/reject/delete/update to staging or main DB based on ID prefix. */
export function isStagingId(id: string): boolean {
  return id.startsWith("crawl-");
}
