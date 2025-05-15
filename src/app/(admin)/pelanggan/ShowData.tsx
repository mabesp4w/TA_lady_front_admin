/** @format */

// app/pelanggan/ShowData.tsx
"use client";
import PaginationDef from "@/components/pagination/PaginationDef";
import TableDef from "@/components/table/TableDef";
import usePelanggan from "@/stores/crud/Pelanggan";
import { PelangganType } from "@/types";
import { useSearchParams } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { BsEye } from "react-icons/bs";

type DeleteProps = {
  id?: number | string;
  isDelete: boolean;
};

type Props = {
  setDelete: ({ id, isDelete }: DeleteProps) => void;
  setEdit: (row: PelangganType) => void;
  showDetail: (id: number | string) => void;
};

const ShowData: FC<Props> = ({ setDelete, setEdit, showDetail }) => {
  const { setPelanggan, dtPelanggan } = usePelanggan();
  // state
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // search params
  const searchParams = useSearchParams();
  const sortby = searchParams.get("sortby") || "";
  const order = searchParams.get("order") || "";
  const search = searchParams.get("cari") || "";

  const fetchData = async () => {
    await setPelanggan({
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
  const detailButton = (row: PelangganType) => {
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
    "Foto",
    "Nama Pelanggan",
    "Email",
    "No. HP",
    "Alamat",
    "Aksi",
  ];
  const tableBodies = [
    "foto_pelanggan",
    "nm_pelanggan",
    "user.email",
    "no_hp",
    "alamat",
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
      <div className="overflow-hidden h-full flex flex-col">
        <div className="overflow-auto grow">
          <TableDef
            headTable={headTable}
            tableBodies={tableBodies}
            dataTable={dtPelanggan?.data}
            page={page}
            limit={10}
            setEdit={setEdit}
            setDelete={setDelete}
            costume={detailButton}
          />
        </div>
        {dtPelanggan?.last_page > 1 && (
          <div className="mt-4">
            <PaginationDef
              currentPage={dtPelanggan?.current_page}
              totalPages={dtPelanggan?.last_page}
              setPage={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowData;
