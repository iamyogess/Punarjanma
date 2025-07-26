"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import DropDown from "./DropDown";

export default function AdminNav() {
  return (
    <nav className="flex  justify-between items-center h-18 border-b w-full mx-auto ">
      <div>
        <SidebarTrigger />
      </div>
      <div className="p-4">
        <DropDown />
      </div>
    </nav>
  );
}
