"use client";

import * as React from "react";
import {
  LifeBuoy,
  PieChart,
  Settings2,
  ShoppingCart,
  GalleryVerticalEnd,
  Package,
  Plus,
  Users2Icon,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useStoreData } from "@/store/useStoreData";
import { useUser } from "@/context/UserContext";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const stores = useStoreData((state) => state.stores);
  const user = useUser();

  const data = {
    user: {
      name: user?.user?.name || "Name",
      email: user?.user?.email || "Email",
      avatar: user?.user?.image || "/default-avatar.png",
    },
    teams:
      stores && stores.length > 0
        ? stores.map((s) => ({
            name: s.storeName,
            logo: GalleryVerticalEnd,
            plan: "Enterprise",
            id: s.id, // Assuming each store has a unique ID
          }))
        : [
            {
              name: "My Store",
              logo: GalleryVerticalEnd,
              plan: "Enterprise",
            },
          ],
    navMain: [
      {
        title: "Overview",
        url: "/dashboard",
        icon: PieChart,
        isActive: true,
      },
      {
        title: "Products",
        url: "/dashboard/products",
        icon: Package,
        items: [
          { title: "All Products", url: "/dashboard/products" },
          { title: "Add Product", url: "/dashboard/products/add" },
        ],
      },
      {
        title: "Orders",
        url: "/dashboard/orders",
        icon: ShoppingCart,
      },
      {
        title: "Customers",
        url: "/dashboard/customers",
        icon: Users2Icon,
      },
      {
        title: "Store Settings",
        url: "/dashboard/settings",
        icon: Settings2,
        items: [
          { title: "General", url: "/dashboard/settings" },
          { title: "Integrations", url: "/dashboard/settings/integration" },
        ],
      },
      {
        title: "Create Store",
        url: "/dashboard/create",
        icon: Plus,
      },
    ],
    navSecondary: [
      {
        title: "Support & Help",
        url: "/dashboard/support",
        icon: LifeBuoy,
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
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
