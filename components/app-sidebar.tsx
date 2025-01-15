"use client"

import * as React from "react"
import {
  SquareTerminal,
  GalleryVerticalEnd,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [role, setRole] = React.useState<string | null>(null);
  const storedUserData = localStorage.getItem("userData");
  const parsedUserData = storedUserData ? JSON.parse(storedUserData) : null;

  React.useEffect(() => {
    const userRoleCookie = getCookie("role"); // Fetches the value of the 'role' cookie
    setRole(userRoleCookie); // Sets the role state with the cookie value
  }, []);

  // Helper function to get a specific cookie by name
  function getCookie(name: string) {
    const cookieArr = document.cookie.split(";"); // Split cookies into an array of strings
    for (let i = 0; i < cookieArr.length; i++) {
      let cookie = cookieArr[i].trim(); 
      if (cookie.startsWith(name + "=")) {
        return cookie.substring(name.length + 1); // Get the value of the cookie
      }
    }
    return null; // Return null if the cookie is not found
  }

  // Determine routes based on role
  const navMain = getNavMainByRole(role);

  function getNavMainByRole(role: string | null) {
    if (role === "Admin") {
      return [
        {
          title: "Team Mates",
          url: "/dashboard/admin/users",
        },
        {
          title: "Products",
          url: "/dashboard/admin/products",
        },
        
      ];
    } else if (role === "Employee") {
      return [
        {
          title: "My Orders",
          url: "/dashboard/employee/tasks",
        },
        {
          title: "Place Order",
          url: "/dashboard/employee/all-products",
        },
        
      ];
    } else if (role === "Manager") {
      return [
        {
          title: "Manage Orders",
          url: "/dashboard/manager",
        },
        
      ];
    } else {
      return []; // Return empty if the role is not found
    }
  }

  const data = {
    user: {
      name: "Management System",
      email: "click here to logout",
      avatar: "/avatars/shadcn.jpg",
    },
    teams: [
      {
        name: "Welcome",
        logo: GalleryVerticalEnd,
        plan: parsedUserData?.fullName,
      },
    ],
    navMain: [
      {
        title: "Management",
        url: "#",
        icon: SquareTerminal,
        isActive: true,
        items: navMain, // Dynamically generated items based on role
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
