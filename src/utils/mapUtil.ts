/** @format */

import mapboxgl from "mapbox-gl";
import { LokasiPenjualanType, LokasiUMKMType } from "@/types";
import { MARKER_COLORS, getTipeLabel } from "@/constants/mapConstant";

/**
 * Membuat popup untuk lokasi penjualan
 */
export const createPenjualanPopup = (
  lokasi: LokasiPenjualanType
): mapboxgl.Popup => {
  return new mapboxgl.Popup({ offset: 25 }).setHTML(`
    <div style="padding: 10px;">
      <h3 style="margin: 0 0 5px 0;">${lokasi.nm_lokasi}</h3>
      <p style="margin: 0;"><strong>Tipe:</strong> ${getTipeLabel(
        lokasi.tipe_lokasi
      )}</p>
      <p style="margin: 5px 0 0 0;"><strong>Alamat:</strong> ${
        lokasi.alamat
      }</p>
      ${
        lokasi.kecamatan_detail
          ? `
        <p style="margin: 5px 0 0 0;"><strong>Kecamatan:</strong> ${lokasi.kecamatan_detail.nm_kecamatan}</p>
        <p style="margin: 5px 0 0 0;"><strong>Kabupaten:</strong> ${lokasi.kabupaten_detail?.nm_kabupaten}</p>
        <p style="margin: 5px 0 0 0;"><strong>Provinsi:</strong> ${lokasi.provinsi_detail?.nm_provinsi}</p>
      `
          : ""
      }
      ${
        lokasi.tlp_pengelola
          ? `<p style="margin: 5px 0 0 0;"><strong>Telepon:</strong> ${lokasi.tlp_pengelola}</p>`
          : ""
      }
    </div>
  `);
};

/**
 * Membuat popup untuk lokasi UMKM
 */
export const createUMKMPopup = (lokasi: LokasiUMKMType): mapboxgl.Popup => {
  // Ambil nama bisnis atau username jika tersedia
  const namaBisnis = "Lokasi UMKM"; // Default fallback

  return new mapboxgl.Popup({ offset: 25 }).setHTML(`
    <div style="padding: 10px;">
      <h3 style="margin: 0 0 5px 0;">${namaBisnis}</h3>
      <p style="margin: 0;"><strong>Tipe:</strong> UMKM</p>
      <p style="margin: 5px 0 0 0;"><strong>Alamat:</strong> ${
        lokasi.alamat_lengkap
      }</p>
      ${
        lokasi.kecamatan_detail
          ? `
        <p style="margin: 5px 0 0 0;"><strong>Kecamatan:</strong> ${lokasi.kecamatan_detail.nm_kecamatan}</p>
        <p style="margin: 5px 0 0 0;"><strong>Kabupaten:</strong> ${lokasi.kabupaten_detail?.nm_kabupaten}</p>
        <p style="margin: 5px 0 0 0;"><strong>Provinsi:</strong> ${lokasi.provinsi_detail?.nm_provinsi}</p>
      `
          : ""
      }
      ${
        lokasi.kode_pos
          ? `<p style="margin: 5px 0 0 0;"><strong>Kode Pos:</strong> ${lokasi.kode_pos}</p>`
          : ""
      }
    </div>
  `);
};

/**
 * Mencari lokasi berdasarkan nama/alamat
 */
export const searchLocationByQuery = async (
  searchQuery: string,
  map: mapboxgl.Map | null,
  draggableMarker: mapboxgl.Marker | null,
  setValue: any | undefined,
  onLocationSelect: ((lng: number, lat: number) => void) | undefined,
  setLng: React.Dispatch<React.SetStateAction<number>>,
  setLat: React.Dispatch<React.SetStateAction<number>>
): Promise<void> => {
  if (!searchQuery || searchQuery.trim() === "") return;

  try {
    // Gunakan Mapbox Geocoding API
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        searchQuery
      )}.json?access_token=${mapboxgl.accessToken}&country=id&limit=1`
    );

    if (!response.ok) throw new Error("Gagal mendapatkan data lokasi");

    const data = await response.json();

    if (data.features && data.features.length > 0) {
      const [longitude, latitude] = data.features[0].center;

      setLng(longitude);
      setLat(latitude);

      // Perbarui lokasi peta
      if (map) {
        map.flyTo({
          center: [longitude, latitude],
          zoom: 15,
          essential: true,
        });

        // Perbarui posisi marker jika ada
        if (draggableMarker) {
          draggableMarker.setLngLat([longitude, latitude]);
        }

        // Update form values if setValue function is provided
        if (setValue) {
          setValue("longitude", longitude);
          setValue("latitude", latitude);
        }

        // Call external handler if provided
        if (onLocationSelect) {
          onLocationSelect(longitude, latitude);
        }
      }
    } else {
      alert("Lokasi tidak ditemukan. Coba kata kunci lain.");
    }
  } catch (error) {
    console.error("Error searching location:", error);
    alert("Gagal melakukan pencarian lokasi.");
  }
};

/**
 * Mendeteksi lokasi pengguna saat ini
 */
export const detectUserLocation = (
  map: mapboxgl.Map | null,
  draggableMarker: mapboxgl.Marker | null,
  setValue: any | undefined,
  onLocationSelect: ((lng: number, lat: number) => void) | undefined,
  setLng: React.Dispatch<React.SetStateAction<number>>,
  setLat: React.Dispatch<React.SetStateAction<number>>,
  setIsLocating: React.Dispatch<React.SetStateAction<boolean>>
): void => {
  setIsLocating(true);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { longitude, latitude } = position.coords;

        setLng(longitude);
        setLat(latitude);

        // Perbarui lokasi peta
        if (map) {
          map.flyTo({
            center: [longitude, latitude],
            zoom: 15,
            essential: true,
          });

          // Perbarui posisi marker jika ada
          if (draggableMarker) {
            draggableMarker.setLngLat([longitude, latitude]);
          }

          // Update form values if setValue function is provided
          if (setValue) {
            setValue("longitude", longitude);
            setValue("latitude", latitude);
          }

          // Call external handler if provided
          if (onLocationSelect) {
            onLocationSelect(longitude, latitude);
          }
        }

        setIsLocating(false);
      },
      (error) => {
        console.error("Error getting user location:", error);
        alert(
          "Gagal mendapatkan lokasi Anda. Pastikan GPS dan izin lokasi diaktifkan."
        );
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  } else {
    alert("Browser Anda tidak mendukung geolocation.");
    setIsLocating(false);
  }
};

/**
 * Menambahkan marker lokasi penjualan dan UMKM ke peta
 */
export const addLocationMarkers = (
  map: mapboxgl.Map | null,
  markersRef: React.MutableRefObject<mapboxgl.Marker[]>,
  lokasiPenjualan: LokasiPenjualanType[],
  lokasiUMKM: LokasiUMKMType[],
  activeFilters: string[]
): void => {
  if (!lokasiPenjualan || !lokasiUMKM) return;
  if (!map) return;

  // Hapus marker yang ada
  markersRef.current.forEach((marker) => marker.remove());
  markersRef.current = [];

  // Tambahkan marker untuk lokasi penjualan yang sesuai filter
  if (lokasiPenjualan && lokasiPenjualan.length > 0) {
    lokasiPenjualan.forEach((lokasi) => {
      // Hanya tampilkan jika tipe lokasi ada dalam filter aktif
      if (
        activeFilters.includes(lokasi.tipe_lokasi) &&
        lokasi.latitude &&
        lokasi.longitude
      ) {
        // Buat popup dengan informasi lokasi
        const popup = createPenjualanPopup(lokasi);

        // Buat marker dengan popup
        const marker = new mapboxgl.Marker({
          color:
            MARKER_COLORS[lokasi.tipe_lokasi as keyof typeof MARKER_COLORS] ||
            "#FF8C00",
        })
          .setLngLat([lokasi.longitude, lokasi.latitude])
          .setPopup(popup)
          .addTo(map);

        // Simpan referensi marker untuk pembersihan
        markersRef.current.push(marker);
      }
    });
  }

  // Tambahkan marker untuk lokasi UMKM jika filter UMKM aktif
  if (lokasiUMKM && lokasiUMKM.length > 0 && activeFilters.includes("umkm")) {
    lokasiUMKM.forEach((lokasi) => {
      if (lokasi.latitude && lokasi.longitude) {
        // Buat popup dengan informasi UMKM
        const popup = createUMKMPopup(lokasi);

        // Buat marker dengan popup
        const marker = new mapboxgl.Marker({
          color: MARKER_COLORS.umkm,
        })
          .setLngLat([lokasi.longitude, lokasi.latitude])
          .setPopup(popup)
          .addTo(map);

        // Simpan referensi marker untuk pembersihan
        markersRef.current.push(marker);
      }
    });
  }
};
