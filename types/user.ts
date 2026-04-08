// Types for Admin User Management

export type UserRole = "user" | "admin";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserListResponse {
  users: AdminUser[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface UserStats {
  total_users: number;
  total_admins: number;
  new_last_7d: number;
}

export interface ActivityLog {
  id: string;
  action: "CREATE_USER" | "UPDATE_USER" | "DELETE_USER" | "RESET_PASSWORD";
  admin_id: string;
  target_user_id: string;
  detail: string | null;
  timestamp: string;
}

export interface ActivityLogResponse {
  logs: ActivityLog[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  role?: UserRole;
}
