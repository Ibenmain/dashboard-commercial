"use client"

import * as React from "react"
import { NavMain } from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { data } from "@/constant/utils"

export function AppSidebar({page, setPage, ...props }: React.ComponentProps<typeof Sidebar> & { page: string, setPage: React.Dispatch<React.SetStateAction<string>> }) {
  const { open } = useSidebar()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className={`flex flex-row justify-center w-full items-start h-32`}>
              <img src="/images/logo.png" alt="Logo" className=" h-18" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain page={page} setPage={setPage} items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <div className="flex flex-row  w-full justify-center px-1.5 ">
        logout
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
