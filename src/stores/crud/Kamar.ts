/** @format */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { crud } from "@/services/baseURL";
import { KamarType } from "@/types";

type Props = {
  page?: number;
  limit?: number;
  search?: string;
  sortby?: string;
  order?: string;
};

type AvailabilityParams = {
  check_in: string;
  check_out: string;
  jenis_kamar_id?: string;
};

type Store = {
  dtKamar: {
    last_page: number;
    current_page: number;
    data: KamarType[];
  };

  availableRooms: KamarType[];

  showKamar: KamarType | null;

  setKamar: ({ page, limit, search, sortby, order }: Props) => Promise<{
    status: string;
    data?: object;
    error?: object;
  }>;

  setShowKamar: (id: number | string) => Promise<{
    status: string;
    data?: object;
    error?: object;
  }>;

  getAvailableRooms: (params: AvailabilityParams) => Promise<{
    status: string;
    data?: KamarType[];
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
};

const useKamar = create(
  devtools<Store>((set, get) => ({
    dtKamar: {
      last_page: 0,
      current_page: 0,
      data: [],
    },
    availableRooms: [],
    showKamar: null,

    setKamar: async ({ page = 1, limit = 10, search, sortby, order }) => {
      try {
        const response = await crud({
          method: "get",
          url: `/kamar`,
          params: {
            limit,
            page,
            search,
            sortby,
            order,
          },
        });

        // Tambahkan properti main_image untuk setiap kamar
        const modifiedData = {
          ...response.data.data,
          data: response.data.data.data.map((kamar: KamarType) => {
            // Cari gambar utama
            const mainImage = kamar.gambar_kamar?.find(
              (img) => img.gambar_utama
            );
            // Jika tidak ada gambar utama, gunakan gambar pertama jika ada
            const imageToUse = mainImage
              ? mainImage.jalur_gambar
              : kamar.gambar_kamar && kamar.gambar_kamar.length > 0
              ? kamar.gambar_kamar[0].jalur_gambar
              : null;

            return {
              ...kamar,
              main_image: imageToUse,
            };
          }),
        };

        set((state) => ({
          ...state,
          dtKamar: modifiedData,
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

    setShowKamar: async (id) => {
      try {
        const response = await crud({
          method: "get",
          url: `/kamar/${id}/`,
        });

        // Debug respons API
        console.log("API response:", response.data);

        // Pastikan bahwa data kamar dan gambarKamar ada
        if (response.data && response.data.data) {
          set((state) => ({
            ...state,
            showKamar: response.data.data,
          }));
          return {
            status: "berhasil",
            data: response.data,
          };
        } else {
          console.error("Data kamar tidak lengkap:", response.data);
          return {
            status: "error",
            error: { message: "Data kamar tidak lengkap" },
          };
        }
      } catch (error: any) {
        console.error("Error fetching kamar:", error);
        return {
          status: "error",
          error: error.response?.data,
        };
      }
    },

    getAvailableRooms: async ({ check_in, check_out, jenis_kamar_id }) => {
      try {
        const response = await crud({
          method: "get",
          url: `/kamar/available/`,
          params: {
            check_in,
            check_out,
            jenis_kamar_id,
          },
        });
        set((state) => ({
          ...state,
          availableRooms: response.data.data,
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
          url: `/kamar/`,
          headers: {
            "Content-Type": "multipart/form-data",
          },
          data: formData,
        });
        get().setKamar({});
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
          url: `/kamar/${id}/`,
        });
        set((prevState) => ({
          dtKamar: {
            last_page: prevState.dtKamar.last_page,
            current_page: prevState.dtKamar.current_page,
            data: prevState.dtKamar.data.filter((item: any) => item.id !== id),
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
          url: `/kamar/${id}?_method=PUT`,
          headers: {
            "Content-Type": "multipart/form-data",
          },
          data: formData,
        });
        get().setKamar({});
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

export default useKamar;
