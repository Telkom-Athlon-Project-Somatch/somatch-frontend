import type { Metadata } from "next";
import AuthWrapper from "@/components/admin/AuthWrapper";

export const metadata: Metadata = {
  title: "Somatch Admin — Scholarship Management",
  description: "Admin dashboard for managing and verifying AI-crawled scholarship data.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthWrapper>{children}</AuthWrapper>;
}
