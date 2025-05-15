/** @format */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { crud } from "@/services/baseURL";
import { PesananType } from "@/types";

type Props = {
  page?: number;
  limit?: number;
  search?: string;
  sortby?: string;
  order?: string;
  status?: string;
  jenis_pesanan?: string;
  user_id?: string;
};

type Store = {
  dtPesanan: {
    last_page: number;
    current_page: number;
    data: PesananType[];
  };

  showPesanan: PesananType | null;

  setPesanan: ({
    page,
    limit,
    search,
    sortby,
    order,
    status,
    jenis_pesanan,
    user_id,
  }: Props) => Promise<{
    status: string;
    data?: object;
    error?: object;
  }>;

  setShowPesanan: (id: number | string) => Promise<{
    status: string;
    data?: object;
    error?: object;
  }>;

  addData: (
    data: PesananType
  ) => Promise<{ status: string; data?: any; error?: any }>;

  removeData: (
    id: number | string
  ) => Promise<{ status: string; data?: any; error?: any }>;

  updateData: (
    id: number | string,
    data: Partial<PesananType>
  ) => Promise<{ status: string; data?: any; error?: any }>;

  updateStatus: (
    id: number | string,
    status: string
  ) => Promise<{ status: string; data?: any; error?: any }>;

  processPayment: (
    id: number | string,
    metode_pembayaran: string
  ) => Promise<{ status: string; data?: any; error?: any }>;
};

const usePesanan = create(
  devtools<Store>((set, get) => ({
    dtPesanan: {
      last_page: 0,
      current_page: 0,
      data: [],
    },
    showPesanan: null,

    setPesanan: async ({
      page = 1,
      limit = 10,
      search,
      sortby,
      order,
      status,
      jenis_pesanan,
      user_id,
    }) => {
      try {
        const response = await crud({
          method: "get",
          url: `/pesanan`,
          params: {
            limit,
            page,
            search,
            sortby,
            order,
            status,
            jenis_pesanan,
            user_id,
          },
        });

        set((state) => ({
          ...state,
          dtPesanan: response.data.data,
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

    setShowPesanan: async (id) => {
      try {
        const response = await crud({
          method: "get",
          url: `/pesanan/${id}/`,
        });

        if (response.data && response.data.data) {
          set((state) => ({
            ...state,
            showPesanan: response.data.data,
          }));
          return {
            status: "berhasil",
            data: response.data,
          };
        } else {
          console.error("Data pesanan tidak lengkap:", response.data);
          return {
            status: "error",
            error: { message: "Data pesanan tidak lengkap" },
          };
        }
      } catch (error: any) {
        console.error("Error fetching pesanan:", error);
        return {
          status: "error",
          error: error.response?.data,
        };
      }
    },

    addData: async (data) => {
      try {
        const res = await crud({
          method: "post",
          url: `/pesanan/`,
          data: data,
        });
        get().setPesanan({});
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
          url: `/pesanan/${id}/`,
        });
        set((prevState) => ({
          dtPesanan: {
            last_page: prevState.dtPesanan.last_page,
            current_page: prevState.dtPesanan.current_page,
            data: prevState.dtPesanan.data.filter(
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

    updateData: async (id, data) => {
      try {
        const response = await crud({
          method: "put",
          url: `/pesanan/${id}/`,
          data: data,
        });
        get().setPesanan({});
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

    updateStatus: async (id, status) => {
      try {
        const response = await crud({
          method: "post",
          url: `/pesanan/${id}/update-status`,
          data: { status },
        });
        get().setPesanan({});
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

    processPayment: async (id, metode_pembayaran) => {
      try {
        const response = await crud({
          method: "post",
          url: `/pesanan/${id}/process-payment`,
          data: { metode_pembayaran },
        });
        get().setPesanan({});
        return {
          status: "berhasil",
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

export default usePesanan;
