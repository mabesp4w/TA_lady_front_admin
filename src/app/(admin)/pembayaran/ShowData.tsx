/** @format */

// app/pembayaran/ShowData.tsx
"use client";
import PaginationDef from "@/components/pagination/PaginationDef";
import TableDef from "@/components/table/TableDef";
import usePembayaran from "@/stores/crud/Pembayaran";
import { PembayaranType } from "@/types";
import { useSearchParams } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { BsEye } from "react-icons/bs";

type DeleteProps = {
  id?: number | string;
  isDelete: boolean;
};

type Props = {
  setDelete: ({ id, isDelete }: DeleteProps) => void;
  setEdit: (row: PembayaranType) => void;
  showDetail: (id: number | string) => void;
  jenisFilter: string;
  metodeFilter: string;
  statusFilter: string;
};

const ShowData: FC<Props> = ({
  setDelete,
  setEdit,
  showDetail,
  jenisFilter,
  metodeFilter,
  statusFilter,
}) => {
  const { setPembayaran, dtPembayaran } = usePembayaran();
  // state
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // search params
  const searchParams = useSearchParams();
  const sortby = searchParams.get("sortby") || "";
  const order = searchParams.get("order") || "";
  const search = searchParams.get("cari") || "";

  const fetchData = async () => {
    await setPembayaran({
      page,
      search,
      sortby,
      order,
      jenis_pembayaran: jenisFilter,
      metode_pembayaran: metodeFilter,
      status: statusFilter,
    });
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, jenisFilter, metodeFilter, statusFilter]);

  // ketika search berubah
  useEffect(() => {
    setPage(1);
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, sortby, order]);

  // custom component untuk detail button
  const detailButton = (row: PembayaranType) => {
    return (
      <div className="flex gap-2">
        <BsEye
          onClick={(e) => {
            e.stopPropagation();
            showDetail(row.id as string);
          }}
          size={20}
          className="cursor-pointer hover:text-blue-500"
          title="Detail"
        />
      </div>
    );
  };

  // table
  const headTable = [
    "No",
    "ID Transaksi",
    "Jenis",
    "Metode",
    "Jumlah",
    "Tanggal",
    "Status",
    "Aksi",
  ];

  const tableBodies = [
    "id_transaksi",
    "jenis_pembayaran",
    "metode_pembayaran",
    "jumlah",
    "created_at",
    "status",
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
            dataTable={dtPembayaran?.data}
            page={page}
            limit={10}
            setEdit={setEdit}
            setDelete={setDelete}
            costume={detailButton}
          />
        </div>
        {dtPembayaran?.last_page > 1 && (
          <div className="mt-4">
            <PaginationDef
              currentPage={dtPembayaran?.current_page}
              totalPages={dtPembayaran?.last_page}
              setPage={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowData;
