/** @format */

import Image from "next/image";
import moment from "moment";
import { BASE_URL } from "./baseURL";
import { formatRupiah } from "@/utils/formatRupiah";

const getYouTubeVideoId = (url: string) => {
  const regExp =
    /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const getProperty = (obj: any, prop: any, index: number, setIndexBox: any) => {
  const parts = prop.split(".");

  if (parts.length > 0) {
    const first = parts[0];
    const rest = parts.slice(1);
    const lastPart = parts[parts.length - 1]; // Mengambil properti terakhir

    // Jika properti pertama adalah array
    if (Array.isArray(obj[first])) {
      // Untuk kasus categories.category_nm atau array lainnya
      if (obj[first].length > 0 && rest.length > 0) {
        // Ambil semua nilai dari array untuk properti yang diminta
        const values = obj[first]
          .map((item) => {
            let value = item;

            // Lanjutkan dengan properti selanjutnya
            for (const part of rest) {
              if (value && typeof value === "object") {
                value = value[part];
              } else {
                return null;
              }
            }

            // Cek jika nilai akhir adalah harga yang perlu diformat
            const currencyProps = ["harga", "harga_per_malam"];
            if (
              currencyProps.includes(lastPart) &&
              value !== null &&
              value !== undefined
            ) {
              return formatRupiah(value);
            }

            return value;
          })
          .filter((val) => val !== null && val !== undefined);

        // Tampilkan semua nilai yang ditemukan, dipisahkan oleh koma
        if (values.length > 0) {
          return <p className="capitalize">{values.join(", ")}</p>;
        }
      }

      // Jika array kosong
      return "";
    }

    // Proses untuk properti bukan array
    let current = first;
    let currentObj = obj[current];
    let i = 1;

    while (currentObj && i < parts.length) {
      current = parts[i];
      currentObj = currentObj[current];
      i++;
    }

    // cek currency
    const currencyProps = ["harga", "harga_per_malam", "total_harga"];
    if (currencyProps.includes(lastPart)) {
      return formatRupiah(currentObj);
    }
    // cek status
    const statusProps = ["status", "status_pembayaran"];
    if (statusProps.includes(lastPart)) {
      return (
        <span
          className={
            "badge " +
            (currentObj === "menunggu"
              ? "badge-warning"
              : currentObj === "dikonfirmasi"
              ? "badge-primary"
              : currentObj === "check_in"
              ? "badge-success"
              : currentObj === "check_out"
              ? "badge-info"
              : currentObj === "dibatalkan"
              ? "badge-error"
              : "")
          }
        >
          {currentObj.replace("_", " ").toUpperCase()}
        </span>
      );
    }

    // Date processing
    const dateProps = [
      "announcement_date",
      "news_date",
      "tgl_bergabung",
      "tanggal_check_in",
      "tanggal_check_out",
    ];
    if (dateProps.includes(lastPart)) {
      return moment(currentObj).format("DD/MM/YYYY");
    }

    // Image processing
    const fileProps = [
      "cover_image",
      "file_book",
      "main_image",
      "jalur_gambar",
      "foto_pelanggan",
    ];
    if (fileProps.includes(lastPart)) {
      const extension = currentObj?.split(".")?.pop();

      return (
        currentObj &&
        (["png", "jpg", "jpeg"].includes(extension) ? (
          <Image
            src={`${BASE_URL}/${currentObj}`}
            loading="lazy"
            width={70}
            height={70}
            alt=""
            className="cursor-pointer"
            onClick={(e: any) => {
              e.stopPropagation();
              setIndexBox?.(index);
            }}
          />
        ) : (
          <a
            href={`${currentObj}`}
            target="_blank"
            rel="noreferrer"
            className="text-blue-700"
          >
            Lihat File
          </a>
        ))
      );
    }

    // YouTube URL processing
    const YoutubUrl = ["youtube_url"];
    if (YoutubUrl.includes(lastPart)) {
      return (
        <a href={currentObj} target="_blank" rel="noopener noreferrer">
          <Image
            src={`https://img.youtube.com/vi/${getYouTubeVideoId(
              currentObj
            )}/0.jpg`}
            loading="lazy"
            width={70}
            height={70}
            alt=""
            className="cursor-pointer"
          />
        </a>
      );
    }

    // boolean value
    const booleanProps = ["aktif", "tersedia"];
    if (booleanProps.includes(lastPart)) {
      return currentObj ? "Ya" : "Tidak";
    }

    // Default case
    return <p className="capitalize">{currentObj || ""}</p>;
  }

  throw new Error("parts is not valid array");
};
export default getProperty;
