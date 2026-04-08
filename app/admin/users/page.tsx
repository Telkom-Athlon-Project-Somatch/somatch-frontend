"use client";

import { useState, useEffect, useCallback, useDeferredValue } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { ToastContainer, useToast } from "@/components/admin/ToastSystem";
import { Button, Skeleton, StatCard } from "@/components/admin/ui";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import {
  fetchUsers,
  fetchUserStats,
  fetchActivityLogs,
  createUser,
  updateUser,
  deleteUser,
  resetUserPassword,
} from "@/lib/admin-user-api";
import {
  AdminUser,
  UserStats,
  ActivityLog,
  CreateUserPayload,
  UpdateUserPayload,
  UserRole,
} from "@/types/user";

// ─────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────
const ceil = Math.ceil;

function RoleBadge({ role }: { role: UserRole }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border",
        role === "admin"
          ? "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20"
          : "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20"
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {role}
    </span>
  );
}

function VerifiedBadge({ verified }: { verified: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border",
        verified
          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
      )}
    >
      {verified ? "✓ Verified" : "⏳ Unverified"}
    </span>
  );
}

const ACTION_ICONS: Record<string, string> = {
  CREATE_USER: "➕",
  UPDATE_USER: "✏️",
  DELETE_USER: "🗑️",
  RESET_PASSWORD: "🔑",
};

// ─────────────────────────────────────────────────────────
// Create / Edit Modal
// ─────────────────────────────────────────────────────────
interface UserModalProps {
  mode: "create" | "edit";
  user?: AdminUser | null;
  onClose: () => void;
  onSave: (payload: CreateUserPayload | UpdateUserPayload) => Promise<void>;
  saving: boolean;
}

function UserModal({ mode, user, onClose, onSave, saving }: UserModalProps) {
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>(user?.role ?? "user");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "create") {
      await onSave({ name, email, password: password || undefined, role });
    } else {
      const payload: UpdateUserPayload = {};
      if (name !== user?.name) payload.name = name;
      if (email !== user?.email) payload.email = email;
      if (role !== user?.role) payload.role = role;
      await onSave(payload);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="p-6">
          <h3 className="text-lg font-bold text-foreground mb-5">
            {mode === "create" ? "➕ Create New User" : "✏️ Edit User"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
                Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Full name"
                className="w-full px-3 py-2.5 rounded-xl text-sm bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="user@example.com"
                className="w-full px-3 py-2.5 rounded-xl text-sm bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            {mode === "create" && (
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
                  Password{" "}
                  <span className="normal-case font-normal text-muted-foreground">
                    (leave blank for default: Somatch123!)
                  </span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 rounded-xl text-sm bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-3 py-2.5 rounded-xl text-sm bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
              >
                <option value="user">user</option>
                <option value="admin">admin</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : mode === "create" ? "Create User" : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Delete Modal
// ─────────────────────────────────────────────────────────
function DeleteModal({
  user,
  onConfirm,
  onClose,
  deleting,
}: {
  user: AdminUser;
  onConfirm: () => void;
  onClose: () => void;
  deleting: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl p-6"
      >
        <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center mb-4">
          <span className="text-2xl">🗑️</span>
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">Delete User</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Are you sure you want to permanently delete{" "}
          <span className="font-semibold text-foreground">{user.name}</span>{" "}
          <span className="text-muted-foreground">({user.email})</span>? This action cannot be
          undone.
        </p>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose} disabled={deleting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={deleting}>
            {deleting ? "Deleting..." : "Delete Permanently"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Activity Log Panel
// ─────────────────────────────────────────────────────────
function ActivityLogPanel({ token }: { token: string | null }) {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState("");
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, ceil(total / 10));

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchActivityLogs(
        { action: actionFilter || undefined, page, page_size: 10 },
        token
      );
      setLogs(res.logs);
      setTotal(res.total);
    } catch {
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, [actionFilter, page, token]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setPage(1);
  }, [actionFilter]);

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <h3 className="font-bold text-foreground flex items-center gap-2">
          <span>📜</span> Activity Log
        </h3>
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="text-xs px-3 py-1.5 rounded-lg bg-background border border-border text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          <option value="">All Actions</option>
          <option value="CREATE_USER">CREATE_USER</option>
          <option value="UPDATE_USER">UPDATE_USER</option>
          <option value="DELETE_USER">DELETE_USER</option>
          <option value="RESET_PASSWORD">RESET_PASSWORD</option>
        </select>
      </div>
      <div className="divide-y divide-border">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="px-6 py-3 flex gap-3 items-start">
              <Skeleton className="w-8 h-8 rounded-full shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3 w-40" />
                <Skeleton className="h-2.5 w-64" />
              </div>
            </div>
          ))
        ) : logs.length === 0 ? (
          <div className="px-6 py-8 text-center text-sm text-muted-foreground">
            No activity logs found.
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="px-6 py-3 flex gap-3 items-start hover:bg-muted/30 transition-colors">
              <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-sm shrink-0">
                {ACTION_ICONS[log.action] ?? "•"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-foreground">{log.action}</span>
                  <span className="text-xs text-muted-foreground">
                    target: <code className="font-mono">{log.target_user_id.slice(0, 8)}…</code>
                  </span>
                </div>
                {log.detail && (
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{log.detail}</p>
                )}
                <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                  {new Date(log.timestamp).toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
      {totalPages > 1 && (
        <div className="px-6 py-3 border-t border-border flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{total} total</span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
            >
              ← Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || loading}
            >
              Next →
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────
const ROLE_FILTERS = [
  { value: "all", label: "All Roles" },
  { value: "user", label: "User" },
  { value: "admin", label: "Admin" },
];

export default function AdminUsersPage() {
  const { token } = useAuth();

  // ── List state ──
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // ── Stats ──
  const [stats, setStats] = useState<UserStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // ── Filters ──
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);
  const deferredSearch = useDeferredValue(search);

  // ── Modals ──
  const [createOpen, setCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [resetingId, setResetingId] = useState<string | null>(null);

  const { toasts, toast, dismiss } = useToast();

  // ── Load users ──
  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchUsers(
        { search: deferredSearch || undefined, role: roleFilter, page, page_size: 10 },
        token
      );
      setUsers(res.users);
      setTotal(res.total);
      setTotalPages(res.total_pages);
    } catch {
      toast("Failed to load users.", "error");
    } finally {
      setLoading(false);
    }
  }, [deferredSearch, roleFilter, page, token]);

  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const s = await fetchUserStats(token);
      setStats(s);
    } catch {
      setStats(null);
    } finally {
      setStatsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    setPage(1);
  }, [deferredSearch, roleFilter]);

  // ── Actions ──
  const handleCreate = async (payload: any) => {
    setSaving(true);
    try {
      await createUser(payload, token);
      toast("User created successfully.", "success");
      setCreateOpen(false);
      loadUsers();
      loadStats();
    } catch (e: any) {
      toast(e.message || "Failed to create user.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (payload: any) => {
    if (!editUser) return;
    setSaving(true);
    try {
      await updateUser(editUser.id, payload, token);
      toast("User updated successfully.", "success");
      setEditUser(null);
      loadUsers();
    } catch (e: any) {
      toast(e.message || "Failed to update user.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteUser(deleteTarget.id, token);
      toast(`User "${deleteTarget.name}" permanently deleted.`, "success");
      setDeleteTarget(null);
      loadUsers();
      loadStats();
    } catch {
      toast("Failed to delete user.", "error");
    } finally {
      setDeleting(false);
    }
  };

  const handleResetPassword = async (user: AdminUser) => {
    setResetingId(user.id);
    try {
      await resetUserPassword(user.id, token);
      toast(`Password reset to default for "${user.name}".`, "success");
    } catch {
      toast("Failed to reset password.", "error");
    } finally {
      setResetingId(null);
    }
  };

  return (
    <div>
      <AdminTopbar title="User Management" subtitle="Manage admin and regular user accounts" />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {statsLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-5">
                <Skeleton className="h-3 w-20 mb-3" />
                <Skeleton className="h-8 w-12" />
              </div>
            ))
          ) : (
            [
              { label: "Total Users", value: stats?.total_users ?? 0, icon: "👤", color: "text-primary" },
              { label: "Admins", value: stats?.total_admins ?? 0, icon: "🛡️", color: "text-violet-500" },
              { label: "New (7 days)", value: stats?.new_last_7d ?? 0, icon: "✨", color: "text-emerald-500" },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <StatCard label={s.label} value={s.value} icon={s.icon} color={s.color} />
              </motion.div>
            ))
          )}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">🔍</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className={cn(
                "w-full pl-9 pr-4 py-2.5 rounded-xl text-sm bg-card border border-border",
                "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-sm"
              )}
            />
          </div>
          {/* Role filter */}
          <div className="flex gap-1.5">
            {ROLE_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setRoleFilter(f.value)}
                className={cn(
                  "px-4 py-2.5 rounded-xl text-xs font-bold transition-all border",
                  roleFilter === f.value
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground hover:text-foreground hover:bg-muted border-border"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
          {/* Create button */}
          <Button onClick={() => setCreateOpen(true)}>
            ➕ Create User
          </Button>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-5 py-3.5 text-left text-xs font-bold text-muted-foreground uppercase tracking-wide">Name</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-muted-foreground uppercase tracking-wide">Email</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-muted-foreground uppercase tracking-wide">Role</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-muted-foreground uppercase tracking-wide">Status</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-muted-foreground uppercase tracking-wide">Created</th>
                <th className="px-5 py-3.5 text-right text-xs font-bold text-muted-foreground uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <Skeleton className="h-4 w-full" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm text-muted-foreground">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-foreground truncate max-w-[140px]">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground text-sm truncate max-w-[180px]">{user.email}</td>
                    <td className="px-5 py-4"><RoleBadge role={user.role} /></td>
                    <td className="px-5 py-4"><VerifiedBadge verified={user.is_verified} /></td>
                    <td className="px-5 py-4 text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(user.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditUser(user)}
                          title="Edit user"
                        >
                          ✏️
                        </Button>
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => handleResetPassword(user)}
                          disabled={resetingId === user.id}
                          title="Reset password"
                        >
                          {resetingId === user.id ? "…" : "🔑"}
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => setDeleteTarget(user)}
                          title="Delete user"
                        >
                          🗑️
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-5 py-4 border-t border-border flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Showing {(page - 1) * 10 + 1}–{Math.min(page * 10, total)} of {total} users
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                  ← Prev
                </Button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={cn(
                      "w-8 h-8 rounded-lg text-xs font-bold",
                      page === n ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {n}
                  </button>
                ))}
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                  Next →
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Activity Log */}
        <ActivityLogPanel token={token} />
      </div>

      {/* Modals */}
      <AnimatePresence>
        {createOpen && (
          <UserModal
            mode="create"
            onClose={() => setCreateOpen(false)}
            onSave={handleCreate}
            saving={saving}
          />
        )}
        {editUser && (
          <UserModal
            mode="edit"
            user={editUser}
            onClose={() => setEditUser(null)}
            onSave={handleEdit}
            saving={saving}
          />
        )}
        {deleteTarget && (
          <DeleteModal
            user={deleteTarget}
            onConfirm={handleDelete}
            onClose={() => setDeleteTarget(null)}
            deleting={deleting}
          />
        )}
      </AnimatePresence>

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
