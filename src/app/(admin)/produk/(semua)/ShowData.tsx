/** @format */

// app/produk/ShowData.tsx
"use client";
import PaginationDef from "@/components/pagination/PaginationDef";
import TableDef from "@/components/table/TableDef";
import useProduk from "@/stores/crud/Produk";
import { ProdukType } from "@/types";
import { useSearchParams } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { BsEye } from "react-icons/bs";

type DeleteProps = {
  id?: number | string;
  isDelete: boolean;
};

type Props = {
  setDelete: ({ id, isDelete }: DeleteProps) => void;
  setEdit: (row: ProdukType) => void;
  showDetail: (id: number | string) => void;
};

const ShowData: FC<Props> = ({ setDelete, setEdit, showDetail }) => {
  const { setProduk, dtProduk } = useProduk();
  // state
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // search params
  const searchParams = useSearchParams();
  const sortby = searchParams.get("sortby") || "";
  const order = searchParams.get("order") || "";
  const search = searchParams.get("cari") || "";
  const kategori_id = searchParams.get("kategori_produk_id") || "";

  const fetchData = async () => {
    await setProduk({
      page,
      search,
      sortby,
      order,
      kategori_produk_id: kategori_id || undefined,
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
  }, [search, sortby, order, kategori_id]);

  // custom component untuk detail button
  const detailButton = (row: ProdukType) => {
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
    "Nama Produk",
    "Kategori",
    "Harga",
    "Stok",
    "Status",
    "Aksi",
  ];
  const tableBodies = [
    "jalur_gambar",
    "nm_produk",
    "kategori_produk.nm_kategori_produk",
    "harga",
    "jumlah_stok",
    "tersedia",
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
            dataTable={dtProduk?.data}
            page={page}
            limit={10}
            setEdit={setEdit}
            setDelete={setDelete}
            costume={detailButton}
          />
        </div>
        {dtProduk?.last_page > 1 && (
          <div className="mt-4">
            <PaginationDef
              currentPage={dtProduk?.current_page}
              totalPages={dtProduk?.last_page}
              setPage={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowData;
