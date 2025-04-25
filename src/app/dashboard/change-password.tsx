import { useForm } from "react-hook-form";
import { changePasswordSchema, ChangePasswordSchema } from "../auth/type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Bounce, toast } from "react-toastify";
import { changePassword } from "./fetch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { LucideEye, LucideEyeOff } from "lucide-react";

interface ChangePasswordProps {
  username: string;
  old_password: string;
  new_password: string;
}

export function ChangePassword({ user }: { user: string }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange",
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      reset({ username: user });
    }
  }, [user, reset]);

  const onSubmit = async (data: ChangePasswordProps) => {
    try {
      const response = await changePassword(
        data.username,
        data.old_password,
        data.new_password
      );

      if (response.success) {
        toast.success(response.message, {
          theme: "light",
          transition: Bounce,
          hideProgressBar: true,
        });
      } else {
        toast.error(response.message || "Change password failed", {
          theme: "light",
          transition: Bounce,
          hideProgressBar: true,
        });
      }
    } catch {
      toast.error("An error occurred during login", {
        theme: "light",
        transition: Bounce,
      });
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Change Password</h2>
      </div>

      <div className="w-1/3">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-4 items-center">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              className="col-span-3"
              {...register("username")}
              disabled={!!user}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-5">
            <Label htmlFor="new_password" className="text-left">
              Old Password
            </Label>
            <div className="col-span-3 relative">
              <Input
                type={showPassword ? "text" : "password"}
                id="old_password"
                className="pr-10"
                {...register("old_password")}
              />
              <Button
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                variant="link"
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <LucideEyeOff className="h-4 w-4" />
                ) : (
                  <LucideEye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-5">
            <Label htmlFor="new_password" className="text-left">
              New Password
            </Label>
            <div className="col-span-3 relative">
              <Input
                type={showPassword ? "text" : "password"}
                id="new_password"
                className="pr-10"
                {...register("new_password")}
              />
              <Button
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                variant="link"
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <LucideEyeOff className="h-4 w-4" />
                ) : (
                  <LucideEye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={!isValid}>
            Change Password
          </Button>
        </form>
      </div>
    </div>
  );
}
