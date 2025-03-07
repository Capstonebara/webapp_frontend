"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { AuthSchema, authSchema } from "./type";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUser } from "./login";
// import { redirect } from "next/navigation";
import { useRouter } from "next/navigation"; // Thêm import này
// import { useEffect, useState } from "react";
import { Bounce, toast } from "react-toastify";

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

  const onSubmit = async (data: { username: string; password: string }) => {
    try {
      const response = await loginUser(data);

      if (response.success) {
        const authHeader = response.headers["authorization"];
        let accessToken;

        if (authHeader) {
          accessToken = authHeader.split("Bearer ")[1];
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("user", data.username);
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
          router.push("/dashboard"); // Thay đổi đường dẫn
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
      toast.error("An error occurred during login", {
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
