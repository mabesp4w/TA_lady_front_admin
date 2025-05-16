/** @format */

"use client";
import React, { useEffect, useState } from "react";
import handleLogout from "./logout";
import { useRouter } from "next/navigation";
import useLogout from "@/stores/auth/logout";

const Logoutpage = () => {
  const router = useRouter();
  const { setLogout } = useLogout();
  const [loadLogout, setLoadLogout] = useState<boolean>(false);

  useEffect(() => {
    handleLogout({ router, setLogout, setLoadLogout });
  }, []);
  return (
    <div>
      {loadLogout && (
        <div className="flex absolute inset-0 bg-white min-h-screen h-screen justify-center items-center z-50">
          <span className="loading loading-dots loading-lg"></span>
        </div>
      )}
    </div>
  );
};

export default Logoutpage;
