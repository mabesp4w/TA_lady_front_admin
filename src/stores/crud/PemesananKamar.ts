/** @format */
// store/crud/pemesananKamar
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { crud } from "@/services/baseURL";
import { PemesananKamarType } from "@/types";

type Props = {
  page?: number;
  limit?: number;
  search?: string;
  sortby?: string;
  order?: string;
  status?: string;
  user_id?: string | number;
};

type Store = {
  dtPemesanan: {
    last_page: number;
    current_page: number;
    data: PemesananKamarType[];
  };

  showPemesanan: PemesananKamarType | null;

  setPemesanan: ({
    page,
    limit,
    search,
    sortby,
    order,
    status,
    user_id,
  }: Props) => Promise<{
    status: string;
    data?: object;
    error?: object;
  }>;

  setShowPemesanan: (id: number | string) => Promise<{
    status: string;
    data?: object;
    error?: object;
  }>;

  addData: (
    data: PemesananKamarType
  ) => Promise<{ status: string; data?: any; error?: any }>;

  removeData: (
    id: number | string
  ) => Promise<{ status: string; data?: any; error?: any }>;

  updateData: (
    id: number | string,
    data: PemesananKamarType
  ) => Promise<{ status: string; data?: any; error?: any }>;

  updateStatus: (
    id: number | string,
    status: string
  ) => Promise<{ status: string; data?: any; error?: any }>;

  processPayment: (
    id: number | string,
    metode_pembayaran: string
  ) => Promise<{ status: string; data?: any; error?: any }>;

  getPemesananByCode: (
    code: string
  ) => Promise<{ status: string; data?: any; error?: any }>;
};

const usePemesananKamar = create(
  devtools<Store>((set, get) => ({
    dtPemesanan: {
      last_page: 0,
      current_page: 0,
      data: [],
    },
    showPemesanan: null,

    setPemesanan: async ({
      page = 1,
      limit = 10,
      search,
      sortby,
      order,
      status,
      user_id,
    }) => {
      try {
        const response = await crud({
          method: "get",
          url: `/pemesanan-kamar/`,
          headers: { "Content-Type": "application/json" },
          params: {
            limit,
            page,
            search,
            sortby,
            order,
            status,
            user_id,
          },
        });

        set((state) => ({
          ...state,
          dtPemesanan: response.data.data,
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

    setShowPemesanan: async (id) => {
      try {
        const response = await crud({
          method: "get",
          url: `/pemesanan-kamar/${id}/`,
          headers: { "Content-Type": "application/json" },
        });

        if (response.data && response.data.data) {
          set((state) => ({
            ...state,
            showPemesanan: response.data.data,
          }));
          return {
            status: "berhasil",
            data: response.data,
          };
        } else {
          console.error("Data pemesanan tidak lengkap:", response.data);
          return {
            status: "error",
            error: { message: "Data pemesanan tidak lengkap" },
          };
        }
      } catch (error: any) {
        console.error("Error fetching pemesanan:", error);
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
          url: `/pemesanan-kamar/`,
          headers: {
            "Content-Type": "application/json",
          },
          data,
        });
        get().setPemesanan({});
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
          url: `/pemesanan-kamar/${id}/`,
          headers: { "Content-Type": "application/json" },
        });
        set((prevState) => ({
          dtPemesanan: {
            last_page: prevState.dtPemesanan.last_page,
            current_page: prevState.dtPemesanan.current_page,
            data: prevState.dtPemesanan.data.filter(
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
          method: "PUT",
          url: `/pemesanan-kamar/${id}/`,
          headers: {
            "Content-Type": "application/json",
          },
          data,
        });
        get().setPemesanan({});
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
          method: "POST",
          url: `/pemesanan-kamar/${id}/update-status`,
          headers: {
            "Content-Type": "application/json",
          },
          data: { status },
        });
        get().setPemesanan({});
        get().setShowPemesanan(id);
        return {
          status: "berhasil update status",
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
          method: "POST",
          url: `/pemesanan-kamar/${id}/process-payment`,
          headers: {
            "Content-Type": "application/json",
          },
          data: { metode_pembayaran },
        });
        get().setPemesanan({});
        get().setShowPemesanan(id);
        return {
          status: "berhasil proses pembayaran",
          data: response.data,
        };
      } catch (error: any) {
        return {
          status: "error",
          data: error.response.data,
        };
      }
    },

    getPemesananByCode: async (code: string) => {
      try {
        const response = await crud({
          method: "get",
          url: `/pemesanan-kamar/code/${code}`,
          headers: { "Content-Type": "application/json" },
        });

        if (response.data && response.data.data) {
          return {
            status: "berhasil",
            data: response.data.data,
          };
        } else {
          return {
            status: "error",
            error: { message: "Data pemesanan tidak ditemukan" },
          };
        }
      } catch (error: any) {
        return {
          status: "error",
          error: error.response?.data,
        };
      }
    },
  }))
);

export default usePemesananKamar;
