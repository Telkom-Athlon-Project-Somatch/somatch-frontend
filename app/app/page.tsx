"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AppPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/app/explore");
  }, [router]);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-white relative">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin relative z-10"></div>
    </div>
  );
}
