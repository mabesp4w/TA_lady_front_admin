/** @format */

// types.ts
// Base model with common properties
export interface BaseModel {
  id: string; // UUID
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

// Jenis Kamar (Room Type)
export interface JenisKamarType extends BaseModel {
  nm_jenis_kamar: string;
  deskripsi?: string;
  kapasitas: number;
  harga_per_malam: number;
}

// Kamar (Room)
export interface KamarType extends BaseModel {
  jenis_kamar_id: string;
  no_kamar: string;
  tersedia: boolean;
  lantai: string;
  catatan?: string;
  gambar_utama_id?: string;
  jenis_kamar?: JenisKamarType; // Relation
  gambar_kamar?: GambarKamarType[]; // Relation
}

// Gambar Kamar (Room Images)
export interface GambarKamarType extends BaseModel {
  kamar_id: string;
  jalur_gambar: string;
  gambar_utama: boolean;
  kamar?: KamarType; // Relation
}

// Fasilitas (Facility)
export interface FasilitasType extends BaseModel {
  nm_fasilitas: string;
  deskripsi?: string;
  harga: number;
  kapasitas?: number;
  jam_buka: string; // Time format
  jam_tutup: string; // Time format
  tersedia: boolean;
  gambar_utama_id?: string;
  gambar_fasilitas?: GambarFasilitasType[]; // Relation
}

// Gambar Fasilitas (Facility Images)
export interface GambarFasilitasType extends BaseModel {
  fasilitas_id: string;
  jalur_gambar: string;
  gambar_utama: boolean;
  fasilitas?: FasilitasType; // Relation
}

// Kategori Produk (Product Category)
export interface KategoriProdukType extends BaseModel {
  nm_kategori_produk: string;
  deskripsi?: string;
  produk?: ProdukType[]; // Relation
}

// Produk (Product)
export interface ProdukType extends BaseModel {
  kategori_produk_id: string;
  nm_produk: string;
  deskripsi?: string;
  harga: number;
  jumlah_stok: number;
  jalur_gambar?: string;
  tersedia: boolean;
  kategori_produk?: KategoriProdukType; // Relation
  item_pesanan?: ItemPesananType[]; // Relation
}

// User (simplified, assuming you have a User model)
export interface UserType extends BaseModel {
  name: string;
  email: string;
  email_verified_at?: string;
  pelanggan?: PelangganType; // Relation
  pemesanan_kamar?: PemesananKamarType[]; // Relation
  pemesanan_fasilitas?: PemesananFasilitasType[]; // Relation
  pesanan?: PesananType[]; // Relation
}

// Pemesanan Kamar (Room Booking)
export interface PemesananKamarType extends BaseModel {
  user_id: string;
  kamar_id: string;
  tanggal_check_in: string; // ISO date string
  tanggal_check_out: string; // ISO date string
  total_harga: number;
  kode_pemesanan: string;
  barcode?: string;
  status: "menunggu" | "dikonfirmasi" | "check_in" | "check_out" | "dibatalkan";
  catatan?: string;
  metode_pembayaran?: string;
  status_pembayaran: "belum_dibayar" | "dibayar" | "dikembalikan";
  user?: UserType; // Relation
  kamar?: KamarType; // Relation
  pembayaran?: {
    id: string | number;
    jumlah: number;
    metode_pembayaran: string;
    status: string;
    created_at: string;
  }[];
}

// Pemesanan Fasilitas (Facility Booking)
export interface PemesananFasilitasType extends BaseModel {
  user_id: string;
  fasilitas_id: string;
  tanggal_pemesanan: string; // ISO date string
  waktu_mulai: string; // Time format
  waktu_selesai: string; // Time format
  jumlah_orang: number;
  total_harga: number;
  kode_pemesanan: string;
  barcode?: string;
  status: "menunggu" | "dikonfirmasi" | "digunakan" | "dibatalkan";
  catatan?: string;
  metode_pembayaran?: string;
  status_pembayaran: "belum_dibayar" | "dibayar" | "dikembalikan";
  user?: UserType; // Relation
  fasilitas?: FasilitasType; // Relation
}

// Pesanan (Order)
export interface PesananType extends BaseModel {
  user_id: string;
  jenis_pesanan: "online" | "offline";
  total_jumlah: number;
  kode_pesanan: string;
  barcode?: string;
  status: "menunggu" | "diproses" | "selesai" | "dibatalkan";
  catatan?: string;
  metode_pembayaran?: string;
  status_pembayaran: "belum_dibayar" | "dibayar" | "dikembalikan";
  user?: UserType; // Relation
  item_pesanan?: ItemPesananType[]; // Relation
  pembayaran?: PembayaranType[]; // Relation
}

// Item Pesanan (Order Items)
export interface ItemPesananType extends BaseModel {
  pesanan_id: string;
  produk_id: string;
  jumlah: number;
  harga_satuan: number;
  subtotal: number;
  pesanan?: PesananType; // Relation
  produk?: ProdukType; // Relation
}

// Pembayaran (Payment)
export interface PembayaranType extends BaseModel {
  payable: any;
  jenis_pembayaran: string;
  pesanan_id: string;
  payable_type?: string;
  payable_id?: string;
  jumlah: number;
  metode_pembayaran: string;
  id_transaksi?: string;
  snap_token?: string;
  transaction_id?: string;
  payment_type?: string;
  va_number?: string;
  expiry_time?: string;
  status: "menunggu" | "selesai" | "gagal" | "dikembalikan";
  detail_pembayaran?: Record<string, any>; // JSON data
  pesanan?: PesananType; // Relation
}

// Midtrans Transactions
export interface MidtransTransactionType extends BaseModel {
  order_id: string;
  transaction_id?: string;
  payment_type: string;
  transaction_status: string;
  fraud_status?: string;
  gross_amount: number;
  currency: string;
  payment_code?: string;
  snap_token?: string;
  settlement_time?: string;
  payment_details?: Record<string, any>; // JSON data
  payable_type: string;
  payable_id: string;
}

// Pelanggan (Customer)
export interface PelangganType extends BaseModel {
  user_id: string;
  nm_pelanggan: string;
  no_hp: string;
  alamat: string;
  foto_pelanggan?: string;
  user?: UserType; // Relation
}

// Response types for API endpoints
export interface ApiResponse<T> {
  status: "success" | "error";
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

// Pagination response
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}
