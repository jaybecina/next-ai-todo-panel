"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ThemeToggler from "@/components/theme-toggler";
// import { logout, useIsLoggingOut } from "@/store/authStore";

// TODO: Replace with your logo import
// import logo from "../assets/img/logo.png";

const Navbar = () => {
  const router = useRouter();
  // const isLoggingOut = useIsLoggingOut();

  const handleLogout = () => {
    // logout();
    router.push("/auth");
  };

  return (
    <div className="bg-primary dark:bg-slate-700 text-white py-2 px-5 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <div className="block md:hidden">
          <Sheet>
            <SheetTrigger>
              <Menu className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[240px] bg-primary dark:bg-slate-700 text-white p-4"
            >
              <div className="flex flex-col gap-4">
                <Link href="/" className="flex items-center gap-2">
                  {/* <Image src={logo} alt="Logo" width={40} height={32} /> */}
                  <span className="font-bold">Dashboard</span>
                </Link>
                <Link
                  href="/leads"
                  className="px-4 py-2 hover:bg-primary-dark rounded-lg"
                >
                  Leads
                </Link>
                <Link
                  href="/users"
                  className="px-4 py-2 hover:bg-primary-dark rounded-lg"
                >
                  Users
                </Link>
                <Link
                  href="/profile"
                  className="px-4 py-2 hover:bg-primary-dark rounded-lg"
                >
                  Profile
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <Link href="/" className="hidden md:block">
          {/* <Image src={logo} alt="Logo" width={50} height={40} /> */}
        </Link>
        <h1 className="text-base md:text-xl font-bold text-center md:text-left">
          Dashboard
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggler />
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback className="text-black">U</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center justify-between"
              >
                Logout
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Navbar;
