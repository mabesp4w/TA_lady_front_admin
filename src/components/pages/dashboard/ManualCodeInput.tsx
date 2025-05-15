/** @format */

import React, { useState } from "react";

interface ManualCodeInputProps {
  onSubmit: (code: string) => void;
}

const ManualCodeInput: React.FC<ManualCodeInputProps> = ({ onSubmit }) => {
  const [manualCode, setManualCode] = useState<string>("");

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (manualCode.trim()) {
      onSubmit(manualCode.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <input
        type="text"
        value={manualCode}
        onChange={(e) => setManualCode(e.target.value)}
        placeholder="Atau masukkan kode pemesanan"
        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="bg-gray-800 hover:bg-gray-900 text-white font-medium py-2 px-4 rounded-lg transition-colors"
      >
        Cari
      </button>
    </form>
  );
};

export default ManualCodeInput;
