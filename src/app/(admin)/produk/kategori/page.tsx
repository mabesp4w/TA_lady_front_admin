/** @format */

// app/kategori-produk/page.tsx
import React, { Suspense } from "react";
import Content from "./Content";

const KategoriProduk = () => {
  return (
    <section className="flex flex-col h-full">
      <Suspense fallback={<div>Loading...</div>}>
        <Content />
      </Suspense>
    </section>
  );
};

export default KategoriProduk;
