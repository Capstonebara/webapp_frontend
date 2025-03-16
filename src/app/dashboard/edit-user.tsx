"use client";

import type React from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User } from "./user-table";
import { Controller, useForm } from "react-hook-form";
import { dashboardSchema, DashboardSchema } from "./type";
import { zodResolver } from "@hookform/resolvers/zod";
import { editUser } from "./fetch";
import { Bounce, toast } from "react-toastify";
import { useEffect } from "react";

interface EditUserModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  token: string;
  onUserUpdated: (updatedUser: User) => void;
}

export function EditUserModal({
  user,
  isOpen,
  onClose,
  token,
  onUserUpdated,
}: EditUserModalProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isValid },
  } = useForm<DashboardSchema>({
    resolver: zodResolver(dashboardSchema),
    mode: "onChange",
  });

  // Reset form values whenever the `user` prop changes
  useEffect(() => {
    if (user) {
      reset({
        username: user.username,
        fullname: user.name,
        apartment: user.apartment,
        gender: user.gender,
        phone: user.phone,
        email: user.email,
      });
    }
  }, [user, reset]);

  if (!user) return null;

  const onSubmit = async (form: DashboardSchema) => {
    try {
      const response = await editUser(form, token, user.id);

      if (response.success) {
        // Create updated user object
        const updatedUser: User = {
          ...user,
          username: form.username,
          name: form.fullname,
          apartment: form.apartment,
          gender: form.gender,
          phone: form.phone || "",
          email: form.email || "",
        };

        // Call the callback to update the parent component's state
        onUserUpdated(updatedUser);

        reset();
        onClose();
        toast.success(response.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      } else {
        toast.error(response.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      }
    } catch {
      toast.error("Failed to edit user", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Make changes to the user information below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="id" className="text-right">
                ID
              </Label>
              <Input
                id="id"
                className="col-span-3 bg-muted"
                value={user.id}
                disabled
                readOnly
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input
                id="username"
                className="col-span-3"
                {...register("username")}
                disabled
                readOnly
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Full Name
              </Label>
              <Input
                id="name"
                className="col-span-3"
                {...register("fullname")}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="apartment" className="text-right">
                Apartment
              </Label>
              <Input
                id="apartment"
                className="col-span-3"
                {...register("apartment")}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="gender" className="text-right">
                Gender
              </Label>
              <div className="col-span-3">
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="M">Male</SelectItem>
                        <SelectItem value="F">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input id="phone" className="col-span-3" {...register("phone")} />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                className="col-span-3"
                {...register("email")}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid}>
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
