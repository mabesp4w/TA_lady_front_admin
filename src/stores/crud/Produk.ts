/** @format */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { crud } from "@/services/baseURL";
import { ProdukType } from "@/types";

type Props = {
  page?: number;
  limit?: number;
  search?: string;
  sortby?: string;
  order?: string;
  kategori_produk_id?: string;
  tersedia?: boolean;
};

type Store = {
  dtProduk: {
    last_page: number;
    current_page: number;
    data: ProdukType[];
  };

  availableProducts: ProdukType[];

  showProduk: ProdukType | null;

  setProduk: ({
    page,
    limit,
    search,
    sortby,
    order,
    kategori_produk_id,
    tersedia,
  }: Props) => Promise<{
    status: string;
    data?: object;
    error?: object;
  }>;

  setShowProduk: (id: number | string) => Promise<{
    status: string;
    data?: object;
    error?: object;
  }>;

  getAvailableProducts: (kategori_produk_id?: string) => Promise<{
    status: string;
    data?: ProdukType[];
    error?: object;
  }>;

  addData: (
    data: FormData
  ) => Promise<{ status: string; data?: any; error?: any }>;

  removeData: (
    id: number | string
  ) => Promise<{ status: string; data?: any; error?: any }>;

  updateData: (
    id: number | string,
    data: FormData
  ) => Promise<{ status: string; data?: any; error?: any }>;

  updateStock: (
    id: number | string,
    jumlah_stok: number,
    operation: "set" | "add" | "subtract"
  ) => Promise<{ status: string; data?: any; error?: any }>;
};

const useProduk = create(
  devtools<Store>((set, get) => ({
    dtProduk: {
      last_page: 0,
      current_page: 0,
      data: [],
    },
    availableProducts: [],
    showProduk: null,

    setProduk: async ({
      page = 1,
      limit = 10,
      search,
      sortby,
      order,
      kategori_produk_id,
      tersedia,
    }) => {
      try {
        const response = await crud({
          method: "get",
          url: `/produk`,
          params: {
            limit,
            page,
            search,
            sortby,
            order,
            kategori_produk_id,
            tersedia,
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

    setShowProduk: async (id) => {
      try {
        const response = await crud({
          method: "get",
          url: `/produk/${id}`,
          headers: { "Content-Type": "application/json" },
        });

        if (response.data && response.data.data) {
          set((state) => ({
            ...state,
            showProduk: response.data.data,
          }));
          return {
            status: "berhasil",
            data: response.data,
          };
        } else {
          console.error("Data produk tidak lengkap:", response.data);
          return {
            status: "error",
            error: { message: "Data produk tidak lengkap" },
          };
        }
      } catch (error: any) {
        console.error("Error fetching produk:", error);
        return {
          status: "error",
          error: error.response?.data,
        };
      }
    },

    getAvailableProducts: async (kategori_produk_id) => {
      try {
        const response = await crud({
          method: "get",
          url: `/produk/available`,
          headers: { "Content-Type": "application/json" },
          params: {
            kategori_produk_id,
          },
        });
        set((state) => ({
          ...state,
          availableProducts: response.data.data,
        }));
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

    addData: async (formData) => {
      try {
        const res = await crud({
          method: "post",
          url: `/produk`,
          headers: {
            "Content-Type": "multipart/form-data",
          },
          data: formData,
        });
        get().setProduk({});
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
          url: `/produk/${id}`,
          headers: { "Content-Type": "application/json" },
        });
        set((prevState) => ({
          dtProduk: {
            last_page: prevState.dtProduk.last_page,
            current_page: prevState.dtProduk.current_page,
            data: prevState.dtProduk.data.filter((item: any) => item.id !== id),
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

    updateData: async (id, formData) => {
      try {
        const response = await crud({
          method: "POST",
          url: `/produk/${id}?_method=PUT`,
          headers: {
            "Content-Type": "multipart/form-data",
          },
          data: formData,
        });
        get().setProduk({});
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

    updateStock: async (id, jumlah_stok, operation) => {
      try {
        const response = await crud({
          method: "POST",
          url: `/produk/${id}/stock`,
          headers: {
            "Content-Type": "application/json",
          },
          data: {
            jumlah_stok,
            operation,
          },
        });
        get().setProduk({});
        return {
          status: "berhasil update stok",
          data: response.data,
        };
      } catch (error: any) {
        return {
          status: "error",
          data: error.response.data,
        };
      }
    },
  }))
);

export default useProduk;
