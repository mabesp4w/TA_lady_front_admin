/** @format */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { crud } from "@/services/baseURL";
import { FasilitasType } from "@/types";

type Props = {
  page?: number;
  limit?: number;
  search?: string;
  sortby?: string;
  order?: string;
};

type AvailabilityParams = {
  tanggal_pemesanan: string;
  waktu_mulai: string;
  waktu_selesai: string;
};

type Store = {
  dtFasilitas: {
    last_page: number;
    current_page: number;
    data: FasilitasType[];
  };

  availableFacilities: FasilitasType[];

  showFasilitas: FasilitasType | null;

  setFasilitas: ({ page, limit, search, sortby, order }: Props) => Promise<{
    status: string;
    data?: object;
    error?: object;
  }>;

  setShowFasilitas: (id: number | string) => Promise<{
    status: string;
    data?: object;
    error?: object;
  }>;

  getAvailableFacilities: (params: AvailabilityParams) => Promise<{
    status: string;
    data?: FasilitasType[];
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

const useFasilitas = create(
  devtools<Store>((set, get) => ({
    dtFasilitas: {
      last_page: 0,
      current_page: 0,
      data: [],
    },
    availableFacilities: [],
    showFasilitas: null,

    // Modifikasi pada setFasilitas di dalam useFasilitas.ts
    setFasilitas: async ({ page = 1, limit = 10, search, sortby, order }) => {
      try {
        const response = await crud({
          method: "get",
          url: `/fasilitas/`,
          params: {
            limit,
            page,
            search,
            sortby,
            order,
          },
        });

        // Tambahkan properti main_image untuk setiap fasilitas
        const modifiedData = {
          ...response.data.data,
          data: response.data.data.data.map((fasilitas: FasilitasType) => {
            // Cari gambar utama
            const mainImage = fasilitas.gambar_fasilitas?.find(
              (img) => img.gambar_utama
            );
            // Jika tidak ada gambar utama, gunakan gambar pertama jika ada
            const imageToUse = mainImage
              ? mainImage.jalur_gambar
              : fasilitas.gambar_fasilitas &&
                fasilitas.gambar_fasilitas.length > 0
              ? fasilitas.gambar_fasilitas[0].jalur_gambar
              : null;

            return {
              ...fasilitas,
              main_image: imageToUse,
            };
          }),
        };

        set((state) => ({
          ...state,
          dtFasilitas: modifiedData,
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

    setShowFasilitas: async (id) => {
      try {
        const response = await crud({
          method: "get",
          url: `/fasilitas/${id}/`,
        });

        // Debug respons API
        console.log("API response:", response.data);

        // Pastikan bahwa data fasilitas dan gambarFasilitas ada
        if (response.data && response.data.data) {
          set((state) => ({
            ...state,
            showFasilitas: response.data.data,
          }));
          return {
            status: "berhasil",
            data: response.data,
          };
        } else {
          console.error("Data fasilitas tidak lengkap:", response.data);
          return {
            status: "error",
            error: { message: "Data fasilitas tidak lengkap" },
          };
        }
      } catch (error: any) {
        console.error("Error fetching fasilitas:", error);
        return {
          status: "error",
          error: error.response?.data,
        };
      }
    },
    getAvailableFacilities: async ({
      tanggal_pemesanan,
      waktu_mulai,
      waktu_selesai,
    }) => {
      try {
        const response = await crud({
          method: "get",
          url: `/fasilitas/available/`,
          // headers: { Authorization: `Bearer ${token}` },
          params: {
            tanggal_pemesanan,
            waktu_mulai,
            waktu_selesai,
          },
        });
        set((state) => ({
          ...state,
          availableFacilities: response.data.data,
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
          url: `/fasilitas/`,
          headers: {
            // Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          data: formData,
        });
        get().setFasilitas({});
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
          url: `/fasilitas/${id}/`,
          // headers: { Authorization: `Bearer ${token}` },
        });
        set((prevState) => ({
          dtFasilitas: {
            last_page: prevState.dtFasilitas.last_page,
            current_page: prevState.dtFasilitas.current_page,
            data: prevState.dtFasilitas.data.filter(
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
          method: "POST",
          url: `/fasilitas/${id}?_method=PUT`,
          headers: {
            // Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          data: formData,
        });
        get().setFasilitas({});
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

export default useFasilitas;
