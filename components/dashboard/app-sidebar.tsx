"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  BookOpen,
  Calendar,
  HelpCircle,
  LayoutDashboard,
  Lock,
  LogOut,
  Settings,
  User,
  Users,
  Video,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";

type IconType = React.ComponentType<{ className?: string }>;

type NavItem = {
  title: string;
  href: string;
  icon: IconType;
  children?: { title: string; href: string; icon: IconType }[];
};

const menuItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Courses", href: "/courses", icon: BookOpen },
  { title: "Calendar", href: "/calendar", icon: Calendar },
  { title: "Live Class", href: "/live", icon: Video },
];

const generalItems: NavItem[] = [
  { title: "Profile", href: "/profile", icon: User },
  { title: "Team", href: "/team", icon: Users },
  { title: "Settings", href: "/settings", icon: Settings },
  { title: "Help Center", href: "/help", icon: HelpCircle },
];

const buttonClass =
  "h-14! text-base gap-3 rounded-full pl-4 pr-4 text-sidebar-foreground data-[active=true]:bg-transparent data-[active=true]:bg-[linear-gradient(to_right,rgba(237,87,53,0.10),transparent)] data-[active=true]:text-primary data-[active=true]:font-medium hover:bg-accent/60 group-data-[collapsible=icon]:size-14! group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:[background:transparent]! group-data-[collapsible=icon]:[&>span:last-child]:hidden";

const circleClass =
  "flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-sidebar-foreground transition-colors group-data-[active=true]/menu-button:bg-primary group-data-[active=true]/menu-button:text-primary-foreground [&>svg]:size-5";

function NavButton({ item }: { item: NavItem | { title: string; href: string; icon: IconType } }) {
  const pathname = usePathname();
  const isActive =
    pathname === item.href || pathname.startsWith(item.href + "/");
  return (
    <SidebarMenuButton
      asChild
      isActive={isActive}
      tooltip={item.title}
      className={buttonClass}
    >
      <Link href={item.href}>
        <span className={circleClass}>
          <item.icon />
        </span>
        <span>{item.title}</span>
      </Link>
    </SidebarMenuButton>
  );
}

function NavGroup({ label, items }: { label: string; items: NavItem[] }) {
  const pathname = usePathname();
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="gap-1">
          {items.map((item) => {
            const isActive =
              pathname === item.href ||
              pathname.startsWith(item.href + "/");
            return (
              <SidebarMenuItem key={item.href}>
                <NavButton item={item} />

                {item.children && isActive && (
                  <ul className="mt-1 flex flex-col gap-1 pl-4">
                    {item.children.map((child) => (
                      <SidebarMenuItem key={child.href}>
                        <NavButton item={child} />
                      </SidebarMenuItem>
                    ))}
                  </ul>
                )}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function SidebarCta() {
  return (
    <div className="group-data-[collapsible=icon]:hidden">
      <div className="relative overflow-hidden rounded-2xl p-4 text-white min-h-[110px]">
        <Image
          src="/mobile_cto.png"
          alt="Download App Background"
          fill
          sizes="250px"
          className="object-cover object-center z-0"
          priority
        />
        <div className="absolute inset-0 bg-[#2c3545]/65 z-10" />
        <div className="relative z-20">
          <p className="text-sm font-semibold leading-tight">
            Download Our<br />Mobile App
          </p>
          <button
            type="button"
            className="mt-3 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
          >
            Download App
          </button>
        </div>
      </div>
    </div>
  );
}

export function AppSidebar() {
  return (
    <Sidebar
      collapsible="icon"
      className="h-full data-[side=left]:border-r-0"
    >
      <SidebarHeader className="h-14 shrink-0 flex-row items-center justify-between rounded-card bg-card px-4 py-0 shadow-sm group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:gap-1">
        <Link
          href="/dashboard"
          className="flex items-center group-data-[collapsible=icon]:hidden"
        >
          <Image
            src="/shiko-logo-black.svg"
            alt="Shiko"
            width={110}
            height={36}
            style={{ height: "auto" }}
            priority
          />
        </Link>
        <Link
          href="/dashboard"
          className="hidden items-center group-data-[collapsible=icon]:flex"
        >
          <Image
            src="/shiko-logo_only-black.svg"
            alt="Shiko"
            width={28}
            height={28}
            style={{ height: "auto" }}
            priority
          />
        </Link>
        <SidebarTrigger className="text-muted-foreground" />
      </SidebarHeader>

      <div className="mt-3 flex min-h-0 flex-1 flex-col overflow-hidden rounded-card bg-card shadow-sm">
        <SidebarContent className="bg-transparent">
          <NavGroup label="MENU" items={menuItems} />
          <NavGroup label="GENERAL" items={generalItems} />
        </SidebarContent>

        <SidebarFooter className="shrink-0 gap-3 bg-transparent p-3 group-data-[collapsible=icon]:p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Log Out"
                className="h-14! text-base gap-3 rounded-full pl-4 pr-4 text-primary hover:bg-accent hover:text-primary group-data-[collapsible=icon]:size-14! group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:[&>span:last-child]:hidden"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground [&>svg]:size-5">
                  <LogOut />
                </span>
                <span>Log Out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          <SidebarCta />
        </SidebarFooter>
      </div>
    </Sidebar>
  );
}
