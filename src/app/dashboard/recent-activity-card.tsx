import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LogIn, LogOut } from "lucide-react";
import { Activity } from "./dashboard-overview";
import { formatTimestamp } from "@/lib/common";

interface RecentActivityCardProps {
  activity: Activity;
}

export function RecentActivityCard({ activity }: RecentActivityCardProps) {
  const time = formatTimestamp(activity.timestamp);

  return (
    <div className="flex items-center space-x-4 rounded-md border p-3">
      <Avatar className="h-10 w-10">
        <AvatarImage src={activity.photoUrl} alt={activity.name} />
        <AvatarFallback>
          {activity.name.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium leading-none">{activity.name}</p>
        <p className="text-sm text-muted-foreground">
          {activity.apartment} • {time} • {activity.device_id}
        </p>
      </div>

      <Badge
        variant={activity.type === "entry" ? "default" : "secondary"}
        className="flex items-center gap-1"
      >
        {activity.type === "entry" ? (
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
  );
}
