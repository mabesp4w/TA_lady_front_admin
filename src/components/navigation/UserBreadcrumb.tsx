/** @format */

"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BiHome } from "react-icons/bi";

const UserBreadcrumb = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter((segment) => segment);

  // Map untuk menerjemahkan URL ke label yang user-friendly
  const labelMap: Record<string, string> = {
    user: "User",
    dashboard: "Dashboard",
    profil: "Profil Bisnis",
    produk: "Produk",
    "lokasi-penjualan": "Lokasi Penjualan",
    "laporan-penjualan": "Laporan Penjualan",
    statistik: "Statistik",
  };

  return (
    <div className="text-sm breadcrumbs mb-4">
      <ul>
        <li>
          <Link href="/" className="flex items-center gap-1">
            <BiHome className="h-4 w-4" />
            Home
          </Link>
        </li>
        {pathSegments.slice(1).map((segment, index) => {
          const path = "/" + pathSegments.slice(1, index + 2).join("/");
          const isLast = index === pathSegments.length - 2;
          const label = labelMap[segment] || segment;

          return (
            <li key={index}>
              {isLast ? <span>{label}</span> : <Link href={path}>{label}</Link>}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default UserBreadcrumb;
