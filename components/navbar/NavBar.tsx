'use client';

import { SearchIcon } from "lucide-react";
import { Input } from "../ui/input";
import { useState } from "react";
import { Notification } from "../notification/Notification";
import Image from "next/image";
import { useIsMobile } from "@/hooks/use-mobile";


export interface Navbar extends React.HTMLAttributes<HTMLElement> {
}


export function NavBar({}: Navbar) {
    const [value, setValue] = useState<string>("");
      const isMobile = useIsMobile();
    

    return (
        <div className="flex flex-row justify-between items-center gap-8">
            <div className="relative flex-1">
                <Input
                  className="peer h-14 w-[300px] md:w-full max-w-xl ps-12 pe-2 rounded-2xl focus-visible:ring-0 shadow-none border-2 focus-visible:border-2"
                  placeholder={'Search...'}
                  type="search"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
                <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-4 peer-disabled:opacity-50">
                  <SearchIcon size={22} />
                </div>
            </div>
            <div className="flex justify-center items-center gap-8">
                <Notification />

                <img
                    src="https://avatars.githubusercontent.com/u/52224492?v=1"
                    alt="Profile Picture"
                    width={45}
                    height={45}
                    className="rounded-full border border-gray-300"
                />
                <div className={`leading-none
                    ${isMobile ? "hidden" : ""}`}>
                    <h1 className="font-sans tracking-wider text-xl w-40 truncate">Issam Benmaina</h1>
                    <h2 className="tracking-wider text-md">admin</h2>
                </div>
            </div>
        </div>

    )
}