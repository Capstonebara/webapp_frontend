"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { useEffect, useState } from "react";
import { getLogsByDay } from "./fetch";
import { Activity } from "./dashboard-overview";
import { RecentActivityCard } from "./recent-activity-card";

type AccessLogsByDate = {
  [date: string]: Activity[];
};

interface AccessLogsAccordionProps {
  username: string;
  token: string;
}

export function AccessLogsAccordion({
  username,
  token,
}: AccessLogsAccordionProps) {
  const [accessLogs, setAccessLogs] = useState<AccessLogsByDate>();

  useEffect(() => {
    async function fetchAccessLog() {
      try {
        const data = await getLogsByDay(username, token);
        setAccessLogs(data);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    }
    fetchAccessLog();
  }, [token, username]);

  if (!accessLogs) {
    return;
  }

  // Calculate total logs
  const totalLogs = Object.values(accessLogs).reduce(
    (total, logs) => total + logs.length,
    0
  );

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Access Logs</h2>
        <p className="text-sm text-muted-foreground">
          Total {totalLogs} access records
        </p>
      </div>

      <div className="space-y-4">
        {Object.entries(accessLogs).map(([date, logs]) => (
          <Accordion
            key={date}
            type="single"
            collapsible
            className="border rounded-md"
          >
            <AccordionItem value={date} className="border-none">
              <AccordionTrigger className="px-4 py-2 hover:no-underline hover:bg-muted/50">
                <div className="flex items-center">
                  <span className="font-medium">{date}</span>
                  <span className="ml-2 text-sm text-muted-foreground">
                    ({logs.length} {logs.length === 1 ? "record" : "records"})
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-0 pb-2 px-4">
                <div className="space-y-3 overflow-y-auto max-h-[400px] pr-3">
                  {logs.map((log) => (
                    <RecentActivityCard activity={log} key={log.id} />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
    </div>
  );
}
