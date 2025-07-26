import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AdminMenu from "./AdminMenu";
import toast from "react-hot-toast";
export default function DropDown() {
  const handleLogout = () => {
    if (window.confirm("Do you really want to logout ?")) {
      toast.success("Logout successfully!");
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <AdminMenu name="Bikram" image="" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuItem>Team</DropdownMenuItem> */}
        <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
