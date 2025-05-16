/** @format */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { api } from "@/services/baseURL";
import { FasilitasType } from "@/types";
// fasilitas
type Props = {
  page?: number;
  limit?: number;
  search?: string;
  sortby?: string;
  order?: string;
  paginate?: boolean;
};

type Store = {
  dtFasilitas: FasilitasType[];

  setFasilitas: ({
    page,
    limit,
    search,
    sortby,
    order,
    paginate,
  }: Props) => Promise<{
    status: string;
    data?: any;
    error?: any;
  }>;
};

const useFasilitasApi = create(
  devtools<Store>((set) => ({
    dtFasilitas: [],

    setFasilitas: async ({
      page,
      limit,
      search,
      sortby,
      order,
      paginate = false,
    }: Props) => {
      try {
        const response = await api({
          method: "get",
          url: `/fasilitas`,
          params: {
            limit,
            page,
            search,
            sortby,
            order,
            paginate,
          },
        });
        set((state) => ({
          ...state,
          dtFasilitas: response.data.data,
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
  }))
);

export default useFasilitasApi;
