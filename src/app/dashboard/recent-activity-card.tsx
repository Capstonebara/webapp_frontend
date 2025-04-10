import { Badge } from "@/components/ui/badge";
import { LogIn, LogOut, PictureInPicture2 } from "lucide-react";
import { Activity } from "./dashboard-overview";
import { formatTimestamp } from "@/lib/common";
import { useCallback, useState } from "react";
import { PicsModal } from "./dialog-pics";

interface RecentActivityCardProps {
  activity: Activity;
}

export function RecentActivityCard({ activity }: RecentActivityCardProps) {
  const time = formatTimestamp(activity.timestamp);
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenPicture = useCallback(() => {
    setIsOpen(true);
  }, []);

  return (
    <div className="flex items-center space-x-4 rounded-md border p-3">
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

      <Badge
        variant="outline"
        className="flex items-center gap-1 cursor-pointer"
        onClick={handleOpenPicture}
      >
        <>
          <PictureInPicture2 className="h-3 w-3" />
          Captured
        </>
      </Badge>

      <PicsModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        captured={activity.captured}
        time={time}
        device_id={activity.device_id}
      />
    </div>
  );
}
