"use client";
import React, { useState } from "react"
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectRole } from "@/redux/features/authenticate/authenticateSlice";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import {
  IconArrowLeft,
  IconCategory,
  IconBox,
  IconUserSearch,
  IconDirections,
  IconUser,
  IconFileText,
} from "@tabler/icons-react";

export function NavigationBar() {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const role = useSelector(selectRole);

    const handleLogout = async () => {
    try{
        // await logoutAPI;
        navigate("/login");
    } catch (error) {
        console.error("Logout failed:", error);

        alert("Logout failed. Please try again.");
    }
  }
  const hrLinks = [
    {
      label: "Home",
      href: "/home",
      icon: (
        <IconCategory className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Employee Profile",
      href: "/hr/employees",
      icon: (
        <IconUserSearch className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Visa Management",
      href: "/hr/visa",
      icon: (
        <IconBox className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Hiring Management",
      href: "/hr/hiring",
      icon: (
        <IconDirections className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];

  const employeeLinks = [
    {
      label: "Personal Information",
      href: "/employee/profile",
      icon: (
        <IconUser className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Visa Status Management",
      href: "/employee/visa",
      icon: (
        <IconFileText className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];

  const logoutLink = {
    label: "Logout",
    href: "/login",
    icon: (
      <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
    ),
    onClick: handleLogout,
  };

  const links = role === "HR" ? [...hrLinks, logoutLink] : [...employeeLinks, logoutLink];

  return (
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open && <img src="/images/SmallLogo.png" alt="Logo" className="h-7 w-20 mt-8 ml-1" />}
            <div className="flex flex-col items-left justify-between mt-5">
              <SidebarLink
                link={{
                    label: "Profile",
                    href: "/profile",
                    icon: (
                    <img
                        src="https://assets.aceternity.com/manu.png"
                        className="rounded-full"
                        width={50}
                        height={50}
                        alt="Avatar"
                    />
                    ),
                }}
                />
          </div>
            <div className="mt-2 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
  );
}