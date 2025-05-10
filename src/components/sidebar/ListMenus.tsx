/** @format */

import MenuType from "@/types/MenuType";
import { BriefcaseBusinessIcon, FlashlightIcon, Home } from "lucide-react";
import { BiCategory } from "react-icons/bi";

const adminUrl = (path: string) => `${path}`;

const setAdminMenus = () => {
  const ListMenu: MenuType[] = [
    {
      name: "Dashboard",
      href: adminUrl("/dashboard"),
      icon: <Home />,
    },
    {
      name: "Kategori Produk",
      href: adminUrl("/kategori-produk"),
      icon: <BiCategory />,
    },
    {
      name: "Fasilitas",
      href: adminUrl("/fasilitas"),
      icon: <FlashlightIcon />,
    },
    {
      name: "UMKM",
      href: adminUrl("/umkm"),
      icon: <BriefcaseBusinessIcon />,
      slug: "umkm",
      subMenus: [
        {
          name: "Akun",
          href: adminUrl("/umkm/akun"),
        },
        {
          name: "Profile",
          href: adminUrl("/umkm/profile"),
        },
        {
          name: "Lokasi",
          href: adminUrl("/umkm/pemetaan-umkm"),
        },
      ],
    },
  ];

  return ListMenu;
};

export { setAdminMenus };
