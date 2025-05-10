/** @format */

"use client";
import UserMenu from "@/components/menu/UserMenu";

const UserSidebar = () => {
  return (
    <aside className="w-64 min-h-screen bg-base-100 border-r border-base-300">
      <UserMenu />
    </aside>
  );
};

export default UserSidebar;
