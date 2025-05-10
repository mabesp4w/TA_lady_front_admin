/** @format */
"use client";

import { useMenuContext } from "@/context/MenuContext";
import React, { FC, ReactNode, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

type DrawerProps = {
  toggleButton: ReactNode;
  sidebar: ReactNode;
  position?: "left" | "right";
  width?: string;
};

const Drawer: FC<DrawerProps> = ({
  toggleButton,
  sidebar,
  position = "left",
  width = "280px",
}) => {
  const { isOpen, setIsOpen } = useMenuContext();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLLabelElement>(null);
  // pathname
  const pathname = usePathname();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  // close if pathname change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname, setIsOpen]);

  return (
    <div className="drawer z-50">
      <input
        id="my-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={isOpen}
        onChange={(e) => setIsOpen(e.target.checked)}
      />

      <div className="drawer-content">
        <label ref={toggleButtonRef} htmlFor="my-drawer">
          {toggleButton}
        </label>
      </div>

      <div className="drawer-side">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
          onClick={() => setIsOpen(false)}
        />
        <div
          ref={sidebarRef}
          className={`flex gap-x-4 min-h-screen fixed h-full ${
            position === "left" ? "left-0" : "-right-10"
          }`}
          style={{
            width: width,
            transition: "transform 0.3s ease-in-out",
            transform: isOpen
              ? "translateX(0)"
              : `translateX(${position === "left" ? "-100%" : "100%"})`,
          }}
        >
          {sidebar}
        </div>
      </div>
    </div>
  );
};

export default Drawer;
