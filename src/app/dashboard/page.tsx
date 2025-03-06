"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    const storedValue = localStorage.getItem("access_token");
    if (storedValue) {
      setAccessToken(storedValue);
    }
  }, []);

  return (
    <>
      <h1>Dashboard</h1>
      {accessToken}
    </>
  );
}
