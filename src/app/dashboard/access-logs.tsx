"use client";

import { format } from "date-fns";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LogIn, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { getLogsByDay } from "./fetch";

interface AccessLog {
  id: number;
  name: string;
  photoUrl: string;
  timestamp: string;
  type: "entry" | "exit";
  apartment: string;
  device: string;
}

type AccessLogsByDate = {
  [date: string]: AccessLog[];
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

  // Format time for display
  const formatTime = (dateString: string) => {
    return format(new Date(dateString), "h:mm a");
  };

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
                <div className="space-y-3">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-center gap-4 p-3 rounded-md border"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={log.photoUrl} alt={log.name} />
                        <AvatarFallback>
                          {log.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center gap-x-2">
                          <p className="font-medium">{log.name}</p>
                          <p className="font-medium">•</p>
                          <p className="text-sm text-muted-foreground">
                            {log.apartment}
                          </p>
                          <p className="font-medium">•</p>
                          <p className="text-sm text-muted-foreground">
                            {log.device}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatTime(log.timestamp)}
                        </p>
                      </div>

                      <Badge
                        variant={log.type === "entry" ? "default" : "secondary"}
                        className="flex items-center gap-1"
                      >
                        {log.type === "entry" ? (
                          <>
                            <LogIn className="h-3 w-3" />
                            Entry
                          </>
                        ) : (
                          <>
                            <LogOut className="h-3 w-3" />
                            Exit
                          </>
                        )}
                      </Badge>
                    </div>
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
