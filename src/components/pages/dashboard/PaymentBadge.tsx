/** @format */

import React from "react";

interface PaymentBadgeProps {
  status: string;
}

const PaymentBadge: React.FC<PaymentBadgeProps> = ({ status }) => {
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "belum_dibayar":
        return "bg-red-100 text-red-800";
      case "dibayar":
        return "bg-green-100 text-green-800";
      case "dikembalikan":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
        status
      )}`}
    >
      {status.replace("_", " ")}
    </span>
  );
};

export default PaymentBadge;
