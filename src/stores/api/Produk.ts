/** @format */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { api } from "@/services/baseURL";
import { ProdukType } from "@/types";
// fasilitas
type Props = {
  page?: number;
  limit?: number;
  search?: string;
  sortby?: string;
  order?: string;
  paginate?: boolean;
};

type Store = {
  dtProduk: ProdukType[];

  setProduk: ({
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

const useProdukApi = create(
  devtools<Store>((set) => ({
    dtProduk: [],

    setProduk: async ({
      page,
      limit,
      search,
      sortby,
      order,
      paginate = false,
    }: Props) => {
      try {
        const response = await api({
          method: "get",
          url: `/products/`,
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
          dtProduk: response.data.data,
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

export default useProdukApi;
