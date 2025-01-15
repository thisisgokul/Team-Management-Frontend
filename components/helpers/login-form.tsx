"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axiosInstance from "@/utils/axiosInstance";
import { useRouter } from "next/navigation";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  // State for form data and loading/error handling
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  // Login function with Axios
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Clear previous errors

    try {
      const response = await axiosInstance.post(
        "/sign-in",
        { email, password },
        { withCredentials: true }
      );

      console.log("Login successful", response.data);
      alert("Login successful");
      // You can save the token or redirect user after successful login
      localStorage.setItem("userData", JSON.stringify(response.data));
      const userRole = response.data.role; // Assuming the response has the user's role

      if (userRole === "Admin") {
        router.push("/dashboard/admin/users"); // Admin route
      } else if (userRole === "Employee") {
        router.push("/dashboard/employee/tasks"); // Employee route
      } else if (userRole === "Manager") {
        router.push("/dashboard/manager"); // Manager route
      } else {
        alert("Role not recognized, redirecting to default dashboard.");
        router.push("/dashboard"); // Default route for unknown roles (you can adjust as needed)
      }
    } catch (err: unknown) {
      setError("Login failed. Please check your credentials and try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleLogin}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>
      {error && <div className="text-red-500 text-center">{error}</div>}{" "}
      {/* Display error message */}
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="admin@gmail.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </div>
    </form>
  );
}
