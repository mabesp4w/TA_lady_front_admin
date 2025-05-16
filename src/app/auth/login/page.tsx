/** @format */
"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import useLogin from "@/stores/auth/login";
import InputText from "@/components/input/InputText";
import { FaLock } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";

type LoginFormValues = {
  email: string;
  password: string;
};

const AdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const { setLogin } = useLogin();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>();

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);

    try {
      const response = await setLogin(data);

      if (response.status === "success") {
        // Set token in cookies (10 hours expiry matching backend)
        Cookies.set("token", response.data.token, { expires: 7 });

        // Store user role if needed
        if (response.data.role === "admin") {
          // Show success toast
          toast.success("Login berhasil!");

          // Redirect to admin dashboard
          router.push("/");
        } else {
          toast.error("Anda tidak memiliki akses admin");
        }
      } else {
        // Handle error from API response
        toast.error(
          response.error?.message || "Kombinasi email dan password salah"
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan, silakan coba lagi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-1 bg-cover bg-center">
      <div className="flex items-center justify-center h-full grow bg-black/50 backdrop-blur-sm">
        <div className="bg-white/50 p-8 rounded-lg shadow-lg w-full max-w-md">
          {/* Logo */}
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
            Admin Login
          </h1>
          <p className="text-center text-gray-600 mb-6">Resort Terminal 12</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                <MdOutlineEmail size={20} />
              </div>

              <InputText
                name="email"
                type="email"
                placeholder="Email"
                register={register}
                required={true}
                errors={errors.email}
                addClass="mb-1"
                autoComplete="email"
              />
            </div>

            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                <FaLock size={18} />
              </div>

              <InputText
                name="password"
                type="password"
                placeholder="Password"
                register={register}
                required={true}
                errors={errors.password}
                addClass="mb-1"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md transition-colors duration-300 mt-3"
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm mr-2"></span>
              ) : null}
              {loading ? "Memproses..." : "Login"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              © {new Date().getFullYear()} Resort Terminal 12. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
