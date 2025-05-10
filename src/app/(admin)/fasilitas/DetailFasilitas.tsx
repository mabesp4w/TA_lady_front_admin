/** @format */

// app/fasilitas/DetailFasilitas.tsx
import { useEffect, useState } from "react";
import ModalDef from "@/components/modal/ModalDef";
import useFasilitas from "@/stores/crud/Fasilitas";
import Image from "next/image";
import { formatRupiah } from "@/utils/formatRupiah";
import { BASE_URL } from "@/services/baseURL";

const DetailFasilitas = () => {
  const { showFasilitas } = useFasilitas();
  const [activeImage, setActiveImage] = useState<string | null>(null);

  // Set gambar utama sebagai gambar aktif
  useEffect(() => {
    if (
      showFasilitas &&
      showFasilitas.gambar_fasilitas &&
      showFasilitas.gambar_fasilitas.length > 0
    ) {
      const mainImage = showFasilitas.gambar_fasilitas.find(
        (img) => img.gambar_utama
      );
      if (mainImage) {
        setActiveImage(mainImage.jalur_gambar);
      } else {
        setActiveImage(showFasilitas.gambar_fasilitas[0].jalur_gambar);
      }
    } else {
      setActiveImage(null);
    }
  }, [showFasilitas]);

  if (!showFasilitas) {
    return null;
  }

  return (
    <ModalDef
      id="detail_fasilitas"
      title={`Detail Fasilitas: ${showFasilitas.nm_fasilitas}`}
      size="lg"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col space-y-3">
          {/* Gambar Utama */}
          <div className="relative h-64 w-full bg-gray-100 rounded-lg overflow-hidden">
            {activeImage ? (
              <Image
                src={`${BASE_URL}/${activeImage}`}
                alt={showFasilitas.nm_fasilitas}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <span className="text-gray-500">Tidak ada gambar</span>
              </div>
            )}
          </div>

          {/* Thumbnail Gambar */}
          {showFasilitas.gambar_fasilitas &&
            showFasilitas.gambar_fasilitas.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {showFasilitas.gambar_fasilitas.map((img) => (
                  <button
                    key={img.id}
                    type="button"
                    className={`relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden border-2 
                    ${
                      activeImage === img.jalur_gambar
                        ? "border-primary"
                        : "border-transparent"
                    }`}
                    onClick={() => setActiveImage(img.jalur_gambar)}
                  >
                    <Image
                      src={`${BASE_URL}/${img.jalur_gambar}`}
                      alt={`Thumbnail ${img.id}`}
                      fill
                      className="object-cover"
                    />
                    {img.gambar_utama && (
                      <div className="absolute top-0 right-0 bg-primary text-white text-xs p-0.5 rounded-bl-md">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
        </div>

        <div>
          <h2 className="text-xl font-bold">{showFasilitas.nm_fasilitas}</h2>

          <div className="mt-3 text-lg font-semibold text-primary">
            {formatRupiah(showFasilitas.harga)}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-y-2">
            <div className="text-gray-600">Status:</div>
            <div>
              {showFasilitas.tersedia ? (
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  Tersedia
                </span>
              ) : (
                <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                  Tidak Tersedia
                </span>
              )}
            </div>

            <div className="text-gray-600">Jam Operasional:</div>
            <div>
              {showFasilitas.jam_buka} - {showFasilitas.jam_tutup}
            </div>

            <div className="text-gray-600">Kapasitas:</div>
            <div>{showFasilitas.kapasitas || "-"} orang</div>
          </div>

          {showFasilitas.deskripsi && (
            <div className="mt-4">
              <h3 className="font-medium mb-1">Deskripsi:</h3>
              <p className="text-gray-700 whitespace-pre-line">
                {showFasilitas.deskripsi}
              </p>
            </div>
          )}
        </div>
      </div>
    </ModalDef>
  );
};

export default DetailFasilitas;
