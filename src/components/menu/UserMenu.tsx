/** @format */

"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BiHome,
  BiStore,
  BiPackage,
  BiCart,
  BiLocationPlus,
  BiLineChart,
  BiLogOut,
} from "react-icons/bi";
import { useRouter } from "next/navigation";
import useLogout from "@/stores/auth/logout";
import handleLogout from "@/app/auth/logout/logout";
import { useState } from "react";

interface MenuItem {
  title: string;
  icon: JSX.Element;
  href: string;
}

const UserMenu = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { setLogout } = useLogout();
  const [loadLogout, setLoadLogout] = useState(false);

  const menuItems: MenuItem[] = [
    {
      title: "Dashboard",
      icon: <BiHome className="h-5 w-5" />,
      href: "/",
    },
    {
      title: "Profil Bisnis",
      icon: <BiStore className="h-5 w-5" />,
      href: "/profil",
    },
    {
      title: "Produk",
      icon: <BiPackage className="h-5 w-5" />,
      href: "/produk",
    },
    {
      title: "Lokasi Penjualan",
      icon: <BiLocationPlus className="h-5 w-5" />,
      href: "/lokasi-penjualan",
    },
    {
      title: "Laporan Penjualan",
      icon: <BiCart className="h-5 w-5" />,
      href: "/laporan-penjualan",
    },
    {
      title: "Statistik",
      icon: <BiLineChart className="h-5 w-5" />,
      href: "/statistik",
    },
  ];

  const isActive = (href: string) => {
    // Untuk halaman root, hanya cocokkan path yang tepat sama
    if (href === "/") {
      return pathname === "/";
    }

    // Untuk menu lain, periksa apakah pathname dimulai dengan href
    // Ini akan membuat submenu seperti /lokasi-penjualan/form tetap menjaga
    // menu lokasi-penjualan tetap aktif
    return pathname.startsWith(href);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Logo atau Header */}
      <div className="p-4 border-b border-base-300">
        <h1 className="text-xl font-bold text-primary">UMKM Dashboard</h1>
        <p className="text-sm text-base-content/70">Sistem Informasi UMKM</p>
      </div>

      {/* Menu Items */}
      <ul className="menu p-4 flex-1">
        {menuItems.map((item, index) => (
          <li key={index}>
            <Link
              href={item.href}
              className={`flex items-center gap-3 ${
                isActive(item.href)
                  ? "active bg-primary text-primary-content"
                  : "hover:bg-base-200"
              }`}
            >
              {item.icon}
              <span>{item.title}</span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Logout Button */}
      {loadLogout ? (
        <span className="loading loading-spinner loading-lg text-primary"></span>
      ) : (
        <div className="p-4 border-t border-base-300">
          <button
            onClick={() => handleLogout({ setLogout, setLoadLogout, router })}
            className="btn btn-ghost btn-block justify-start gap-3 text-error hover:bg-error/10"
          >
            <BiLogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
