"use client";

import { Stats } from "@/app/dashboard/dashboard-overview";
import { useEffect, useState } from "react";

const useWebSocket = (url: string) => {
  const [data, setData] = useState<Stats>();
  const [status, setStatus] = useState<"connected" | "disconnected" | "error">(
    "disconnected"
  );

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      setStatus("connected");
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        setData(parsedData);
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    };

    ws.onerror = (error) => {
      setStatus("error");
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      setStatus("disconnected");
      console.log("WebSocket disconnected");
    };

    return () => {
      ws.close();
    };
  }, [url]);

  return { status, data };
};

export default useWebSocket;
