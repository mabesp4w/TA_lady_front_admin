/** @format */

"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { BiMenu, BiLogOut } from "react-icons/bi";
import useLogout from "@/stores/auth/logout";

const UserNavbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { setLogout } = useLogout();

  const menuItems = [
    { title: "Dashboard", href: "/user/dashboard" },
    { title: "Profil", href: "/user/profil" },
    { title: "Produk", href: "/user/produk" },
    { title: "Lokasi", href: "/user/lokasi-penjualan" },
    { title: "Laporan", href: "/user/laporan-penjualan" },
    { title: "Statistik", href: "/user/statistik" },
  ];

  const handleLogout = () => {
    setLogout();
    router.push("/login");
  };

  const isActive = (href: string) => {
    return pathname === href;
  };

  return (
    <div className="navbar bg-base-100 border-b border-base-300">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <BiMenu className="h-6 w-6" />
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href}
                  className={isActive(item.href) ? "active" : ""}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <Link
          href="/user/dashboard"
          className="btn btn-ghost normal-case text-xl"
        >
          UMKM Dashboard
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                className={isActive(item.href) ? "active" : ""}
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="navbar-end">
        <button onClick={handleLogout} className="btn btn-ghost text-error">
          <BiLogOut className="h-5 w-5 mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserNavbar;
