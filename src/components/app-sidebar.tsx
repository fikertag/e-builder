"use client";

import * as React from "react";
import {
  AudioWaveform,
  BarChart2,
  BookOpen,
  Command,
  LifeBuoy,
  Palette,
  PieChart,
  Send,
  Settings2,
  ShoppingCart,
  GalleryVerticalEnd,
  Package,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
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

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Overview",
      url: "/dashboard#overview",
      icon: PieChart,
      isActive: true,
    },
    {
      title: "Products",
      url: "/dashboard#products",
      icon: Package,
      items: [
        { title: "All Products", url: "/dashboard#products" },
        { title: "Add Product", url: "/dashboard#add-product" },
      ],
    },
    {
      title: "Orders",
      url: "/dashboard#orders",
      icon: ShoppingCart,
      items: [{ title: "All Orders", url: "/dashboard#orders" }],
    },
    {
      title: "Store Settings",
      url: "/dashboard#settings",
      icon: Settings2,
      items: [
        { title: "General", url: "/dashboard#settings" },
        { title: "Branding", url: "/dashboard#branding" },
        { title: "Contact Info", url: "/dashboard#contact" },
        { title: "Subdomain", url: "/dashboard#subdomain" },
        { title: "Visibility", url: "/dashboard#visibility" },
      ],
    },
    {
      title: "Theme & Appearance",
      url: "/dashboard#theme",
      icon: Palette,
      items: [
        { title: "Theme", url: "/dashboard#theme" },
        { title: "Live Preview", url: "/dashboard#preview" },
      ],
    },
    {
      title: "Analytics",
      url: "/dashboard#analytics",
      icon: BarChart2,
    },
    {
      title: "Account & Team",
      url: "/dashboard#account",
      icon: Command,
      items: [
        { title: "Profile", url: "/dashboard#account" },
        { title: "Team Members", url: "/dashboard#team" },
      ],
    },
    {
      title: "Integrations",
      url: "/dashboard#integrations",
      icon: AudioWaveform,
      items: [
        { title: "Payments", url: "/dashboard#payments" },
        { title: "Shipping", url: "/dashboard#shipping" },
        { title: "Email", url: "/dashboard#email" },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support & Help",
      url: "/dashboard#support",
      icon: LifeBuoy,
    },
    {
      title: "Docs",
      url: "/dashboard#docs",
      icon: BookOpen,
    },
    {
      title: "Feedback",
      url: "/dashboard#feedback",
      icon: Send,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
