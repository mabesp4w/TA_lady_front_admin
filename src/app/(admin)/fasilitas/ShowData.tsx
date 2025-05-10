/** @format */

// app/fasilitas/ShowData.tsx
/** @format */
"use client";
import PaginationDef from "@/components/pagination/PaginationDef";
import TableDef from "@/components/table/TableDef";
import useFasilitas from "@/stores/crud/Fasilitas";
import { FasilitasType } from "@/types";
import { useSearchParams } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { BsEye } from "react-icons/bs";

type DeleteProps = {
  id?: number | string;
  isDelete: boolean;
};

type Props = {
  setDelete: ({ id, isDelete }: DeleteProps) => void;
  setEdit: (row: FasilitasType) => void;
  showDetail: (id: number | string) => void;
};

const ShowData: FC<Props> = ({ setDelete, setEdit, showDetail }) => {
  const { setFasilitas, dtFasilitas } = useFasilitas();
  // state
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // search params
  const searchParams = useSearchParams();
  const sortby = searchParams.get("sortby") || "";
  const order = searchParams.get("order") || "";
  const search = searchParams.get("cari") || "";

  const fetchData = async () => {
    await setFasilitas({
      page,
      search,
      sortby,
      order,
    });
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // ketika search berubah
  useEffect(() => {
    setPage(1);
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, sortby, order]);

  // custom component untuk detail button
  const detailButton = (row: FasilitasType) => {
    return (
      <BsEye
        onClick={(e) => {
          e.stopPropagation();
          showDetail(row.id as string);
        }}
        size={20}
        className="cursor-pointer hover:text-blue-500"
        title="Detail"
      />
    );
  };

  // table
  const headTable = [
    "No",
    "Gambar",
    "Nama Fasilitas",
    "Harga (Rp)",
    "Jam Buka",
    "Jam Tutup",
    "Kapasitas",
    "Aksi",
  ];
  const tableBodies = [
    "main_image",
    "nm_fasilitas",
    "harga",
    "jam_buka",
    "jam_tutup",
    "kapasitas",
  ];

  if (isLoading) {
    return (
      <div className="h-full flex justify-center items-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex-col max-w-full h-full overflow-auto">
      <div className="overflow-hidden h-full flex flex-col ">
        <div className="overflow-auto grow">
          <TableDef
            headTable={headTable}
            tableBodies={tableBodies}
            dataTable={dtFasilitas?.data}
            page={page}
            limit={10}
            setEdit={setEdit}
            setDelete={setDelete}
            costume={detailButton}
          />
        </div>
        {dtFasilitas?.last_page > 1 && (
          <div className="mt-4">
            <PaginationDef
              currentPage={dtFasilitas?.current_page}
              totalPages={dtFasilitas?.last_page}
              setPage={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowData;
