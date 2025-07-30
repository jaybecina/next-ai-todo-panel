"use client";

import { LayoutDashboard, Newspaper, Users, User } from "lucide-react";
import Link from "next/link";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

const Sidebar = () => {
  const sideData = [
    {
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
      label: "Dashboard",
      path: "/dashboard",
    },
    {
      icon: <Newspaper className="mr-2 h-4 w-4" />,
      label: "Todos",
      path: "/dashboard/todos",
    },
    {
      icon: <User className="mr-2 h-4 w-4" />,
      label: "Profile",
      path: "/dashboard/profile",
    },
  ];

  return (
    <Command className="bg-secondary rounded-none h-screen">
      <CommandList>
        {sideData.length > 0 && (
          <CommandGroup heading="Core">
            {sideData
              .filter((command) => !["Profile"].includes(command.label))
              .map((command) => (
                <CommandItem key={command.label}>
                  {command.icon}
                  <Link href={command.path}>{command.label}</Link>
                </CommandItem>
              ))}
          </CommandGroup>
        )}
        <CommandSeparator />
        <CommandGroup heading="">
          {sideData
            .filter((command) => ["Profile"].includes(command.label))
            .map((command) => (
              <CommandItem key={command.label}>
                {command.icon}
                <Link href={command.path}>{command.label}</Link>
              </CommandItem>
            ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

export default Sidebar;
