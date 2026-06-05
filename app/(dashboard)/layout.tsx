import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { MobileMenuButton } from "@/components/dashboard/mobile-menu-button";
import { TopBar } from "@/components/dashboard/top-bar";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative h-screen overflow-hidden border-[12px] border-transparent [--sidebar:transparent]">
      <SidebarProvider className="h-full min-h-0 [--sidebar-width-icon:4.5rem]!">
        <AppSidebar />

        <SidebarInset className="h-full min-h-0 bg-transparent gap-3 overflow-hidden">
          <header className="flex h-14 shrink-0 items-center gap-3 rounded-card bg-card px-4 shadow-sm sm:ml-3">
            <TopBar />
          </header>

          <main className="min-h-0 flex-1 overflow-auto sm:ml-3">
            {children}
          </main>
        </SidebarInset>

        <MobileMenuButton />
      </SidebarProvider>
    </div>
  );
}