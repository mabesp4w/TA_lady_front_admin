/** @format */

import React, { Suspense } from "react";
import Content from "./Content";

const Dashboard = () => {
  return (
    <section className="flex flex-col h-full w-full">
      <Suspense fallback={<div>Loading...</div>}>
        <Content />
      </Suspense>
    </section>
  );
};

export default Dashboard;
