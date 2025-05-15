/** @format */

import React from "react";
import { AlertCircle } from "lucide-react";

interface ErrorDisplayProps {
  message: string | null;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start mt-4">
      <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
      <p>{message}</p>
    </div>
  );
};

export default ErrorDisplay;
