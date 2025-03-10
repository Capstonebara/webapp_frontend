"use client";

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
import { Controller, useForm, useWatch } from "react-hook-form";
import { dashboardSchema, DashboardSchema } from "./type";
import { zodResolver } from "@hookform/resolvers/zod";
import { addUser } from "./fetch";
import { Bounce, toast } from "react-toastify";
import { useState } from "react";
import { FaceDetect } from "./face-detect";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check } from "lucide-react";
import { set } from "zod";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: string;
  token: string;
}

export function AddUserModal({
  isOpen,
  onClose,
  user,
  token,
}: AddUserModalProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { isValid },
  } = useForm<DashboardSchema>({
    resolver: zodResolver(dashboardSchema),
    mode: "onChange",
    defaultValues: {
      username: user,
      fullname: "",
      apartment: "",
      gender: undefined,
      phone: "",
      email: "",
    },
  });

  const [username, fullname, apartment, gender, phone, email] = useWatch({
    control,
    name: ["username", "fullname", "apartment", "gender", "phone", "email"],
  });

  const [formStep, setFormStep] = useState(true);
  const [confirmStep, setConfirmStep] = useState(false);
  const [id, setId] = useState("");

  const onSubmit = async (form: DashboardSchema) => {
    try {
      const response = await addUser(form, token);

      if (response.success) {
        setFormStep(false);
        setId(response.id);
      }

      if (!response.success) {
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
      toast.error("Failed to add user", {
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

  const onComfirm = async () => {
    onClose();
    setConfirmStep(false);
    setFormStep(true);
  };

  const ConfirmDialog = () => {
    return (
      <>
        <DialogHeader>
          <DialogTitle>Confirm User Information</DialogTitle>
          <DialogDescription>
            Please review the information before adding the user.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="flex flex-col items-center mb-6">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={""} alt={fullname || "New User"} />
              <AvatarFallback>
                {fullname ? fullname.substring(0, 2).toUpperCase() : "NU"}
              </AvatarFallback>
            </Avatar>

            <h3 className="text-lg font-medium">{fullname || "New User"}</h3>
            <p className="text-sm text-muted-foreground">
              {username || "username"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 border rounded-lg p-4 bg-muted/20">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Apartment
              </p>
              <p className="font-medium">{apartment || "Not specified"}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Gender
              </p>
              <p className="font-medium capitalize">
                {gender || "Not specified"}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Phone</p>
              <p className="font-medium">{phone || "Not specified"}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="font-medium">{email || "Not specified"}</p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button className="flex items-center gap-2" onClick={onComfirm}>
            <Check className="h-4 w-4" /> Confirm & Add
          </Button>
        </DialogFooter>
      </>
    );
  };

  const SubmitDialog = () => {
    return (
      <>
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Enter the details of the new user below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input
                id="username"
                className="col-span-3"
                disabled
                {...register("username")}
                defaultValue={user}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                {...register("fullname")}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="apartment" className="text-right">
                Apartment
              </Label>
              <Input
                id="apartment"
                type="text"
                {...register("apartment")}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 gap-4 items-center">
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
              <Input
                id="phone"
                type="text"
                {...register("phone")}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                className="col-span-3"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid}>
              Add User
            </Button>
          </DialogFooter>
        </form>
      </>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        {formStep && <SubmitDialog />}
        {!formStep && !confirmStep && (
          <FaceDetect id={id} setConfirmStep={setConfirmStep} />
        )}
        {confirmStep && <ConfirmDialog />}
      </DialogContent>
    </Dialog>
  );
}
