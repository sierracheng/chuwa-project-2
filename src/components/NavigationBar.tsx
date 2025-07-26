"use client";
import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectRole, selectId, clearAuthenticateState } from "@/redux/features/authenticate/authenticateSlice";
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
import { getUserNameAndAvatarByIdAPI } from "@/back-end/api/userAPI";
export function NavigationBar() {
  const [open, setOpen] = useState(false);
  const role = useSelector(selectRole);
  const userId = useSelector(selectId);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [Name, setName] = useState("");
  const [AvatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    const fetchUserNameAndAvatar = async () => {
      try {
        const response = await getUserNameAndAvatarByIdAPI(userId);
        if (response) {
          const firstName = response.name.preferredName ? response.name.preferredName : response.name.firstName;
          setName(firstName + " " + response.name.lastName);
          setAvatarUrl(response.avatarUrl);
        } else {
          console.error("Failed to fetch user name and avatar:", response.message);
        }
    } catch (error) {
      console.error("Error fetching user name and avatar:", error);
    }
  };
    fetchUserNameAndAvatar();
  }, [userId]);

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
                label: Name,
                href: "/employee/homepage",
                icon: (
                  <div className={`${open ? 'w-12 h-12' : 'w-8 h-8'} rounded-full overflow-hidden bg-gray-200 transition-all duration-150`}>
                  <img
                    src={AvatarUrl || "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"}
                    className="w-full h-full object-cover"
                    alt="Avatar"
                  />
                  </div>
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