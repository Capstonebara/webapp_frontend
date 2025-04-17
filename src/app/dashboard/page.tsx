"use client";

import { useEffect, useState } from "react";
import UserDashboard from "./user-dashboard";
import { checkingToken } from "./fetch";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [accessToken, setAccessToken] = useState("");
  const [username, setUsername] = useState("");

  const router = useRouter();

  useEffect(() => {
    const storedValue = localStorage.getItem("accessToken");
    const username = localStorage.getItem("user");

    if (storedValue && username) {
      setAccessToken(storedValue);
      setUsername(username);
    }
  }, []);

  useEffect(() => {
    async function checkToken() {
      try {
        const response = await checkingToken(accessToken);
        if (response.success) {
          router.push("/dashboard");
        }

        if (!response.success) {
          localStorage.clear();
          router.push("/auth");
        }
      } catch (error) {
        console.error("Failed to check token", error);
      }
    }

    checkToken();
  }, [accessToken, router]);

  if (!accessToken && !username) {
    return (
      <>
        <div className="flex h-screen items-center justify-center">
          Authentication first !
        </div>
      </>
    );
  }

  return (
    <>
      {accessToken ? (
        <div className="min-h-screen bg-background">
          <UserDashboard token={accessToken} user={username} />
        </div>
      ) : (
        <div className="flex h-screen items-center justify-center">404</div>
      )}
    </>
  );
}
