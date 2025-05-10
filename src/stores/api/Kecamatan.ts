/** @format */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { api } from "@/services/baseURL";
import useLogin from "../auth/login";
import { KecamatanType } from "@/types";
// kecamatan
type Store = {
  dtKecamatan: KecamatanType[];

  setKecamatan: () => Promise<{
    status: string;
    data?: any;
    error?: any;
  }>;
};

const useKecamatanApi = create(
  devtools<Store>((set) => ({
    dtKecamatan: [],

    setKecamatan: async () => {
      const token = await useLogin.getState().setToken();
      try {
        const response = await api({
          method: "get",
          url: `/kecamatan/`,
          headers: { Authorization: `Bearer ${token}` },
        });
        set((state) => ({
          ...state,
          dtKecamatan: response.data,
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

export default useKecamatanApi;
