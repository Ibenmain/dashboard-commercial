"use client"

import { useState } from "react"
import { Bell, MoreHorizontalIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Notification() {
  return (
    <>
      <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                  <div className="relative cursor-pointer">    
                      <Bell size={28} />
                      <span className="absolute -top-3 -end-2  h-6 w-6 rounded-full bg-red-500 border-2 border-white flex items-center justify-center text-white text-xs font-semibold">3</span>
                  </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40" align="end">
          <DropdownMenuLabel>File Actions</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem>
              New File...
            </DropdownMenuItem>
            <DropdownMenuItem>
              Share...
            </DropdownMenuItem>
            <DropdownMenuItem disabled>Download</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
