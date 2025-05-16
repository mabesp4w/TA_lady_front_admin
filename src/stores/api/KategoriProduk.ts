/** @format */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { api } from "@/services/baseURL";
import { KategoriProdukType } from "@/types";
// kategoriProduk
type Props = {
  page?: number;
  limit?: number;
  search?: string;
  sortby?: string;
  order?: string;
  paginate?: boolean;
};

type Store = {
  dtKategoriProduk: KategoriProdukType[];

  setKategoriProduk: ({
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

const useKategoriProdukApi = create(
  devtools<Store>((set) => ({
    dtKategoriProduk: [],

    setKategoriProduk: async ({
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
          url: `/kategori-produk`,
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
          dtKategoriProduk: response.data.data,
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

export default useKategoriProdukApi;
