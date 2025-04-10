"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { RecentActivityCard } from "./recent-activity-card";
import { useEffect, useState } from "react";
import { getRecentLogsByUsername, getStatsByUsername } from "./fetch";
import { Spinner } from "@/components/ui/spinner";

export interface Stats {
  total_resident: number;
  total_entry: number;
  total_exit: number;
}

export interface Activity {
  id: string;
  device_id: string;
  name: string;
  timestamp: number;
  type: "entry" | "exit";
  apartment: string;
  captured: string;
}

export interface DashboardOverviewProps {
  username: string;
  token: string;
}

export function DashboardOverview({ username, token }: DashboardOverviewProps) {
  const [logs, setLogs] = useState<Activity[]>([]);
  const [stats, setStats] = useState<Stats>();
  const [loading, isLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await getStatsByUsername(username, token);
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        isLoading(false);
      }
    }
    fetchStats();
  }, [token, username]);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const data = await getRecentLogsByUsername(username, token);
        setLogs(data);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    }
    fetchLogs();
  }, [token, username]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Overview</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.total_resident !== undefined ? (
                stats.total_resident
              ) : (
                <Spinner />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Apartments with registered residents
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today&apos;s Entries
            </CardTitle>
            <ArrowUpRight className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.total_entry !== undefined ? (
                stats.total_entry
              ) : (
                <Spinner />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              People entered today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today&apos;s Exits
            </CardTitle>
            <ArrowDownRight className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.total_exit !== undefined ? (
                stats?.total_exit
              ) : (
                <Spinner />
              )}
            </div>
            <p className="text-xs text-muted-foreground">People exited today</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Activity by Day</CardTitle>
            <CardDescription>
              Entry and exit patterns throughout the day
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-[300px]">
                <Spinner />
              </div>
            ) : (
              <div className="space-y-4 h-[300px] overflow-y-auto pr-5">
                {logs.map((activity) => (
                  <RecentActivityCard key={activity.id} activity={activity} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
