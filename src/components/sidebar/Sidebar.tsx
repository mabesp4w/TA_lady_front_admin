/** @format */

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HiHome,
  HiUsers,
  HiOfficeBuilding,
  HiBell,
  HiShoppingCart,
  HiCollection,
  HiReceiptTax,
  HiMenu,
  HiX,
  HiChevronDown,
  HiChevronRight,
} from "react-icons/hi";

type SubMenuType = {
  name: string;
  path: string;
};

type MenuItemType = {
  name: string;
  path: string;
  icon: React.ReactNode;
  subMenus?: SubMenuType[];
};

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const menuItems: MenuItemType[] = [
    {
      name: "Dashboard",
      path: "/",
      icon: <HiHome className="w-6 h-6" />,
    },
    {
      name: "Kamar",
      path: "/kamar",
      icon: <HiOfficeBuilding className="w-6 h-6" />,
      subMenus: [
        { name: "Semua Kamar", path: "/kamar" },
        { name: "Jenis Kamar", path: "/kamar/jenis" },
      ],
    },
    {
      name: "Fasilitas",
      path: "/fasilitas",
      icon: <HiBell className="w-6 h-6" />,
    },
    {
      name: "Produk",
      path: "/produk",
      icon: <HiShoppingCart className="w-6 h-6" />,
      subMenus: [
        { name: "Semua Produk", path: "/produk" },
        { name: "Kategori Produk", path: "/produk/kategori" },
      ],
    },
    {
      name: "Pemesanan",
      path: "/pemesanan",
      icon: <HiCollection className="w-6 h-6" />,
      subMenus: [
        { name: "Pemesanan Kamar", path: "/pemesanan/kamar" },
        { name: "Pemesanan Fasilitas", path: "/pemesanan/fasilitas" },
      ],
    },
    {
      name: "Pesanan",
      path: "/pesanan",
      icon: <HiReceiptTax className="w-6 h-6" />,
    },
    {
      name: "Pembayaran",
      path: "/pembayaran",
      icon: <HiReceiptTax className="w-6 h-6" />,
    },
    {
      name: "Pelanggan",
      path: "/pelanggan",
      icon: <HiUsers className="w-6 h-6" />,
    },
  ];

  const toggleMenu = (menuName: string) => {
    if (openMenus.includes(menuName)) {
      setOpenMenus(openMenus.filter((name) => name !== menuName));
    } else {
      setOpenMenus([...openMenus, menuName]);
    }
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const isActiveLink = (path: string) => {
    return pathname === path;
  };

  const isActiveParent = (path: string) => {
    return pathname?.startsWith(path);
  };

  return (
    <div className="relative">
      {/* Mobile sidebar toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 btn btn-sm btn-circle btn-primary"
        onClick={toggleSidebar}
      >
        {isCollapsed ? <HiMenu /> : <HiX />}
      </button>

      {/* Sidebar */}
      <div
        className={`bg-base-200 text-base-content h-screen fixed transition-all duration-300 ease-in-out z-40 md:shadow-lg ${
          isCollapsed ? "-translate-x-full" : "translate-x-0"
        } md:translate-x-0`}
        style={{ width: "280px" }}
      >
        {/* Logo */}
        <div className="px-6 py-4 border-b border-base-300">
          <h1 className="text-xl font-bold">Terminal 12</h1>
        </div>

        {/* Menu Items */}
        <div className="overflow-y-auto h-[calc(100vh-4rem)]">
          <ul className="menu p-4 text-base-content">
            {menuItems.map((item) => (
              <li key={item.name} className="mb-1">
                {item.subMenus ? (
                  <div
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${
                      isActiveParent(item.path)
                        ? "bg-primary text-primary-content"
                        : "hover:bg-base-300"
                    }`}
                    onClick={() => toggleMenu(item.name)}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.name}</span>
                    </div>
                    {openMenus.includes(item.name) ? (
                      <HiChevronDown className="w-5 h-5" />
                    ) : (
                      <HiChevronRight className="w-5 h-5" />
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.path}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      isActiveLink(item.path)
                        ? "bg-primary text-primary-content"
                        : "hover:bg-base-300"
                    }`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                )}

                {/* Submenu */}
                {item.subMenus && openMenus.includes(item.name) && (
                  <ul className="menu pl-6 mt-1">
                    {item.subMenus.map((subItem) => (
                      <li key={subItem.name}>
                        <Link
                          href={subItem.path}
                          className={`p-3 rounded-lg ${
                            isActiveLink(subItem.path)
                              ? "bg-primary/20 font-medium"
                              : "hover:bg-base-300"
                          }`}
                        >
                          {subItem.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {!isCollapsed && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default Sidebar;
