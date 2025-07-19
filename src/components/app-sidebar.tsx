"use client";

import * as React from "react";
import {
  BookOpen,
  LifeBuoy,
  PieChart,
  Send,
  Settings2,
  ShoppingCart,
  GalleryVerticalEnd,
  Package,
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const stores = useStoreData((state) => state.stores);

  const data = {
    user: {
      name: "Store Owner",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
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
        items: [{ title: "Analytics", url: "/dashboard" }],
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
        items: [{ title: "All Orders", url: "/dashboard/orders" }],
      },
      {
        title: "Customers",
        url: "/dashboard/customers",
        icon: ShoppingCart,
        items: [{ title: "All Customers", url: "/dashboard/customers" }],
      },
      {
        title: "Store Settings",
        url: "/dashboard/settings",
        icon: Settings2,
        items: [
          { title: "General", url: "/dashboard/settings" },
          { title: "Theme & Appearance", url: "/dashboard/settings/theme" },
          { title: "Integrations", url: "/dashboard/settings/integration" },
        ],
      },
    ],
    navSecondary: [
      {
        title: "Support & Help",
        url: "/dashboard/support",
        icon: LifeBuoy,
      },
      {
        title: "Docs",
        url: "/dashboard/docs",
        icon: BookOpen,
      },
      {
        title: "Feedback",
        url: "/dashboard/feedback",
        icon: Send,
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
