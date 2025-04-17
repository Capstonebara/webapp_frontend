"use client";

import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const storedValue = localStorage.getItem("accessToken");
    const username = localStorage.getItem("user");

    if (storedValue && username) {
      router.push("/dashboard");
    } else {
      router.push("/auth");
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <Spinner />
    </div>
  );
}
