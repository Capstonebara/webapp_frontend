"use client";

import { useEffect, useState } from "react";
import UserDashboard from "./user-dasboard";

export default function Dashboard() {
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    const storedValue = localStorage.getItem("accessToken");
    if (storedValue) {
      setAccessToken(storedValue);
    }
  }, []);

  return (
    <>
      {accessToken ? (
        <div className="min-h-screen bg-background">
          <UserDashboard />
        </div>
      ) : (
        <div>404</div>
      )}
    </>
  );
}
