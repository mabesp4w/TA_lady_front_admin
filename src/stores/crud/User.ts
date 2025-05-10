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
import { UserType } from "@/types";
// store user
type Props = {
  page?: number;
  limit?: number;
  search?: string;
  sortby?: string;
  order?: string;
};

type Store = {
  dtUser: {
    last_page: number;
    current_page: number;
    data: UserType[];
  };

  showUser: UserType | null;

  setUser: ({ page, limit, search, sortby, order }: Props) => Promise<{
    status: string;
    data?: {};
    error?: {};
  }>;

  setShowUser: (id: number | string) => Promise<{
    status: string;
    data?: {};
    error?: {};
  }>;

  addData: (
    data: UserType
  ) => Promise<{ status: string; data?: any; error?: any }>;

  removeData: (
    id: number | string
  ) => Promise<{ status: string; data?: any; error?: any }>;

  updateData: (
    id: number | string,
    data: UserType
  ) => Promise<{ status: string; data?: any; error?: any }>;
};

const useUser = create(
  devtools<Store>((set) => ({
    dtUser: {
      last_page: 0,
      current_page: 0,
      data: [],
    },
    showUser: null,
    setUser: async ({ page = 1, limit = 10, search, sortby, order }) => {
      const token = await useLogin.getState().setToken();
      try {
        const response = await crud({
          method: "get",
          url: `/user/`,
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
          dtUser: response.data.data,
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
    setShowUser: async (id) => {
      const token = await useLogin.getState().setToken();
      try {
        const response = await crud({
          method: "get",
          url: `/user/${id}/`,
          headers: { Authorization: `Bearer ${token}` },
        });
        set((state) => ({
          ...state,
          showUser: response.data.data,
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
          url: `/user/`,
          headers: { Authorization: `Bearer ${token}` },
          data: row,
        });
        set((prevState) => ({
          dtUser: {
            last_page: prevState.dtUser.last_page,
            current_page: prevState.dtUser.current_page,
            data: [res.data.data, ...prevState.dtUser.data],
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
          url: `/user/${id}/`,
          headers: { Authorization: `Bearer ${token}` },
        });
        set((prevState) => ({
          dtUser: {
            last_page: prevState.dtUser.last_page,
            current_page: prevState.dtUser.current_page,
            data: prevState.dtUser.data.filter((item: any) => item.id !== id),
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
          url: `/user/${id}/`,
          headers: { Authorization: `Bearer ${token}` },
          data: row,
        });
        set((prevState) => ({
          dtUser: {
            last_page: prevState.dtUser.last_page,
            current_page: prevState.dtUser.current_page,
            data: prevState.dtUser.data.map((item: any) => {
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

export default useUser;
