/** @format */

// app/admin/pemesanan-fasilitas/Content.tsx
"use client";
import { Suspense, useEffect, useState } from "react";
import ShowData from "./ShowData";
import { Toaster } from "react-hot-toast";
import toastShow from "@/utils/toast-show";
import usePemesananFasilitas from "@/stores/crud/PemesananFasilitas";
import { useWelcomeContext } from "@/context/WelcomeContext";
import DeleteModal from "@/components/modal/DeleteModal";
import DetailPemesanan from "./DetailPemesanan";
import { useForm } from "react-hook-form";
import SelectFromDb from "@/components/select/SelectFromDB";
import { FaChartBar } from "react-icons/fa";
import SelectDef from "@/components/select/SelectDef";
import useFasilitasApi from "@/stores/api/Fasilitas";
import { showModal } from "@/utils/modalHelper";

const halaman = "Manajemen Pemesanan Fasilitas";

// type setDelete
type Delete = {
  id?: number | string;
  isDelete: boolean;
};

const Content = () => {
  const { setWelcome } = useWelcomeContext();
  // effect welcome
  useEffect(() => {
    setWelcome(`Halaman ` + halaman);

    return () => {};
  }, [setWelcome]);

  // store
  const { removeData, setShowPemesanan, getStatistics } =
    usePemesananFasilitas();
  const { setFasilitas, dtFasilitas } = useFasilitasApi();

  // state
  const [idDel, setIdDel] = useState<number | string>();
  const [, setDetailId] = useState<number | string | null>(null);
  const [filterTanggalAwal, setFilterTanggalAwal] = useState<string>("");
  const [filterTanggalAkhir, setFilterTanggalAkhir] = useState<string>("");
  const [statistics, setStatistics] = useState<any>(null);
  const [isLoadingStats, setIsLoadingStats] = useState<boolean>(false);
  const [showStats, setShowStats] = useState<boolean>(false);

  // form untuk filter
  const { control, watch } = useForm({
    defaultValues: {
      filter_status: "",
      filter_fasilitas_id: "",
    },
  });

  // Pantau perubahan pada filter
  useEffect(() => {
    const subscription = watch((value) => {
      if (value.filter_status !== undefined) {
        // Update URL with query parameter
        const url = new URL(window.location.href);
        if (value.filter_status) {
          url.searchParams.set("status", value.filter_status);
        } else {
          url.searchParams.delete("status");
        }
        window.history.pushState({}, "", url);
      }

      if (value.filter_fasilitas_id !== undefined) {
        // Update URL with query parameter
        const url = new URL(window.location.href);
        if (value.filter_fasilitas_id) {
          url.searchParams.set("fasilitas_id", value.filter_fasilitas_id);
        } else {
          url.searchParams.delete("fasilitas_id");
        }
        window.history.pushState({}, "", url);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  // Update URL saat filter tanggal berubah
  useEffect(() => {
    const url = new URL(window.location.href);
    if (filterTanggalAwal) {
      url.searchParams.set("tanggal_awal", filterTanggalAwal);
    } else {
      url.searchParams.delete("tanggal_awal");
    }

    if (filterTanggalAkhir) {
      url.searchParams.set("tanggal_akhir", filterTanggalAkhir);
    } else {
      url.searchParams.delete("tanggal_akhir");
    }

    window.history.pushState({}, "", url);
  }, [filterTanggalAwal, filterTanggalAkhir]);

  // Load data fasilitas saat komponen dimuat
  useEffect(() => {
    setFasilitas({});
    fetchStatistics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchStatistics = async () => {
    setIsLoadingStats(true);
    try {
      const response = await getStatistics();
      if (response.status === "berhasil") {
        setStatistics(response.data);
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const showDetail = async (id: number | string) => {
    await setShowPemesanan(id);
    setDetailId(id);
    showModal("detail_pemesanan_fasilitas");
  };

  const setDelete = async ({ id, isDelete }: Delete) => {
    setIdDel(id);
    showModal("modal_delete");
    if (isDelete) {
      const { data } = await removeData(idDel as string);
      toastShow({
        event: data,
      });
      fetchStatistics();
    }
  };

  // Opsi untuk filter status
  const statusOptions = [
    { id: "", nm_status: "Semua Status" },
    { id: "menunggu", nm_status: "Menunggu" },
    { id: "dikonfirmasi", nm_status: "Dikonfirmasi" },
    { id: "digunakan", nm_status: "Digunakan" },
    { id: "dibatalkan", nm_status: "Dibatalkan" },
  ];

  // Format rupiah
  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(angka);
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div>
        <Toaster />
        <DeleteModal setDelete={setDelete} />
        <DetailPemesanan isAdmin={true} />

        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <p>
              Kelola pemesanan fasilitas hotel. Anda dapat melihat semua
              pemesanan, mengubah status, memproses pembayaran, dan melihat
              statistik pemesanan.
            </p>

            <button
              className="btn btn-outline btn-info"
              onClick={() => setShowStats(!showStats)}
            >
              <FaChartBar className="mr-2" />{" "}
              {showStats ? "Sembunyikan Statistik" : "Lihat Statistik"}
            </button>
          </div>

          {/* Statistik */}
          {showStats && (
            <div className="bg-white p-4 rounded-lg shadow mb-4">
              <h3 className="text-lg font-semibold mb-3">
                Statistik Pemesanan Fasilitas
              </h3>

              {isLoadingStats ? (
                <div className="flex justify-center p-6">
                  <span className="loading loading-spinner loading-md"></span>
                </div>
              ) : statistics ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Status Pemesanan</h4>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="stat-box p-2 bg-warning text-white rounded-md">
                          <p className="text-sm opacity-80">Menunggu</p>
                          <p className="text-2xl font-bold">
                            {statistics.status_counts.menunggu || 0}
                          </p>
                        </div>
                        <div className="stat-box p-2 bg-info text-white rounded-md">
                          <p className="text-sm opacity-80">Dikonfirmasi</p>
                          <p className="text-2xl font-bold">
                            {statistics.status_counts.dikonfirmasi || 0}
                          </p>
                        </div>
                        <div className="stat-box p-2 bg-success text-white rounded-md">
                          <p className="text-sm opacity-80">Digunakan</p>
                          <p className="text-2xl font-bold">
                            {statistics.status_counts.digunakan || 0}
                          </p>
                        </div>
                        <div className="stat-box p-2 bg-error text-white rounded-md">
                          <p className="text-sm opacity-80">Dibatalkan</p>
                          <p className="text-2xl font-bold">
                            {statistics.status_counts.dibatalkan || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Pendapatan</h4>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="mb-2">
                        <p className="text-sm text-gray-600">
                          Total Pendapatan
                        </p>
                        <p className="text-2xl font-bold text-primary">
                          {formatRupiah(statistics.total_pendapatan || 0)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          Berdasarkan Fasilitas
                        </p>
                        {statistics.pendapatan_per_fasilitas &&
                        statistics.pendapatan_per_fasilitas.length > 0 ? (
                          <div className="max-h-36 overflow-auto">
                            {statistics.pendapatan_per_fasilitas.map(
                              (item: any, index: number) => (
                                <div
                                  key={index}
                                  className="flex justify-between items-center py-1 border-b"
                                >
                                  <span className="text-sm">
                                    {item.fasilitas}
                                  </span>
                                  <span className="font-medium">
                                    {formatRupiah(item.total)}
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">
                            Tidak ada data pendapatan
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">
                  Tidak ada data statistik yang tersedia
                </p>
              )}

              <div className="flex justify-end mt-3">
                <button
                  className="btn btn-sm btn-outline"
                  onClick={fetchStatistics}
                  disabled={isLoadingStats}
                >
                  {isLoadingStats ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : null}
                  Perbarui Data
                </button>
              </div>
            </div>
          )}

          {/* Filter */}
          <div className="bg-gray-50 p-4 rounded-lg mt-4">
            <h3 className="font-medium mb-3">Filter Pemesanan</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {/* Filter Status */}
              <div>
                <SelectDef
                  label="Status"
                  name="filter_status"
                  required={false}
                  options={statusOptions}
                  control={control}
                  menuPosition="absolute"
                  placeholder="Semua status"
                  addClass=""
                />
              </div>

              {/* Filter Fasilitas */}
              <div>
                <SelectFromDb
                  label="Fasilitas"
                  name="filter_fasilitas_id"
                  required={false}
                  dataDb={dtFasilitas}
                  body={["id", "nm_fasilitas"]}
                  control={control}
                  menuPosition="absolute"
                  placeholder="Semua fasilitas"
                  addClass=""
                />
              </div>

              {/* Filter Tanggal Awal */}
              <div>
                <label className="label">
                  <span className="label-text">Tanggal Awal</span>
                </label>
                <input
                  type="date"
                  className="input input-bordered w-full"
                  value={filterTanggalAwal}
                  onChange={(e) => setFilterTanggalAwal(e.target.value)}
                />
              </div>

              {/* Filter Tanggal Akhir */}
              <div>
                <label className="label">
                  <span className="label-text">Tanggal Akhir</span>
                </label>
                <input
                  type="date"
                  className="input input-bordered w-full"
                  value={filterTanggalAkhir}
                  onChange={(e) => setFilterTanggalAkhir(e.target.value)}
                  min={filterTanggalAwal}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Suspense>
        <ShowData
          setDelete={setDelete}
          showDetail={showDetail}
          isAdmin={true}
        />
      </Suspense>
    </div>
  );
};

export default Content;
