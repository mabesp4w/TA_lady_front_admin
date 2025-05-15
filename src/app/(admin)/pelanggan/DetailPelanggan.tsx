/** @format */

// app/pelanggan/DetailPelanggan.tsx
import ModalDef from "@/components/modal/ModalDef";
import usePelanggan from "@/stores/crud/Pelanggan";
import Image from "next/image";
import { BASE_URL } from "@/services/baseURL";

const DetailPelanggan = () => {
  const { showPelanggan } = usePelanggan();

  if (!showPelanggan) {
    return null;
  }

  // Format tanggal
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  // Format nomor HP
  const formatPhoneNumber = (phoneNumber: string) => {
    // Format nomor HP Indonesia: +62 xxx-xxxx-xxxx
    if (phoneNumber.startsWith("0")) {
      return (
        "+62 " +
        phoneNumber.substring(1).replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3")
      );
    } else if (phoneNumber.startsWith("+62")) {
      return phoneNumber.replace(/\+62(\d{3})(\d{4})(\d{4})/, "+62 $1-$2-$3");
    }
    return phoneNumber;
  };

  return (
    <ModalDef
      id="detail_pelanggan"
      title={`Detail Pelanggan: ${showPelanggan.nm_pelanggan}`}
      size="lg"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Foto Pelanggan */}
        <div className="flex flex-col items-center md:items-start">
          <div className="mb-4">
            {showPelanggan.foto_pelanggan ? (
              <div className="relative h-64 w-64 rounded-lg overflow-hidden">
                <Image
                  src={`${BASE_URL}/${showPelanggan.foto_pelanggan}`}
                  alt={showPelanggan.nm_pelanggan}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="bg-primary text-primary-content rounded-lg h-64 w-64 flex items-center justify-center text-5xl font-semibold">
                {showPelanggan.nm_pelanggan.substring(0, 1).toUpperCase()}
              </div>
            )}
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-semibold">Status Akun</h3>
            <div className="flex items-center mt-2">
              <div className="badge badge-success">Aktif</div>
              <span className="ml-2 text-sm text-gray-600">
                Terdaftar sejak {formatDate(showPelanggan.created_at)}
              </span>
            </div>
          </div>
        </div>

        {/* Informasi Pelanggan */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Informasi Pelanggan</h3>

          <div className="grid grid-cols-1 gap-y-4">
            <div>
              <label className="text-sm text-gray-600">Nama Lengkap</label>
              <div className="font-medium text-lg">
                {showPelanggan.nm_pelanggan}
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600">Email</label>
              <div className="font-medium">
                {showPelanggan.user?.email || "-"}
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600">Nomor HP</label>
              <div className="font-medium">
                {formatPhoneNumber(showPelanggan.no_hp)}
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600">Alamat</label>
              <div className="font-medium">{showPelanggan.alamat}</div>
            </div>
          </div>

          {/* Riwayat Aktivitas */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Riwayat Aktivitas</h3>
            <div className="bg-base-200 p-4 rounded-lg">
              <div className="text-sm">
                <p>
                  <span className="font-medium">Terdaftar:</span>{" "}
                  {formatDate(showPelanggan.created_at)}
                </p>
                <p>
                  <span className="font-medium">Terakhir Diperbarui:</span>{" "}
                  {formatDate(showPelanggan.updated_at)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalDef>
  );
};

export default DetailPelanggan;
