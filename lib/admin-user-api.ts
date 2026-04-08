// API client for Admin User Management endpoints
import {
  AdminUser,
  UserListResponse,
  UserStats,
  ActivityLogResponse,
  CreateUserPayload,
  UpdateUserPayload,
} from "@/types/user";

const BASE_URL = process.env.NEXT_PUBLIC_AI_API_URL || "http://localhost:8000";
const USERS_BASE = `${BASE_URL}/api/admin/users`;

function getHeaders(token?: string | null) {
  const finalToken =
    token ||
    (typeof window !== "undefined" ? localStorage.getItem("somatch_token") : null);
  return {
    "Content-Type": "application/json",
    ...(finalToken ? { Authorization: `Bearer ${finalToken}` } : {}),
  };
}

export async function fetchUsers(
  params: {
    search?: string;
    role?: string;
    page?: number;
    page_size?: number;
  },
  token?: string | null
): Promise<UserListResponse> {
  const q = new URLSearchParams();
  if (params.search) q.set("search", params.search);
  if (params.role && params.role !== "all") q.set("role", params.role);
  if (params.page) q.set("page", String(params.page));
  if (params.page_size) q.set("page_size", String(params.page_size));

  const res = await fetch(`${USERS_BASE}?${q}`, {
    cache: "no-store",
    headers: getHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

export async function fetchUserStats(token?: string | null): Promise<UserStats> {
  const res = await fetch(`${USERS_BASE}/stats`, {
    cache: "no-store",
    headers: getHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to fetch user stats");
  return res.json();
}

export async function fetchActivityLogs(
  params: { action?: string; page?: number; page_size?: number },
  token?: string | null
): Promise<ActivityLogResponse> {
  const q = new URLSearchParams();
  if (params.action) q.set("action", params.action);
  if (params.page) q.set("page", String(params.page));
  if (params.page_size) q.set("page_size", String(params.page_size));

  const res = await fetch(`${USERS_BASE}/logs?${q}`, {
    cache: "no-store",
    headers: getHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to fetch activity logs");
  return res.json();
}

export async function createUser(
  payload: CreateUserPayload,
  token?: string | null
): Promise<AdminUser> {
  const res = await fetch(USERS_BASE, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to create user");
  }
  return res.json();
}

export async function updateUser(
  id: string,
  payload: UpdateUserPayload,
  token?: string | null
): Promise<AdminUser> {
  const res = await fetch(`${USERS_BASE}/${id}`, {
    method: "PUT",
    headers: getHeaders(token),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to update user");
  }
  return res.json();
}

export async function deleteUser(id: string, token?: string | null): Promise<void> {
  const res = await fetch(`${USERS_BASE}/${id}`, {
    method: "DELETE",
    headers: getHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to delete user");
}

export async function resetUserPassword(
  id: string,
  token?: string | null
): Promise<{ message: string }> {
  const res = await fetch(`${USERS_BASE}/${id}/reset-password`, {
    method: "POST",
    headers: getHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to reset password");
  return res.json();
}
