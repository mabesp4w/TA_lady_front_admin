/** @format */

// app/pesanan/ShowData.tsx
"use client";
import PaginationDef from "@/components/pagination/PaginationDef";
import TableDef from "@/components/table/TableDef";
import usePesanan from "@/stores/crud/Pesanan";
import { PesananType } from "@/types";
import { useSearchParams } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { BsEye } from "react-icons/bs";

type DeleteProps = {
  id?: number | string;
  isDelete: boolean;
};

type Props = {
  setDelete: ({ id, isDelete }: DeleteProps) => void;
  setEdit: (row: PesananType) => void;
  showDetail: (id: number | string) => void;
  statusFilter: string;
  jenisFilter: string;
};

const ShowData: FC<Props> = ({
  setDelete,
  setEdit,
  showDetail,
  statusFilter,
  jenisFilter,
}) => {
  const { setPesanan, dtPesanan } = usePesanan();
  // state
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // search params
  const searchParams = useSearchParams();
  const sortby = searchParams.get("sortby") || "";
  const order = searchParams.get("order") || "";
  const search = searchParams.get("cari") || "";

  const fetchData = async () => {
    await setPesanan({
      page,
      search,
      sortby,
      order,
      status: statusFilter,
      jenis_pesanan: jenisFilter,
    });
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter, jenisFilter]);

  // ketika search berubah
  useEffect(() => {
    setPage(1);
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, sortby, order]);

  // custom component untuk detail button
  const detailButton = (row: PesananType) => {
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
    "Kode Pesanan",
    "Pelanggan",
    "Jenis",
    "Total",
    "Tanggal",
    "Status",
    "Pembayaran",
    "Aksi",
  ];

  const tableBodies = [
    "kode_pesanan",
    "user.name",
    "jenis_pesanan",
    "total",
    "tanggal",
    "status",
    "pembayaran",
    "aksi",
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
            dataTable={dtPesanan?.data}
            page={page}
            limit={10}
            setEdit={setEdit}
            setDelete={setDelete}
            costume={detailButton}
          />
        </div>
        {dtPesanan?.last_page > 1 && (
          <div className="mt-4">
            <PaginationDef
              currentPage={dtPesanan?.current_page}
              totalPages={dtPesanan?.last_page}
              setPage={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowData;
