import { Bot, LayoutDashboard, Newspaper, Settings, Settings2, SquareTerminal } from "lucide-react";

export const data = {
  navMain: [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Leads",
      icon: SquareTerminal

    },
    {
      title: "Setting",
      icon: Settings2

    },
    {
      title: "Commercial",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
        },
        {
          title: "Starred",
        },
        {
          title: "Settings",
        },
      ],
    },
    {
      title: "Pilotag & Insights",
      icon: Bot,
      isActive: true,
      items: [
        {
          title: "Genesis",
        },
        {
          title: "Explorer",
        },
        {
          title: "Quantum",
        },
      ],
    },

    {
      title: "Articles",
      icon: Newspaper

    },

    {
      title: "Parametres",
      icon: Settings

    },
  ],
}