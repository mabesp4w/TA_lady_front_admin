/** @format */

// app/produk/StockUpdateModal.tsx
import { useEffect, useState } from "react";
import ModalDef from "@/components/modal/ModalDef";
import useProduk from "@/stores/crud/Produk";
import { ProdukType } from "@/types";
import toastShow from "@/utils/toast-show";
import { closeModal } from "@/utils/modalHelper";

type Props = {
  produk: ProdukType | null;
};

const StockUpdateModal = ({ produk }: Props) => {
  const [jumlah, setJumlah] = useState<number>(0);
  const [operation, setOperation] = useState<"set" | "add" | "subtract">("set");
  const [isLoading, setIsLoading] = useState(false);
  const { updateStock } = useProduk();

  useEffect(() => {
    if (produk) {
      setJumlah(0);
      setOperation("add");
    }
  }, [produk]);

  if (!produk) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await updateStock(
        produk.id as string,
        jumlah,
        operation
      );

      toastShow({
        event: response.data,
      });

      if (response.status.includes("berhasil")) {
        closeModal("update_stock");
      }
    } catch (error) {
      console.error(error);
      toastShow({
        event: {
          judul: "Gagal",
          type: "error",
          message: "Terjadi kesalahan saat memperbarui stok",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalDef
      id="update_stock"
      title={`Update Stok: ${produk.nm_produk}`}
      size="sm"
    >
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="label">
            <span className="label-text">Stok Saat Ini</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={produk.jumlah_stok}
            disabled
          />
        </div>

        <div className="mb-4">
          <label className="label">
            <span className="label-text">Operasi</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={operation}
            onChange={(e) =>
              setOperation(e.target.value as "set" | "add" | "subtract")
            }
          >
            <option value="set">Set Nilai Baru</option>
            <option value="add">Tambah Stok</option>
            <option value="subtract">Kurangi Stok</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="label">
            <span className="label-text">Jumlah</span>
          </label>
          <input
            type="number"
            className="input input-bordered w-full"
            min={0}
            value={jumlah}
            onChange={(e) => setJumlah(parseInt(e.target.value) || 0)}
            required
          />
        </div>

        <div className="flex justify-end space-x-2 mt-4">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => closeModal("update_stock")}
          >
            Batal
          </button>
          {isLoading ? (
            <button className="btn btn-primary" disabled>
              <span className="loading loading-spinner loading-sm"></span>
              Memperbarui...
            </button>
          ) : (
            <button className="btn btn-primary" type="submit">
              Perbarui Stok
            </button>
          )}
        </div>
      </form>
    </ModalDef>
  );
};

export default StockUpdateModal;
