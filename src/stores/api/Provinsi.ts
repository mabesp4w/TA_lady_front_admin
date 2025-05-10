/** @format */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { api } from "@/services/baseURL";
import useLogin from "../auth/login";
import { ProvinsiType } from "@/types";
// provinsi
type Store = {
  dtProvinsi: ProvinsiType[];

  setProvinsi: () => Promise<{
    status: string;
    data?: any;
    error?: any;
  }>;
};

const useProvinsiApi = create(
  devtools<Store>((set) => ({
    dtProvinsi: [],

    setProvinsi: async () => {
      const token = await useLogin.getState().setToken();
      try {
        const response = await api({
          method: "get",
          url: `/provinsi/`,
          headers: { Authorization: `Bearer ${token}` },
        });
        set((state) => ({
          ...state,
          dtProvinsi: response.data,
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

export default useProvinsiApi;
