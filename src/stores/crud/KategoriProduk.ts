/** @format */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { crud } from "@/services/baseURL";
import { KategoriProdukType } from "@/types";

type Props = {
  page?: number;
  limit?: number;
  search?: string;
  sortby?: string;
  order?: string;
};

type Store = {
  dtKategoriProduk: {
    last_page: number;
    current_page: number;
    data: KategoriProdukType[];
  };

  showKategoriProduk: KategoriProdukType | null;

  setKategoriProduk: ({
    page,
    limit,
    search,
    sortby,
    order,
  }: Props) => Promise<{
    status: string;
    data?: object;
    error?: object;
  }>;

  setShowKategoriProduk: (id: number | string) => Promise<{
    status: string;
    data?: object;
    error?: object;
  }>;

  addData: (
    data: KategoriProdukType
  ) => Promise<{ status: string; data?: any; error?: any }>;

  removeData: (
    id: number | string
  ) => Promise<{ status: string; data?: any; error?: any }>;

  updateData: (
    id: number | string,
    data: KategoriProdukType
  ) => Promise<{ status: string; data?: any; error?: any }>;

  getAllKategoriProduk: () => Promise<{
    status: string;
    data?: KategoriProdukType[];
    error?: any;
  }>;
};

const useKategoriProduk = create(
  devtools<Store>((set) => ({
    dtKategoriProduk: {
      last_page: 0,
      current_page: 0,
      data: [],
    },
    showKategoriProduk: null,

    setKategoriProduk: async ({
      page = 1,
      limit = 10,
      search,
      sortby,
      order,
    }) => {
      try {
        const response = await crud({
          method: "get",
          url: `/kategori-produk/`,
          params: {
            limit,
            page,
            search,
            sortby,
            order,
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

    setShowKategoriProduk: async (id) => {
      try {
        const response = await crud({
          method: "get",
          url: `/kategori-produk/${id}/`,
        });
        set((state) => ({
          ...state,
          showKategoriProduk: response.data.data,
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

    addData: async (row) => {
      try {
        const res = await crud({
          method: "post",
          url: `/kategori-produk/`,
          data: row,
        });
        set((prevState) => ({
          dtKategoriProduk: {
            last_page: prevState.dtKategoriProduk.last_page,
            current_page: prevState.dtKategoriProduk.current_page,
            data: [res.data.data, ...prevState.dtKategoriProduk.data],
          },
        }));
        return {
          status: "berhasil tambah",
          data: res.data,
        };
      } catch (error: any) {
        return {
          status: "error",
          data: error.response.data,
        };
      }
    },

    removeData: async (id) => {
      try {
        const res = await crud({
          method: "delete",
          url: `/kategori-produk/${id}/`,
        });
        set((prevState) => ({
          dtKategoriProduk: {
            last_page: prevState.dtKategoriProduk.last_page,
            current_page: prevState.dtKategoriProduk.current_page,
            data: prevState.dtKategoriProduk.data.filter(
              (item: any) => item.id !== id
            ),
          },
        }));
        return {
          status: "berhasil hapus",
          data: res.data,
        };
      } catch (error: any) {
        return {
          status: "error",
          data: error.response.data,
        };
      }
    },

    updateData: async (id, row) => {
      try {
        const response = await crud({
          method: "PUT",
          url: `/kategori-produk/${id}/`,
          data: row,
        });
        set((prevState) => ({
          dtKategoriProduk: {
            last_page: prevState.dtKategoriProduk.last_page,
            current_page: prevState.dtKategoriProduk.current_page,
            data: prevState.dtKategoriProduk.data.map((item: any) => {
              if (item.id === id) {
                return {
                  ...item,
                  ...response.data.data,
                };
              } else {
                return item;
              }
            }),
          },
        }));
        return {
          status: "berhasil update",
          data: response.data,
        };
      } catch (error: any) {
        return {
          status: "error",
          data: error.response.data,
        };
      }
    },

    getAllKategoriProduk: async () => {
      try {
        const response = await crud({
          method: "get",
          url: `/kategori-produk/all-categories/`,
        });
        return {
          status: "berhasil",
          data: response.data.data,
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

export default useKategoriProduk;
