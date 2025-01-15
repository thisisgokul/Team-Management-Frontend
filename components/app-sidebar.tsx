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
  const [parsedUserData, setParsedUserData] = React.useState<{ fullName?: string } | null>(null);

  React.useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    setParsedUserData(storedUserData ? JSON.parse(storedUserData) : null);

    function getCookie(name: string) {
      if (typeof document === "undefined") return null; // Prevent SSR issues
      const cookieArr = document.cookie.split(";");
      for (let cookie of cookieArr) {
        let trimmedCookie = cookie.trim();
        if (trimmedCookie.startsWith(name + "=")) {
          return trimmedCookie.substring(name.length + 1);
        }
      }
      return null;
    }

    setRole(getCookie("role"));
  }, []);

  const navMain = getNavMainByRole(role);

  function getNavMainByRole(role: string | null) {
    if (role === "Admin") {
      return [
        { title: "Team Mates", url: "/dashboard/admin/users" },
        { title: "Products", url: "/dashboard/admin/products" },
      ];
    } else if (role === "Employee") {
      return [
        { title: "My Orders", url: "/dashboard/employee/tasks" },
        { title: "Place Order", url: "/dashboard/employee/all-products" },
      ];
    } else if (role === "Manager") {
      return [{ title: "Manage Orders", url: "/dashboard/manager" }];
    } else {
      return [];
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
        plan: parsedUserData?.fullName || "Guest",
      },
    ],
    navMain: [
      {
        title: "Management",
        url: "#",
        icon: SquareTerminal,
        isActive: true,
        items: navMain,
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
