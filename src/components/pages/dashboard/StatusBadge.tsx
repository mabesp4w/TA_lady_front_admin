/** @format */

import React from "react";

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "menunggu":
        return "bg-yellow-100 text-yellow-800";
      case "dikonfirmasi":
        return "bg-blue-100 text-blue-800";
      case "check_in":
      case "digunakan":
        return "bg-green-100 text-green-800";
      case "check_out":
        return "bg-purple-100 text-purple-800";
      case "dibatalkan":
        return "bg-red-100 text-red-800";
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

export default StatusBadge;
