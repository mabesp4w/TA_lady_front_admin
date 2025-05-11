/** @format */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { crud } from "@/services/baseURL";
import useLogin from "../auth/login";
import { PemesananFasilitasType } from "@/types";

type Props = {
  page?: number;
  limit?: number;
  search?: string;
  sortby?: string;
  order?: string;
  status?: string;
  user_id?: string | number;
  tanggal_awal?: string;
  tanggal_akhir?: string;
  fasilitas_id?: string | number;
};

type Store = {
  dtPemesanan: {
    last_page: number;
    current_page: number;
    data: PemesananFasilitasType[];
  };

  showPemesanan: PemesananFasilitasType | null;

  setPemesanan: ({
    page,
    limit,
    search,
    sortby,
    order,
    status,
    user_id,
    tanggal_awal,
    tanggal_akhir,
    fasilitas_id,
  }: Props) => Promise<{
    status: string;
    data?: object;
    error?: object;
  }>;

  getAllBookings: ({
    page,
    limit,
    search,
    sortby,
    order,
    status,
    tanggal_awal,
    tanggal_akhir,
    fasilitas_id,
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

  getPemesananByCode: (code: string) => Promise<{
    status: string;
    data?: PemesananFasilitasType;
    error?: object;
  }>;

  addData: (
    data: PemesananFasilitasType
  ) => Promise<{ status: string; data?: any; error?: any }>;

  removeData: (
    id: number | string
  ) => Promise<{ status: string; data?: any; error?: any }>;

  updateData: (
    id: number | string,
    data: Partial<PemesananFasilitasType>
  ) => Promise<{ status: string; data?: any; error?: any }>;

  changeStatus: (
    id: number | string,
    status: string
  ) => Promise<{ status: string; data?: any; error?: any }>;

  getStatistics: (
    bulan?: string | number,
    tahun?: string | number
  ) => Promise<{ status: string; data?: any; error?: any }>;
};

const usePemesananFasilitas = create(
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
      const token = await useLogin.getState().setToken();
      try {
        const response = await crud({
          method: "get",
          url: `/pemesanan-fasilitas/`,
          headers: { Authorization: `Bearer ${token}` },
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

    getAllBookings: async ({
      page = 1,
      limit = 10,
      search,
      sortby,
      order,
      status,
      tanggal_awal,
      tanggal_akhir,
      fasilitas_id,
    }) => {
      const token = await useLogin.getState().setToken();
      try {
        const response = await crud({
          method: "get",
          url: `/pemesanan-fasilitas/admin/bookings`,
          headers: { Authorization: `Bearer ${token}` },
          params: {
            limit,
            page,
            search,
            sortby,
            order,
            status,
            tanggal_awal,
            tanggal_akhir,
            fasilitas_id,
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
      const token = await useLogin.getState().setToken();
      try {
        const response = await crud({
          method: "get",
          url: `/pemesanan-fasilitas/${id}/`,
          headers: { Authorization: `Bearer ${token}` },
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

    getPemesananByCode: async (code) => {
      const token = await useLogin.getState().setToken();
      try {
        const response = await crud({
          method: "get",
          url: `/pemesanan-fasilitas/code/${code}`,
          headers: { Authorization: `Bearer ${token}` },
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

    addData: async (data) => {
      const token = await useLogin.getState().setToken();
      try {
        const res = await crud({
          method: "post",
          url: `/pemesanan-fasilitas/`,
          headers: {
            Authorization: `Bearer ${token}`,
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
      const token = await useLogin.getState().setToken();
      try {
        const res = await crud({
          method: "delete",
          url: `/pemesanan-fasilitas/${id}/`,
          headers: { Authorization: `Bearer ${token}` },
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
      const token = await useLogin.getState().setToken();
      try {
        const response = await crud({
          method: "PUT",
          url: `/pemesanan-fasilitas/${id}/`,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          data,
        });
        get().setPemesanan({});
        get().setShowPemesanan(id);
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

    changeStatus: async (id, status) => {
      const token = await useLogin.getState().setToken();
      try {
        const response = await crud({
          method: "POST",
          url: `/pemesanan-fasilitas/${id}/change-status`,
          headers: {
            Authorization: `Bearer ${token}`,
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

    getStatistics: async (bulan = "", tahun = "") => {
      const token = await useLogin.getState().setToken();
      try {
        const response = await crud({
          method: "GET",
          url: `/pemesanan-fasilitas/statistics`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            bulan,
            tahun,
          },
        });
        return {
          status: "berhasil",
          data: response.data.data,
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

export default usePemesananFasilitas;
