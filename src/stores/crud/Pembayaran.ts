/** @format */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { crud } from "@/services/baseURL";
import { PembayaranType } from "@/types";

type Props = {
  page?: number;
  limit?: number;
  search?: string;
  sortby?: string;
  order?: string;
  jenis_pembayaran?: string;
  metode_pembayaran?: string;
  status?: string;
};

type StatisticsParams = {
  bulan?: string;
  tahun?: string;
};

type Store = {
  dtPembayaran: {
    last_page: number;
    current_page: number;
    data: PembayaranType[];
  };

  showPembayaran: PembayaranType | null;

  paymentStatistics: any;

  setPembayaran: ({
    page,
    limit,
    search,
    sortby,
    order,
    jenis_pembayaran,
    metode_pembayaran,
    status,
  }: Props) => Promise<{
    status: string;
    data?: object;
    error?: object;
  }>;

  setShowPembayaran: (id: number | string) => Promise<{
    status: string;
    data?: object;
    error?: object;
  }>;

  getUserPaymentHistory: () => Promise<{
    status: string;
    data?: PembayaranType[];
    error?: object;
  }>;

  addData: (
    data: Partial<PembayaranType>
  ) => Promise<{ status: string; data?: any; error?: any }>;

  removeData: (
    id: number | string
  ) => Promise<{ status: string; data?: any; error?: any }>;

  updateData: (
    id: number | string,
    data: { status: string; detail_pembayaran?: Record<string, any> }
  ) => Promise<{ status: string; data?: any; error?: any }>;

  checkPaymentStatus: (
    referenceId: string
  ) => Promise<{ status: string; data?: any; error?: any }>;

  generateReceipt: (
    id: number | string
  ) => Promise<{ status: string; data?: any; error?: any }>;

  getPaymentStatistics: (
    params: StatisticsParams
  ) => Promise<{ status: string; data?: any; error?: any }>;

  createMidtransPayment: (data: {
    jenis_pembayaran: string;
    id_referensi: string;
  }) => Promise<{ status: string; data?: any; error?: any }>;
};

const usePembayaran = create(
  devtools<Store>((set, get) => ({
    dtPembayaran: {
      last_page: 0,
      current_page: 0,
      data: [],
    },
    showPembayaran: null,
    paymentStatistics: null,

    setPembayaran: async ({
      page = 1,
      limit = 10,
      search,
      sortby,
      order,
      jenis_pembayaran,
      metode_pembayaran,
      status,
    }) => {
      try {
        const response = await crud({
          method: "get",
          url: `/pembayaran`,
          params: {
            limit,
            page,
            search,
            sortby,
            order,
            jenis_pembayaran,
            metode_pembayaran,
            status,
          },
        });

        set((state) => ({
          ...state,
          dtPembayaran: response.data.data,
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

    setShowPembayaran: async (id) => {
      try {
        const response = await crud({
          method: "get",
          url: `/pembayaran/${id}/`,
        });

        if (response.data && response.data.data) {
          set((state) => ({
            ...state,
            showPembayaran: response.data.data,
          }));
          return {
            status: "berhasil",
            data: response.data,
          };
        } else {
          console.error("Data pembayaran tidak lengkap:", response.data);
          return {
            status: "error",
            error: { message: "Data pembayaran tidak lengkap" },
          };
        }
      } catch (error: any) {
        console.error("Error fetching pembayaran:", error);
        return {
          status: "error",
          error: error.response?.data,
        };
      }
    },

    getUserPaymentHistory: async () => {
      try {
        const response = await crud({
          method: "get",
          url: `/pembayaran/history`,
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

    addData: async (data) => {
      try {
        const res = await crud({
          method: "post",
          url: `/pembayaran/`,
          data: data,
        });
        get().setPembayaran({});
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
          url: `/pembayaran/${id}/`,
        });
        set((prevState) => ({
          dtPembayaran: {
            last_page: prevState.dtPembayaran.last_page,
            current_page: prevState.dtPembayaran.current_page,
            data: prevState.dtPembayaran.data.filter(
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
          url: `/pembayaran/${id}/`,
          data: data,
        });
        get().setPembayaran({});
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

    checkPaymentStatus: async (referenceId) => {
      try {
        const response = await crud({
          method: "get",
          url: `/pembayaran/check-status/${referenceId}`,
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

    generateReceipt: async (id) => {
      try {
        const response = await crud({
          method: "get",
          url: `/pembayaran/${id}/receipt`,
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

    getPaymentStatistics: async (params) => {
      try {
        const response = await crud({
          method: "get",
          url: `/pembayaran/statistics`,
          params: params,
        });

        set((state) => ({
          ...state,
          paymentStatistics: response.data.data,
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

    createMidtransPayment: async (data) => {
      try {
        const response = await crud({
          method: "post",
          url: `/pembayaran/midtrans/create`,
          data: data,
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

export default usePembayaran;
