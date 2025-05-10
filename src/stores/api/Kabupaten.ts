/** @format */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { api } from "@/services/baseURL";
import useLogin from "../auth/login";
import { KabupatenType } from "@/types";
// kabupaten
type Store = {
  dtKabupaten: KabupatenType[];

  setKabupaten: () => Promise<{
    status: string;
    data?: any;
    error?: any;
  }>;
};

const useKabupatenApi = create(
  devtools<Store>((set) => ({
    dtKabupaten: [],

    setKabupaten: async () => {
      const token = await useLogin.getState().setToken();
      try {
        const response = await api({
          method: "get",
          url: `/kabupaten/`,
          headers: { Authorization: `Bearer ${token}` },
        });
        set((state) => ({
          ...state,
          dtKabupaten: response.data,
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

export default useKabupatenApi;
