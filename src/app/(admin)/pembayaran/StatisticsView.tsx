/** @format */

// app/pembayaran/StatisticsView.tsx
import { FC, useEffect, useState } from "react";
import usePembayaran from "@/stores/crud/Pembayaran";
import { formatRupiah } from "@/utils/formatRupiah";

type Props = {
  month: string;
  year: string;
};

const StatisticsView: FC<Props> = ({ month, year }) => {
  const { getPaymentStatistics, paymentStatistics } = usePembayaran();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      setIsLoading(true);
      await getPaymentStatistics({
        bulan: month,
        tahun: year,
      });
      setIsLoading(false);
    };

    fetchStatistics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, year]);

  // Format bulan
  const getMonthName = (month: string) => {
    const monthNames = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    return monthNames[parseInt(month) - 1];
  };

  // Format tanggal
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="h-full flex justify-center items-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (!paymentStatistics) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-xl font-semibold text-gray-500">
          Data statistik tidak tersedia
        </div>
      </div>
    );
  }

  // Prepare data for charts
  const jenisData = paymentStatistics.jenis_pembayaran || [];
  const metodeData = paymentStatistics.metode_pembayaran || [];
  const harianData = paymentStatistics.pendapatan_harian || [];
  const statusData = paymentStatistics.status || {};

  return (
    <div className="flex-1 flex flex-col max-w-full h-full overflow-auto">
      <h2 className="text-xl font-bold mb-4">
        Statistik Pembayaran - {getMonthName(month)} {year}
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-primary text-primary-content p-4 rounded-lg shadow">
          <div className="text-sm opacity-80">Total Pendapatan</div>
          <div className="text-2xl font-bold">
            {formatRupiah(paymentStatistics.total_pendapatan || 0)}
          </div>
        </div>
        <div className="bg-secondary text-secondary-content p-4 rounded-lg shadow">
          <div className="text-sm opacity-80">Total Transaksi</div>
          <div className="text-2xl font-bold">
            {paymentStatistics.total_transaksi || 0}
          </div>
        </div>
        <div className="bg-accent text-accent-content p-4 rounded-lg shadow">
          <div className="text-sm opacity-80">Transaksi Selesai</div>
          <div className="text-2xl font-bold">{statusData.selesai || 0}</div>
        </div>
        <div className="bg-neutral text-neutral-content p-4 rounded-lg shadow">
          <div className="text-sm opacity-80">Transaksi Menunggu</div>
          <div className="text-2xl font-bold">{statusData.menunggu || 0}</div>
        </div>
      </div>

      {/* Statistics by Type and Method */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* By Payment Type */}
        <div className="bg-base-100 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-3">
            Berdasarkan Jenis Pembayaran
          </h3>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Jenis Pembayaran</th>
                  <th>Jumlah Transaksi</th>
                  <th>Total Pendapatan</th>
                </tr>
              </thead>
              <tbody>
                {jenisData.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-4">
                      Tidak ada data
                    </td>
                  </tr>
                ) : (
                  jenisData.map((item: any, index: number) => (
                    <tr key={index}>
                      <td>
                        {item.jenis_pembayaran === "pesanan"
                          ? "Pesanan Produk"
                          : item.jenis_pembayaran === "pemesanan_kamar"
                          ? "Pemesanan Kamar"
                          : "Pemesanan Fasilitas"}
                      </td>
                      <td>{item.total_transaksi}</td>
                      <td>{formatRupiah(item.total_pendapatan)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* By Payment Method */}
        <div className="bg-base-100 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-3">
            Berdasarkan Metode Pembayaran
          </h3>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Metode Pembayaran</th>
                  <th>Jumlah Transaksi</th>
                  <th>Total Pendapatan</th>
                </tr>
              </thead>
              <tbody>
                {metodeData.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-4">
                      Tidak ada data
                    </td>
                  </tr>
                ) : (
                  metodeData.map((item: any, index: number) => (
                    <tr key={index}>
                      <td>
                        {item.metode_pembayaran === "cash"
                          ? "Tunai"
                          : item.metode_pembayaran === "transfer"
                          ? "Transfer Bank"
                          : "Midtrans"}
                      </td>
                      <td>{item.total_transaksi}</td>
                      <td>{formatRupiah(item.total_pendapatan)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Daily Revenue Chart */}
      <div className="bg-base-100 p-4 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-3">Pendapatan Harian</h3>
        {harianData.length === 0 ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-500">Tidak ada data pendapatan harian</p>
          </div>
        ) : (
          <div className="relative">
            {/* Chart Container */}
            <div className="h-64 flex items-end space-x-2">
              {harianData.map((item: any, index: number) => {
                const day = formatDate(item.tanggal);
                const height = Math.max(
                  (item.total_pendapatan /
                    Math.max(
                      ...harianData.map((d: any) => d.total_pendapatan)
                    )) *
                    100,
                  5
                );

                return (
                  <div
                    key={index}
                    className="flex flex-col items-center flex-1"
                  >
                    <div
                      className="w-full bg-primary rounded-t"
                      style={{ height: `${height}%` }}
                      title={`${formatRupiah(item.total_pendapatan)}`}
                    ></div>
                    <div className="text-xs mt-1">{day}</div>
                  </div>
                );
              })}
            </div>

            {/* Y-axis Labels */}
            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between pointer-events-none">
              <div className="text-xs text-gray-500">
                {formatRupiah(
                  Math.max(...harianData.map((d: any) => d.total_pendapatan))
                )}
              </div>
              <div className="text-xs text-gray-500">
                {formatRupiah(
                  Math.max(...harianData.map((d: any) => d.total_pendapatan)) /
                    2
                )}
              </div>
              <div className="text-xs text-gray-500">{formatRupiah(0)}</div>
            </div>
          </div>
        )}
      </div>

      {/* Status Summary */}
      <div className="bg-base-100 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-3">
          Ringkasan Status Pembayaran
        </h3>
        <div className="flex flex-wrap gap-4">
          <div className="stat bg-base-200 rounded-lg">
            <div className="stat-title">Selesai</div>
            <div className="stat-value text-success">
              {statusData.selesai || 0}
            </div>
          </div>
          <div className="stat bg-base-200 rounded-lg">
            <div className="stat-title">Menunggu</div>
            <div className="stat-value text-warning">
              {statusData.menunggu || 0}
            </div>
          </div>
          <div className="stat bg-base-200 rounded-lg">
            <div className="stat-title">Gagal</div>
            <div className="stat-value text-error">{statusData.gagal || 0}</div>
          </div>
          <div className="stat bg-base-200 rounded-lg">
            <div className="stat-title">Dikembalikan</div>
            <div className="stat-value text-info">
              {statusData.dikembalikan || 0}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsView;
