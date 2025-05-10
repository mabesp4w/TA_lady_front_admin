/** @format */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { api } from "@/services/baseURL";
import useLogin from "../auth/login";
import { LokasiPenjualanType } from "@/types";
// lokasiPenjualan
type Store = {
  dtLokasiPenjualan: LokasiPenjualanType[];

  setLokasiPenjualan: () => Promise<{
    status: string;
    data?: any;
    error?: any;
  }>;
};

const useLokasiPenjualanApi = create(
  devtools<Store>((set) => ({
    dtLokasiPenjualan: [],

    setLokasiPenjualan: async () => {
      const token = await useLogin.getState().setToken();
      try {
        const response = await api({
          method: "get",
          url: `/lokasi-penjualan/`,
          headers: { Authorization: `Bearer ${token}` },
        });
        set((state) => ({
          ...state,
          dtLokasiPenjualan: response.data,
        }));
        return {
          status: "berhasil",
          data: response.data,
        };
      } catch (error: any) {
        return {
          status: "error",
          error: error.response?.data,
        };
      }
    },
  }))
);

export default useLokasiPenjualanApi;
