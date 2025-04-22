"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Bounce, toast } from "react-toastify";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { loginUser } from "./login";
import { AuthSchema, authSchema } from "./type";

export default function Auth() {
  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<AuthSchema>({
    resolver: zodResolver(authSchema),
    mode: "onChange",
  });

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const user = localStorage.getItem("user");

    if (token && user) {
      router.replace("/dashboard");
    }
  }, [router]);

  const onSubmit = async (data: { username: string; password: string }) => {
    try {
      const response = await loginUser(data);
      const authHeader = response.headers?.["authorization"];

      if (response.success && authHeader) {
        const token = authHeader.split("Bearer ")[1];
        localStorage.setItem("accessToken", token);
        localStorage.setItem("user", data.username);

        toast.success(response.message, {
          theme: "light",
          transition: Bounce,
          hideProgressBar: true,
        });
        router.replace("/dashboard");
      } else {
        toast.error(response.message || "Login failed", {
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
    <div className="flex items-center justify-center h-screen">
      <div className="max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Enter your email below to login to your account
          </p>
        </div>
        {/* Gắn handleSubmit vào form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="text">Username</Label>
            <Input {...register("username")} id="text" type="text" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              {...register("password")}
              id="password"
              type="password"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={!isValid}>
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}
