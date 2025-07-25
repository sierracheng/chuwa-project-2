"use client";
import React, { useState } from "react"
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectRole, clearAuthenticateState } from "@/redux/features/authenticate/authenticateSlice";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import { logoutUser } from "@/back-end/api/auth";
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
  const role = useSelector(selectRole);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      console.log("Logging out...");
      // await logoutAPI;
      logoutUser();
      dispatch(clearAuthenticateState());
      console.log("Logout successful");
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
      href: "/employee/homepage",
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

  const links = role === "HR" ? [...hrLinks] : [...employeeLinks];

  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-10">
        <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
          {open && <img src="/images/SmallLogo.png" alt="Logo" className="h-7 w-20 mt-8 ml-1" />}
          <div className="flex flex-col items-left justify-between mt-5">
            <SidebarLink
              link={{
                label: "Profile",
                href: "/employee/homepage",
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
          <div className="mt-auto">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-neutral-700 dark:text-neutral-200"
            >
              <IconArrowLeft className="h-5 w-5 shrink-0" />
              {open && <span>Logout</span>}
            </button>
          </div>
        </div>
      </SidebarBody>
    </Sidebar>
  );
}