/** @format */

// app/pembayaran/ReceiptModal.tsx
import ModalDef from "@/components/modal/ModalDef";
import { formatRupiah } from "@/utils/formatRupiah";
import React from "react";
import { useRef } from "react";

type Props = {
  data: any;
};

const ReceiptModal = ({ data }: Props) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  // Format tanggal
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const handlePrint = () => {
    const receiptContent = receiptRef.current;
    if (!receiptContent) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const printDocument = printWindow.document;
    printDocument.write(`
      <html>
        <head>
          <title>Bukti Pembayaran</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
            }
            .receipt {
              max-width: 800px;
              margin: 0 auto;
              border: 1px solid #ddd;
              padding: 20px;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
              border-bottom: 2px solid #333;
              padding-bottom: 10px;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
            }
            .header p {
              margin: 5px 0;
            }
            .info-group {
              margin-bottom: 20px;
            }
            .info-group h2 {
              margin: 0 0 10px 0;
              font-size: 18px;
              border-bottom: 1px solid #ddd;
              padding-bottom: 5px;
            }
            .info-row {
              display: flex;
              margin-bottom: 5px;
            }
            .info-label {
              width: 200px;
              font-weight: bold;
            }
            .info-value {
              flex: 1;
            }
            .total {
              font-size: 18px;
              font-weight: bold;
              text-align: right;
              margin-top: 20px;
              border-top: 1px solid #ddd;
              padding-top: 10px;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 14px;
              color: #666;
            }
            @media print {
              .receipt {
                border: none;
              }
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          ${receiptContent.innerHTML}
          <script>
            window.onload = function() {
              window.print();
              window.setTimeout(function() {
                window.close();
              }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printDocument.close();
  };

  if (!data) {
    return (
      <ModalDef id="receipt_pembayaran" title="Bukti Pembayaran" size="lg">
        <div className="p-10 text-center">
          <p>Data bukti pembayaran tidak tersedia</p>
        </div>
      </ModalDef>
    );
  }

  return (
    <ModalDef id="receipt_pembayaran" title="Bukti Pembayaran" size="lg">
      <div className="mb-4">
        <button className="btn btn-primary w-full" onClick={handlePrint}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
          Cetak Bukti Pembayaran
        </button>
      </div>

      <div ref={receiptRef} className="receipt bg-white p-6 border rounded-lg">
        <div className="header text-center mb-6 border-b border-gray-300 pb-4">
          <h1 className="text-2xl font-bold">BUKTI PEMBAYARAN</h1>
          <p className="text-sm text-gray-600">Hotel Management System</p>
          <p className="text-sm text-gray-600">
            Jl. Contoh No. 123, Kota Contoh
          </p>
        </div>

        <div className="info-group mb-4">
          <h2 className="text-lg font-bold border-b border-gray-200 pb-1 mb-2">
            Informasi Pembayaran
          </h2>
          <div className="grid grid-cols-2 gap-y-2">
            <div className="font-medium">ID Pembayaran:</div>
            <div>{data.id_pembayaran}</div>

            <div className="font-medium">Tanggal Pembayaran:</div>
            <div>{data.tanggal_pembayaran}</div>

            <div className="font-medium">Metode Pembayaran:</div>
            <div>{data.metode_pembayaran}</div>

            <div className="font-medium">Status:</div>
            <div>{data.status}</div>
          </div>
        </div>

        <div className="info-group mb-4">
          <h2 className="text-lg font-bold border-b border-gray-200 pb-1 mb-2">
            Informasi Transaksi
          </h2>
          <div className="grid grid-cols-2 gap-y-2">
            <div className="font-medium">Jenis Transaksi:</div>
            <div>{data.jenis_transaksi}</div>

            <div className="font-medium">Kode Transaksi:</div>
            <div>{data.kode_transaksi}</div>
          </div>
        </div>

        {data.details && (
          <div className="info-group mb-4">
            <h2 className="text-lg font-bold border-b border-gray-200 pb-1 mb-2">
              Detail Transaksi
            </h2>
            <div className="grid grid-cols-2 gap-y-2">
              {Object.entries(data.details).map(([key, value]) => (
                <React.Fragment key={key}>
                  <div className="font-medium">
                    {key
                      .split("_")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                    :
                  </div>
                  <div>{String(value)}</div>
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        <div className="total text-right mt-6 border-t border-gray-300 pt-4">
          <div className="text-lg">Total Pembayaran:</div>
          <div className="text-2xl font-bold text-primary">
            {formatRupiah(data.total)}
          </div>
        </div>

        <div className="footer mt-10 text-center text-gray-500 text-sm">
          <p>Terima kasih atas pembayaran Anda</p>
          <p>Bukti pembayaran ini merupakan dokumen resmi dan sah</p>
          <p>Dicetak pada: {formatDate(new Date().toISOString())}</p>
        </div>
      </div>
    </ModalDef>
  );
};

export default ReceiptModal;
