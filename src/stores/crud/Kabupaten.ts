/**
 * eslint-disable @typescript-eslint/no-empty-object-type
 *
 * @format
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { crud } from "@/services/baseURL";
import useLogin from "../auth/login";
import { KabupatenType } from "@/types";
// store kabupaten
type Props = {
  page?: number;
  limit?: number;
  search?: string;
  sortby?: string;
  order?: string;
};

type Store = {
  dtKabupaten: {
    last_page: number;
    current_page: number;
    data: KabupatenType[];
  };

  showKabupaten: KabupatenType | null;

  setKabupaten: ({ page, limit, search, sortby, order }: Props) => Promise<{
    status: string;
    data?: {};
    error?: {};
  }>;

  setShowKabupaten: (id: number | string) => Promise<{
    status: string;
    data?: {};
    error?: {};
  }>;

  addData: (
    data: KabupatenType
  ) => Promise<{ status: string; data?: any; error?: any }>;

  removeData: (
    id: number | string
  ) => Promise<{ status: string; data?: any; error?: any }>;

  updateData: (
    id: number | string,
    data: KabupatenType
  ) => Promise<{ status: string; data?: any; error?: any }>;
};

const useKabupaten = create(
  devtools<Store>((set) => ({
    dtKabupaten: {
      last_page: 0,
      current_page: 0,
      data: [],
    },
    showKabupaten: null,
    setKabupaten: async ({ page = 1, limit = 10, search, sortby, order }) => {
      const token = await useLogin.getState().setToken();
      try {
        const response = await crud({
          method: "get",
          url: `/kabupaten/`,
          headers: { Authorization: `Bearer ${token}` },
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
          dtKabupaten: response.data.data,
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
    setShowKabupaten: async (id) => {
      const token = await useLogin.getState().setToken();
      try {
        const response = await crud({
          method: "get",
          url: `/kabupaten/${id}/`,
          headers: { Authorization: `Bearer ${token}` },
        });
        set((state) => ({
          ...state,
          showKabupaten: response.data.data,
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
      const token = await useLogin.getState().setToken();
      try {
        const res = await crud({
          method: "post",
          url: `/kabupaten/`,
          headers: { Authorization: `Bearer ${token}` },
          data: row,
        });
        set((prevState) => ({
          dtKabupaten: {
            last_page: prevState.dtKabupaten.last_page,
            current_page: prevState.dtKabupaten.current_page,
            data: [res.data.data, ...prevState.dtKabupaten.data],
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
      const token = await useLogin.getState().setToken();
      try {
        const res = await crud({
          method: "delete",
          url: `/kabupaten/${id}/`,
          headers: { Authorization: `Bearer ${token}` },
        });
        set((prevState) => ({
          dtKabupaten: {
            last_page: prevState.dtKabupaten.last_page,
            current_page: prevState.dtKabupaten.current_page,
            data: prevState.dtKabupaten.data.filter(
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
      const token = await useLogin.getState().setToken();
      try {
        const response = await crud({
          method: "PUT",
          url: `/kabupaten/${id}/`,
          headers: { Authorization: `Bearer ${token}` },
          data: row,
        });
        set((prevState) => ({
          dtKabupaten: {
            last_page: prevState.dtKabupaten.last_page,
            current_page: prevState.dtKabupaten.current_page,
            data: prevState.dtKabupaten.data.map((item: any) => {
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
  }))
);

export default useKabupaten;
