'use client'

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Aspekta } from "@/lib/fonts";
import Setting from "./setting/page";
import Dashboard from "./dashboard/page";
import { useState } from "react";
import { NavMain } from "@/components/nav-main";
import { NavBar } from "@/components/navbar/NavBar";
import Commercial from "./commercial/history/page";
import History from "./commercial/history/page";
import Starred from "./commercial/starred/page";
import { useIsMobile } from "@/hooks/use-mobile";

export const components = {
  Dashboard: Dashboard,
  // Leads: Leads,
  History: History,
  Starred: Starred,
  // PilotageInsights: PilotageInsights,
  // Articles: Articles,
  // Parametres: Parametres,
  Setting: Setting,

};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  const [page, setPage] = useState<string>("Dashboard");
  const PageComponent = components[page as keyof typeof components];
  const isMobile = useIsMobile();

  return (
    <html>
      <body className={`${Aspekta.className}`}>
        <SidebarProvider>
          <AppSidebar page={page} setPage={setPage} />
          <SidebarInset>
            {isMobile && <SidebarTrigger />}
            <div className="mx-auto w-full max-w-[1600px] p-6">
              <NavBar />
              <PageComponent />
            </div>
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}
