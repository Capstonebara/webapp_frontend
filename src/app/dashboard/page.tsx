"use client";

import { useEffect, useState } from "react";
import UserDashboard from "./user-dashboard";

export default function Dashboard() {
  const [accessToken, setAccessToken] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedValue = localStorage.getItem("accessToken");
    const username = localStorage.getItem("user");

    if (storedValue && username) {
      setAccessToken(storedValue);
      setUsername(username);
    }
  }, []);

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
