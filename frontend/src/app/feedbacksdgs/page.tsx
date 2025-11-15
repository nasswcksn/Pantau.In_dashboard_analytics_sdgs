"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import FeedbackForm from "../components/FeedbackForm";

const FeedbackMap = dynamic(() => import("../components/FeedbackMap"), { ssr: false });

const sdgOptions = [
  { value: 1, label: "SDG 1 : Tanpa Kemiskinan" },
  { value: 2, label: "SDG 2 : Tanpa Kelaparan" },
  { value: 3, label: "SDG 3 : Kehidupan Sehat dan Sejahtera" },
  { value: 4, label: "SDG 4 : Pendidikan Berkualitas" },
  { value: 5, label: "SDG 5 : Kesetaraan Gender" },
  { value: 6, label: "SDG 6 : Air Bersih dan Sanitasi Layak" },
  { value: 7, label: "SDG 7 : Energi Bersih dan Terjangkau" },
  { value: 8, label: "SDG 8 : Pekerjaan Layak dan Pertumbuhan Ekonomi" },
  { value: 9, label: "SDG 9 : Industri, Inovasi, dan Infrastruktur" },
  { value: 10, label: "SDG 10 : Berkurangnya Kesenjangan" },
  { value: 11, label: "SDG 11 : Kota dan Permukiman yang Berkelanjutan" },
  { value: 12, label: "SDG 12 : Konsumsi dan Produksi yang Bertanggung Jawab" },
  { value: 13, label: "SDG 13 : Penanganan Perubahan Iklim" },
  { value: 14, label: "SDG 14 : Ekosistem Lautan" },
  { value: 15, label: "SDG 15 : Ekosistem Daratan" },
  { value: 16, label: "SDG 16 : Perdamaian, Keadilan, dan Kelembagaan yang Tangguh" },
  { value: 17, label: "SDG 17 : Kemitraan untuk Mencapai Tujuan" },
];

export default function FeedbackSDGsPage() {
  const [selectedGoal, setSelectedGoal] = useState<number | undefined>(undefined);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleFormSuccess = () => {
    // Trigger peta untuk refresh
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Pengajuan Masalah SDGs</h1>
        <p className="text-neutral-400">
          Warga dapat mengajukan masalah spesifik yang terkait dengan Tujuan Pembangunan Berkelanjutan (SDGs).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-1">
          <FeedbackForm onSuccess={handleFormSuccess} />
        </div>

        {/* Map Section */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <h2 className="text-xl font-bold mb-4">Visualisasi Laporan Masalah</h2>

            {/* Filter by SDG Goal */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Filter berdasarkan SDG Goal (Opsional)
              </label>
              <select
                value={selectedGoal || ""}
                onChange={(e) => setSelectedGoal(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full p-2 rounded bg-neutral-800 text-white border border-neutral-600 focus:border-blue-500 focus:outline-none"
              >
                <option value="">Tampilkan Semua SDG</option>
                {sdgOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Map Display */}
            <div className="bg-neutral-900 rounded-lg border border-neutral-700 p-4">
              <FeedbackMap key={refreshTrigger} goal={selectedGoal} />
              <div className="mt-4 text-sm text-neutral-400">
                <p>
                  <strong>Catatan:</strong> Peta menampilkan clustering laporan masalah berdasarkan lokasi dan SDG Goal.
                  Ukuran marker menunjukkan jumlah pelapor pada lokasi tersebut.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-neutral-900 rounded-lg border border-neutral-700 p-6">
        <h2 className="text-lg font-bold mb-4">Panduan Pengajuan Masalah</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-neutral-300">
          <div>
            <h3 className="font-semibold mb-2">Langkah-langkah:</h3>
            <ol className="list-decimal list-inside space-y-1">
              <li>Pilih SDG Goal yang relevan dengan masalah Anda</li>
              <li>Masukkan judul masalah secara singkat</li>
              <li>Jelaskan masalah secara detail dan spesifik</li>
              <li>Masukkan nama dan kontak Anda</li>
              <li>Jika memungkinkan, tambahkan koordinat lokasi masalah</li>
              <li>Klik tombol "Ajukan Masalah"</li>
            </ol>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Tips:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Berikan deskripsi yang jelas dan terukur</li>
              <li>Sertakan data atau bukti jika tersedia</li>
              <li>Gunakan tema/kategori untuk mengorganisir masalah</li>
              <li>Lokasi akan membantu visualisasi di peta</li>
              <li>Kontak Anda membantu kami untuk follow-up</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
