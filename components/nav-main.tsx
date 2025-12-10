"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavMain({ page, setPage, items }: {
  page: string
  setPage: React.Dispatch<React.SetStateAction<string>>
  items: {
    title: string
    url?: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url?: string
    }[]
  }[]
}) {
  
  const { open } = useSidebar()

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const isParentActive = item.items?.some((sub) => sub.title === page);
          return item.items && item.items.length > 0 ? (
            <Collapsible key={item.title} asChild className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger
          asChild
          className={`px-4 h-14 cursor-pointer rounded-2xl ${
            isParentActive
              ? "bg-linear-to-r from-blue-600 to-[#1e2772] hover:from-[#1e2772] hover:to-blue-800 transition-all  rounded-2xl text-white hover:text-white shadow-lg shadow-blue-600/30"
              : "hover:bg-muted"
          }`}
        >
          <SidebarMenuButton tooltip={item.title}>
            {item.icon && (
              <item.icon
                className={`size-6! ${
                  isParentActive ? "text-white" : "text-foreground"
                }`}
              />
            )}

            <span className={`text-lg ${isParentActive ? "text-white" : ""}`}>
              {item.title}
            </span>

            <ChevronRight
              className={`ml-auto size-5 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 ${
                isParentActive ? "text-white" : "text-muted-foreground"
              }`}
            />
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarMenuSub>
            {item.items.map((subItem) => (
              <SidebarMenuSubItem key={subItem.title} onClick={() => setPage(subItem.title)}>
                <SidebarMenuSubButton asChild>
                  <div
                    className={`text-[14px] ${open ? "pl-8" : "pl-4"} h-8 flex items-center cursor-pointer rounded-xl transition-all
     open                 ${
                        page === subItem.title
                          ? "font-bold text-[16px] text-[#1e2772]! "
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                  >
                    {subItem.title}
                  </div>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={item.title} onClick={() => setPage(item.title)}>
                <SidebarMenuButton asChild tooltip={item.title} className={` h-14 cursor-pointer rounded-2xl  ${page === item.title ? " bg-linear-to-r from-blue-600 to-[#1e2772] hover:from-[#1e2772] hover:to-blue-800 transition-all  rounded-2xl text-white hover:text-white shadow-lg shadow-blue-600/30" : ""}`}>
                  <div className="flex flex-row items-center gap-3 pl-4">
                    {item.icon && <item.icon className="size-6!" />}
                    <span className={`text-lg`}>{item.title}</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
