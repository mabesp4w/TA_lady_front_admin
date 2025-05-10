/** @format */

// Warna marker berdasarkan tipe lokasi penjualan
export const MARKER_COLORS = {
  kios: "#FF5733", // Merah-Oranye
  pasar: "#33FF57", // Hijau
  supermarket: "#3357FF", // Biru
  online: "#F033FF", // Ungu
  lainnya: "#FF33A8", // Pink
  umkm: "#FFC107", // Kuning untuk UMKM
};

// Tipe untuk style peta
export type MapStyleOption = {
  name: string;
  value: string;
};

// Pilihan style peta
export const MAP_STYLES: MapStyleOption[] = [
  { name: "Streets", value: "mapbox://styles/mapbox/streets-v11" },
  { name: "Satellite", value: "mapbox://styles/mapbox/satellite-v9" },
  {
    name: "Satellite Streets",
    value: "mapbox://styles/mapbox/satellite-streets-v11",
  },
  { name: "Outdoors", value: "mapbox://styles/mapbox/outdoors-v11" },
  { name: "Light", value: "mapbox://styles/mapbox/light-v10" },
  { name: "Dark", value: "mapbox://styles/mapbox/dark-v10" },
  { name: "Navigation Day", value: "mapbox://styles/mapbox/navigation-day-v1" },
  {
    name: "Navigation Night",
    value: "mapbox://styles/mapbox/navigation-night-v1",
  },
];

// Daftar tipe lokasi untuk filter
export const TIPE_LOKASI = [
  { value: "kios", label: "Kios/Toko" },
  { value: "pasar", label: "Pasar Tradisional" },
  { value: "supermarket", label: "Supermarket" },
  { value: "online", label: "Marketplace Online" },
  { value: "lainnya", label: "Lainnya" },
  { value: "umkm", label: "UMKM" },
];

// Dapatkan label untuk tipe lokasi
export const getTipeLabel = (value: string): string => {
  const tipe = TIPE_LOKASI.find((t) => t.value === value);
  return tipe ? tipe.label : value;
};
