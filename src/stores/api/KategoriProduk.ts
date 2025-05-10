/** @format */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { api } from "@/services/baseURL";
import useLogin from "../auth/login";
import { KategoriProdukType } from "@/types";

type Store = {
  dtKategori: KategoriProdukType[];

  setKategori: () => Promise<{
    status: string;
    data?: any;
    error?: any;
  }>;
};

const useKategoriApi = create(
  devtools<Store>((set) => ({
    dtKategori: [],

    setKategori: async () => {
      const token = await useLogin.getState().setToken();
      try {
        const response = await api({
          method: "get",
          url: `/kategori-produk/`,
          headers: { Authorization: `Bearer ${token}` },
        });
        set((state) => ({
          ...state,
          dtKategori: response.data,
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

export default useKategoriApi;
