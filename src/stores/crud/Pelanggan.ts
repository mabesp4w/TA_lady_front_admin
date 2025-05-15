/** @format */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { crud } from "@/services/baseURL";
import { PelangganType } from "@/types";

type Props = {
  page?: number;
  limit?: number;
  search?: string;
  sortby?: string;
  order?: string;
};

type Store = {
  dtPelanggan: {
    last_page: number;
    current_page: number;
    data: PelangganType[];
  };

  showPelanggan: PelangganType | null;

  setPelanggan: ({ page, limit, search, sortby, order }: Props) => Promise<{
    status: string;
    data?: object;
    error?: object;
  }>;

  setShowPelanggan: (id: number | string) => Promise<{
    status: string;
    data?: object;
    error?: object;
  }>;

  addData: (
    formData: FormData
  ) => Promise<{ status: string; data?: any; error?: any }>;

  removeData: (
    id: number | string
  ) => Promise<{ status: string; data?: any; error?: any }>;

  updateData: (
    id: number | string,
    formData: FormData
  ) => Promise<{ status: string; data?: any; error?: any }>;

  getMyProfile: () => Promise<{
    status: string;
    data?: PelangganType;
    error?: object;
  }>;

  updateMyProfile: (
    formData: FormData
  ) => Promise<{ status: string; data?: any; error?: any }>;
};

const usePelanggan = create(
  devtools<Store>((set, get) => ({
    dtPelanggan: {
      last_page: 0,
      current_page: 0,
      data: [],
    },
    showPelanggan: null,

    setPelanggan: async ({ page = 1, limit = 10, search, sortby, order }) => {
      try {
        const response = await crud({
          method: "get",
          url: `/pelanggan`,
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
          dtPelanggan: response.data.data,
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

    setShowPelanggan: async (id) => {
      try {
        const response = await crud({
          method: "get",
          url: `/pelanggan/${id}/`,
        });

        if (response.data && response.data.data) {
          set((state) => ({
            ...state,
            showPelanggan: response.data.data,
          }));
          return {
            status: "berhasil",
            data: response.data,
          };
        } else {
          console.error("Data pelanggan tidak lengkap:", response.data);
          return {
            status: "error",
            error: { message: "Data pelanggan tidak lengkap" },
          };
        }
      } catch (error: any) {
        console.error("Error fetching pelanggan:", error);
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
          url: `/pelanggan/`,
          headers: {
            "Content-Type": "multipart/form-data",
          },
          data: formData,
        });
        get().setPelanggan({});
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
          url: `/pelanggan/${id}/`,
        });
        set((prevState) => ({
          dtPelanggan: {
            last_page: prevState.dtPelanggan.last_page,
            current_page: prevState.dtPelanggan.current_page,
            data: prevState.dtPelanggan.data.filter(
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

    updateData: async (id, formData) => {
      try {
        const response = await crud({
          method: "post",
          url: `/pelanggan/${id}?_method=PUT`,
          headers: {
            "Content-Type": "multipart/form-data",
          },
          data: formData,
        });
        get().setPelanggan({});
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

    getMyProfile: async () => {
      try {
        const response = await crud({
          method: "get",
          url: `/pelanggan/my-profile`,
        });

        if (response.data && response.data.data) {
          return {
            status: "berhasil",
            data: response.data.data,
          };
        } else {
          return {
            status: "error",
            error: { message: "Data profil tidak ditemukan" },
          };
        }
      } catch (error: any) {
        return {
          status: "error",
          error: error.response?.data,
        };
      }
    },

    updateMyProfile: async (formData) => {
      try {
        const response = await crud({
          method: "post",
          url: `/pelanggan/my-profile`,
          headers: {
            "Content-Type": "multipart/form-data",
          },
          data: formData,
        });
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
  }))
);

export default usePelanggan;
