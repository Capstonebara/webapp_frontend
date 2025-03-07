import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LogIn, LogOut } from "lucide-react";

export function AccessLogs() {
  // Mock access log data
  const logs = [
    {
      id: 1,
      name: "John Doe",
      photoUrl: "/placeholder.svg",
      timestamp: "2023-07-15T08:30:00",
      type: "entry",
    },
    {
      id: 2,
      name: "John Doe",
      photoUrl: "/placeholder.svg",
      timestamp: "2023-07-15T17:45:00",
      type: "exit",
    },
    {
      id: 3,
      name: "John Doe",
      photoUrl: "/placeholder.svg",
      timestamp: "2023-07-16T09:15:00",
      type: "entry",
    },
    {
      id: 4,
      name: "John Doe",
      photoUrl: "/placeholder.svg",
      timestamp: "2023-07-16T18:30:00",
      type: "exit",
    },
    {
      id: 5,
      name: "John Doe",
      photoUrl: "/placeholder.svg",
      timestamp: "2023-07-17T08:45:00",
      type: "entry",
    },
  ];

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Access Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {logs.map((log) => (
            <div
              key={log.id}
              className="flex items-center gap-4 p-3 rounded-lg border"
            >
              <Avatar className="h-12 w-12">
                <AvatarImage src={log.photoUrl} alt={log.name} />
                <AvatarFallback>
                  {log.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <p className="font-medium">{log.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(log.timestamp)}
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
      </CardContent>
    </Card>
  );
}
