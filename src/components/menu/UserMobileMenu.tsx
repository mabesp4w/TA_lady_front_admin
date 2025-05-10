/** @format */
// user drawer
"use client";
import React from "react";
import { BiMenu } from "react-icons/bi";
import UserMenu from "./UserMenu";
import Drawer from "../other/Drawer";
import { useWelcomeContext } from "@/context/WelcomeContext";

const UserMobileMenu = () => {
  const { welcome } = useWelcomeContext();
  return (
    <div className="flex justify-center items-center absolute top-0 w-full h-10 bg-neutral lg:hidden">
      <h4 className="text-center text-xl font-bold text-neutral-content">
        {welcome}
      </h4>
      <div className="w-fit lg:hidden absolute right-0">
        <Drawer
          position="right"
          toggleButton={
            <BiMenu className="text-2xl cursor-pointer  text-neutral-content" />
          }
          sidebar={<UserMenu />}
        />
      </div>
    </div>
  );
};

export default UserMobileMenu;
