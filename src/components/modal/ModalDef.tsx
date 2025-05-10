/** @format */

import React, { ReactNode } from "react";

type Props = {
  id: string;
  title?: string;
  children?: ReactNode;
  size?: "lg" | "md" | "sm";
};

const ModalDef = ({ id, title, children, size }: Props) => {
  return (
    <dialog id={id} className="modal">
      <div
        className={`modal-box overflow-auto z-50 ${
          size === "lg"
            ? "w-11/12 max-w-5xl"
            : size === "md"
            ? "w-9/12 max-w-4xl"
            : "w-7/12 max-w-3xl"
        }`}
      >
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">{title}</h3>
        <div className="relative">{children}</div>
      </div>
      <form method="dialog" className="modal-backdrop z-40">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default ModalDef;
