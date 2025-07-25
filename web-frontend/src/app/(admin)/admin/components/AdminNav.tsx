"use client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import React, { useState } from "react";
import Avater from "./AdminMenu";
import DropDown from "./DropDown";

export default function AdminNav() {
  const [open, setOpen] = useState<boolean>(false);
  const name = "Bikram Rai";
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
