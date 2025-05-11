/** @format */

// app/produk/DetailProduk.tsx
import ModalDef from "@/components/modal/ModalDef";
import useProduk from "@/stores/crud/Produk";
import Image from "next/image";
import { formatRupiah } from "@/utils/formatRupiah";
import { BASE_URL } from "@/services/baseURL";

const DetailProduk = () => {
  const { showProduk } = useProduk();

  if (!showProduk) {
    return null;
  }

  return (
    <ModalDef
      id="detail_produk"
      title={`Detail Produk: ${showProduk.nm_produk}`}
      size="lg"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col space-y-3">
          {/* Gambar Produk */}
          <div className="relative h-64 w-full bg-gray-100 rounded-lg overflow-hidden">
            {showProduk.jalur_gambar ? (
              <Image
                src={`${BASE_URL}/${showProduk.jalur_gambar}`}
                alt={showProduk.nm_produk}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <span className="text-gray-500">Tidak ada gambar</span>
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold">{showProduk.nm_produk}</h2>

          <div className="mt-3 text-lg font-semibold text-primary">
            {showProduk.kategori_produk?.nm_kategori_produk || ""}
          </div>

          <div className="mt-2 text-xl font-bold text-primary">
            {formatRupiah(showProduk.harga)}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-y-2">
            <div className="text-gray-600">Status:</div>
            <div>
              {showProduk.tersedia ? (
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  Tersedia
                </span>
              ) : (
                <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                  Tidak Tersedia
                </span>
              )}
            </div>

            <div className="text-gray-600">Stok:</div>
            <div
              className={
                showProduk.jumlah_stok > 0 ? "text-green-600" : "text-red-600"
              }
            >
              {showProduk.jumlah_stok} item
            </div>
          </div>

          {showProduk.deskripsi && (
            <div className="mt-4">
              <h3 className="font-medium mb-1">Deskripsi:</h3>
              <p className="text-gray-700 whitespace-pre-line">
                {showProduk.deskripsi}
              </p>
            </div>
          )}
        </div>
      </div>
    </ModalDef>
  );
};

export default DetailProduk;
