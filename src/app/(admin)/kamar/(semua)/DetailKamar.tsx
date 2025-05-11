/** @format */

// app/kamar/DetailKamar.tsx
import { useEffect, useState } from "react";
import ModalDef from "@/components/modal/ModalDef";
import useKamar from "@/stores/crud/Kamar";
import Image from "next/image";
import { formatRupiah } from "@/utils/formatRupiah";
import { BASE_URL } from "@/services/baseURL";

const DetailKamar = () => {
  const { showKamar } = useKamar();
  const [activeImage, setActiveImage] = useState<string | null>(null);

  // Set gambar utama sebagai gambar aktif
  useEffect(() => {
    if (
      showKamar &&
      showKamar.gambar_kamar &&
      showKamar.gambar_kamar.length > 0
    ) {
      const mainImage = showKamar.gambar_kamar.find((img) => img.gambar_utama);
      if (mainImage) {
        setActiveImage(mainImage.jalur_gambar);
      } else {
        setActiveImage(showKamar.gambar_kamar[0].jalur_gambar);
      }
    } else {
      setActiveImage(null);
    }
  }, [showKamar]);

  if (!showKamar) {
    return null;
  }

  return (
    <ModalDef
      id="detail_kamar"
      title={`Detail Kamar: ${showKamar.no_kamar}`}
      size="lg"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col space-y-3">
          {/* Gambar Utama */}
          <div className="relative h-64 w-full bg-gray-100 rounded-lg overflow-hidden">
            {activeImage ? (
              <Image
                src={`${BASE_URL}/${activeImage}`}
                alt={`Kamar ${showKamar.no_kamar}`}
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
          {showKamar.gambar_kamar && showKamar.gambar_kamar.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {showKamar.gambar_kamar.map((img) => (
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
          <h2 className="text-xl font-bold">
            Nomor Kamar: {showKamar.no_kamar}
          </h2>

          <div className="mt-3 text-lg font-semibold text-primary">
            {showKamar.jenis_kamar?.nm_jenis_kamar || ""}
            {showKamar.jenis_kamar?.harga_per_malam && (
              <span className="ml-2 text-base">
                ({formatRupiah(showKamar.jenis_kamar?.harga_per_malam)}/malam)
              </span>
            )}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-y-2">
            <div className="text-gray-600">Status:</div>
            <div>
              {showKamar.tersedia ? (
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  Tersedia
                </span>
              ) : (
                <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                  Tidak Tersedia
                </span>
              )}
            </div>

            <div className="text-gray-600">Lantai:</div>
            <div>{showKamar.lantai}</div>

            <div className="text-gray-600">Kapasitas:</div>
            <div>{showKamar.jenis_kamar?.kapasitas || "-"} orang</div>
          </div>

          {showKamar.catatan && (
            <div className="mt-4">
              <h3 className="font-medium mb-1">Catatan:</h3>
              <p className="text-gray-700 whitespace-pre-line">
                {showKamar.catatan}
              </p>
            </div>
          )}

          {showKamar.jenis_kamar?.deskripsi && (
            <div className="mt-4">
              <h3 className="font-medium mb-1">Deskripsi Jenis Kamar:</h3>
              <p className="text-gray-700 whitespace-pre-line">
                {showKamar.jenis_kamar?.deskripsi}
              </p>
            </div>
          )}
        </div>
      </div>
    </ModalDef>
  );
};

export default DetailKamar;
