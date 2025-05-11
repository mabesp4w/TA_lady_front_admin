/** @format */

// app/pemesanan-fasilitas/ShowData.tsx
"use client";
import PaginationDef from "@/components/pagination/PaginationDef";
import TableDef from "@/components/table/TableDef";
import usePemesananFasilitas from "@/stores/crud/PemesananFasilitas";
import { PemesananFasilitasType } from "@/types";
import { useSearchParams } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { BsEye } from "react-icons/bs";

type DeleteProps = {
  id?: number | string;
  isDelete: boolean;
};

type Props = {
  setDelete: ({ id, isDelete }: DeleteProps) => void;
  showDetail: (id: number | string) => void;
  isAdmin?: boolean;
};

const ShowData: FC<Props> = ({ setDelete, showDetail, isAdmin = false }) => {
  const { setPemesanan, getAllBookings, dtPemesanan } = usePemesananFasilitas();
  // state
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // search params
  const searchParams = useSearchParams();
  const sortby = searchParams.get("sortby") || "";
  const order = searchParams.get("order") || "";
  const search = searchParams.get("cari") || "";
  const status = searchParams.get("status") || "";
  const tanggal_awal = searchParams.get("tanggal_awal") || "";
  const tanggal_akhir = searchParams.get("tanggal_akhir") || "";
  const fasilitas_id = searchParams.get("fasilitas_id") || "";

  const fetchData = async () => {
    const params = {
      page,
      search,
      sortby,
      order,
      status: status || undefined,
      tanggal_awal: tanggal_awal || undefined,
      tanggal_akhir: tanggal_akhir || undefined,
      fasilitas_id: fasilitas_id || undefined,
    };

    if (isAdmin) {
      await getAllBookings(params);
    } else {
      await setPemesanan(params);
    }

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
  }, [
    search,
    sortby,
    order,
    status,
    tanggal_awal,
    tanggal_akhir,
    fasilitas_id,
  ]);

  // custom component untuk detail button
  const detailButton = (row: PemesananFasilitasType) => {
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
    "Kode",
    "Fasilitas",
    isAdmin ? "Pemesan" : "",
    "Tanggal",
    "Waktu",
    "Jumlah Orang",
    "Total",
    "Status",
    "Pembayaran",
    "Aksi",
  ].filter(Boolean);

  const tableBodies = [
    "kode_pemesanan",
    "fasilitas.nm_fasilitas",
    "user.name",
    "tanggal_pemesanan",
    "waktu_mulai_selesai",
    "jumlah_orang",
    "total_harga",
    "status",
    "status_pembayaran",
  ];

  // Fungsi untuk menambahkan waktu mulai selesai
  const processData = (data: PemesananFasilitasType[]) => {
    return data.map((item) => ({
      ...item,
      waktu_mulai_selesai: `${item.waktu_mulai} - ${item.waktu_selesai}`,
    }));
  };

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
            dataTable={processData(dtPemesanan?.data || [])}
            page={page}
            limit={10}
            setEdit={() => {}}
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
