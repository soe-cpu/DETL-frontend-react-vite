import Navbar from "@/components/shared/Navbar";
import Sidebar from "@/components/shared/Sidebar";
import { Toaster } from "@/components/ui/toaster";
import React from "react";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Sidebar />
      <div className="p-4 sm:ml-64 dark:bg-gray-700 h-full overflow-y-scroll">
        <div className="p-4 rounded-lg  mt-14">
          <Toaster />
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
