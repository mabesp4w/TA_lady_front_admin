/** @format */
"use client";
import React from "react";
import Drawer from "../other/Drawer";
import { BiMenu } from "react-icons/bi";
import { useWelcomeContext } from "@/context/WelcomeContext";
import Sidebar from "../sidebar/Sidebar";

const HeaderDef = () => {
  const { welcome } = useWelcomeContext();
  return (
    <div className="w-full flex justify-center items-center">
      <h4 className="text-center text-xl font-bold">{welcome}</h4>
      <div className="w-fit lg:hidden absolute right-0">
        <Drawer
          position="right"
          toggleButton={<BiMenu className="text-2xl cursor-pointer" />}
          sidebar={<Sidebar />}
        />
      </div>
    </div>
  );
};

export default HeaderDef;
