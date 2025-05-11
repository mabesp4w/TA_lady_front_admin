/** @format */

// app/pemesanan-kamar/ShowData.tsx
"use client";
import PaginationDef from "@/components/pagination/PaginationDef";
import TableDef from "@/components/table/TableDef";
import usePemesananKamar from "@/stores/crud/PemesananKamar";
import { PemesananKamarType } from "@/types";
import { useSearchParams } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { BsEye } from "react-icons/bs";

type DeleteProps = {
  id?: number | string;
  isDelete: boolean;
};

type Props = {
  setDelete: ({ id, isDelete }: DeleteProps) => void;
  setEdit: (row: PemesananKamarType) => void;
  showDetail: (id: number | string) => void;
};

const ShowData: FC<Props> = ({ setDelete, setEdit, showDetail }) => {
  const { setPemesanan, dtPemesanan } = usePemesananKamar();
  // state
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // search params
  const searchParams = useSearchParams();
  const sortby = searchParams.get("sortby") || "";
  const order = searchParams.get("order") || "";
  const search = searchParams.get("cari") || "";
  const status = searchParams.get("status") || "";
  const user_id = searchParams.get("user_id") || "";

  const fetchData = async () => {
    await setPemesanan({
      page,
      search,
      sortby,
      order,
      status: status || undefined,
      user_id: user_id || undefined,
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
  }, [search, sortby, order, status, user_id]);

  // custom component untuk detail button
  const detailButton = (row: PemesananKamarType) => {
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
    "Kode Pemesanan",
    "Kamar",
    "Tamu",
    "Check In",
    "Check Out",
    "Total",
    "Status",
    "Pembayaran",
    "Aksi",
  ];
  const tableBodies = [
    "kode_pemesanan",
    "kamar.no_kamar",
    "user.name",
    "tanggal_check_in",
    "tanggal_check_out",
    "total_harga",
    "status",
    "status_pembayaran",
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
            dataTable={dtPemesanan?.data}
            page={page}
            limit={10}
            setEdit={setEdit}
            setDelete={setDelete}
            costume={detailButton}
          />
        </div>
        {dtPemesanan?.last_page > 1 && (
          <div className="mt-4">
            <PaginationDef
              currentPage={dtPemesanan?.current_page}
              totalPages={dtPemesanan?.last_page}
              setPage={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowData;
