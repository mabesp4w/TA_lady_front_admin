/** @format */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { api } from "@/services/baseURL";
import useLogin from "../auth/login";
import { JenisKamarType } from "@/types";
// jenisKamar
type Props = {
  page?: number;
  limit?: number;
  search?: string;
  sortby?: string;
  order?: string;
  paginate?: boolean;
};

type Store = {
  dtJenisKamar: JenisKamarType[];

  setJenisKamar: ({
    page,
    limit,
    search,
    sortby,
    order,
    paginate,
  }: Props) => Promise<{
    status: string;
    data?: any;
    error?: any;
  }>;
};

const useJenisKamarApi = create(
  devtools<Store>((set) => ({
    dtJenisKamar: [],

    setJenisKamar: async ({
      page,
      limit,
      search,
      sortby,
      order,
      paginate = false,
    }: Props) => {
      const token = await useLogin.getState().setToken();
      try {
        const response = await api({
          method: "get",
          url: `/jenis-kamar/`,
          headers: { Authorization: `Bearer ${token}` },
          params: {
            limit,
            page,
            search,
            sortby,
            order,
            paginate,
          },
        });
        set((state) => ({
          ...state,
          dtJenisKamar: response.data.data,
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

export default useJenisKamarApi;
