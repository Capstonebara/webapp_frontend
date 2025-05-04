"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User } from "./user-table";

interface UserProfileModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export function UserProfileModal({
  user,
  isOpen,
  onClose,
}: UserProfileModalProps) {
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>User Information</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-4">
          <div className="flex flex-col items-center gap-3">
            <Avatar className="h-32 w-32">
              <AvatarImage src={user.photoUrl} alt={user.name} />
              <AvatarFallback>
                {user.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Badge variant="outline" className="px-3 py-1">
              ID: {user.id}
            </Badge>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none text-muted-foreground">
                Host
              </p>
              <p className="text-sm font-medium">{user.username}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium leading-none text-muted-foreground">
                Full Name
              </p>
              <p className="text-sm font-medium">{user.name}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium leading-none text-muted-foreground">
                Apartment Number
              </p>
              <p className="text-sm font-medium">{user.apartment}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium leading-none text-muted-foreground">
                Gender
              </p>
              <p className="text-sm font-medium">{user.gender}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium leading-none text-muted-foreground">
                Phone
              </p>
              <p className="text-sm font-medium">{user.phone}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium leading-none text-muted-foreground">
                Email
              </p>
              <p className="text-sm font-medium">{user.email}</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
