"use client";

import { useEffect, useState } from "react";
import UserDashboard from "./user-dashboard";
import { checkingToken } from "./fetch";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [tokenChecked, setTokenChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [username, setUsername] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      router.replace("/auth");
      return;
    }

    setAccessToken(token);
    setUsername(user);

    checkingToken(token)
      .then((res) => {
        if (res.success) {
          setIsAuthenticated(true);
        } else {
          localStorage.clear();
          router.replace("/auth");
        }
      })
      .catch((err) => {
        console.error("Token check failed:", err);
        localStorage.clear();
        router.replace("/auth");
      })
      .finally(() => {
        setTokenChecked(true);
      });
  }, [router]);

  if (!tokenChecked) {
    return (
      <div className="flex h-screen items-center justify-center">
        Checking authentication...
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // avoid flicker after redirect
  }

  return (
    <div className="min-h-screen bg-background">
      <UserDashboard token={accessToken} user={username} />
    </div>
  );
}
