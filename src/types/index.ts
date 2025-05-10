/** @format */

// index.ts

// /types/index.ts
export type KategoriProdukType = {
  id?: number | string;
  nm_kategori_produk: string;
  deskripsi?: string;
  produk_count?: number;
  produk?: any[];
  created_at?: string;
  updated_at?: string;
};

export type GambarFasilitasType = {
  id?: number | string;
  fasilitas_id?: number | string;
  jalur_gambar: string;
  gambar_utama: boolean;
  created_at?: string;
  updated_at?: string;
};

export type FasilitasType = {
  id?: number | string;
  nm_fasilitas: string;
  deskripsi?: string;
  harga: number;
  jam_buka: string;
  jam_tutup: string;
  kapasitas?: number;
  tersedia?: boolean;
  created_at?: string;
  updated_at?: string;
  gambar_fasilitas?: GambarFasilitasType[];
};
