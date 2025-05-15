/** @format */

import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingIndicatorProps {
  isLoading: boolean;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
      <p className="text-gray-600">Memuat data pemesanan...</p>
    </div>
  );
};

export default LoadingIndicator;
