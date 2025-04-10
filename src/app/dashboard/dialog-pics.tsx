"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import Image from "next/image";

export function PicsModal({
  isOpen,
  onClose,
  captured,
  time,
  device_id,
}: {
  isOpen: boolean;
  onClose: () => void;
  captured: string;
  time: string;
  device_id: string;
}) {
  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Captured</DialogTitle>
            <DialogDescription>
              Images captured from the{" "}
              <span className="font-bold">{device_id}</span> in{" "}
              <span className="font-bold">{time}</span>
            </DialogDescription>
          </DialogHeader>

          <Image
            src={captured}
            alt="Captured Image"
            height={500}
            width={500}
            unoptimized
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
