"use client";

import Navbar from "@/components/layouts/navbar";
import Sidebar from "@/components/layouts/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>
      <div className="flex pt-[48px] bg-red-500">
        <div className="fixed left-0 hidden md:block h-[calc(100vh-56px)] w-[240px]">
          <Sidebar />
        </div>
        <div className="flex-1 p-5 h-full overflow-x-auto md:ml-[240px] w-full">
          {children}
        </div>
      </div>
    </>
  );
}
