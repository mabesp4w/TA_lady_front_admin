/** @format */
"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useLogin from "@/stores/auth/login";

const Auth = () => {
  // state
  const [isLoading, setIsLoading] = useState(true);
  // pathname
  const pathname = usePathname();
  // get pathname[0]
  const path = pathname.split("/")[1];
  // router
  const router = useRouter();
  const { cekToken } = useLogin();
  const getCek = async () => {
    const res = await cekToken();
    console.log("res", res);
    if (res?.error) {
      // redirect to login
      router.push("/auth/login");
      return;
    }
    if (path === "admin" && res?.data?.role !== "admin") {
      setIsLoading(true);
      // redirect to user
      router.push("/");
      setIsLoading(false);
      return;
    }
    if (path === "" && res?.data?.role !== "umkm") {
      setIsLoading(true);
      // redirect to admin
      router.push("/admin/dashboard");
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getCek();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const loadData = async () => {
    await getCek();
  };

  useEffect(() => {
    loadData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
      <div className="flex absolute inset-0 bg-white min-h-screen h-screen justify-center items-center z-50">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );
  }
};

export default Auth;
