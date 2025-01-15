import { NextResponse } from "next/server";

export async function middleware(req: any) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("role");

  // Extract the user's role from the token
  const userRole = token?.value;

  // Define role-based restricted paths
  const adminPaths = [
    "/dashboard/admin/users", 
    "/dashboard/admin/products",
    "/dashboard/admin/settings",
  ];

  const employeePaths = [
     // Employee-specific paths
    "/dashboard/employee/tasks",
  ];

  const managerPaths = [
    "/dashboard/manager", // Manager-specific paths
    "/dashboard/manager/reports",
  ];

  // Restrict paths based on user role
  if (userRole === "Admin" && !adminPaths.includes(pathname)) {
    // Redirect Admin users to the dashboard or another page if they try to access non-admin paths
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (userRole === "Employee" && !employeePaths.includes(pathname)) {
    // Redirect Employee users to the employee dashboard if they try to access non-employee paths
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (userRole === "Manager" && !managerPaths.includes(pathname)) {
    // Redirect Manager users to the manager dashboard if they try to access non-manager paths
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Allow the request to proceed if the user is accessing an allowed route
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/admin/users",
    "/dashboard/admin/products",
    "/dashboard/employee/tasks",
    "/dashboard/manager/",
    // Add more paths for other routes as needed
  ],
};
