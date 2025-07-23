"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import {
  IconArrowLeft,
  IconCategory,
  IconBox,
  IconUserSearch,
  IconDirections,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function NavigationBar() {
  const links = [
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
    {
      label: "Logout",
      href: "/logout",
      icon: (
        <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);
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