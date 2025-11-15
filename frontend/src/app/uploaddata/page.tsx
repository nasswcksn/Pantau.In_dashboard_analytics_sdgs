"use client";

import { useState, useEffect, useCallback } from "react";
import { FiRefreshCw, FiPlayCircle, FiInfo } from "react-icons/fi";
import { createClient } from "@supabase/supabase-js";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:9000";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
);

type RowData = Record<string, any> & { nama_desa: string };
type ColumnData = { key: string; label: string; isEditable: boolean };

const sdgColors: Record<number, string> = {
  1: "text-red-400",
  2: "text-orange-400",
  3: "text-green-400",
  4: "text-sky-400",
  5: "text-pink-400",
  6: "text-cyan-400",
  7: "text-yellow-300",
  8: "text-amber-400",
  9: "text-rose-400",
  10: "text-purple-400",
  11: "text-lime-400",
  12: "text-emerald-400",
  13: "text-teal-400",
  14: "text-blue-400",
  15: "text-green-300",
  16: "text-indigo-400",
  17: "text-sky-300",
};

const sdgDescriptions: Record<number, string> = {
  1: "💰 SDG 1 – Tanpa Kemiskinan:\n• r1502_7 = Keberadaan layanan kesehatan (1 = Ada, 2 = Tidak Ada)\n• r1502_8 = Akses bantuan sosial (1 = Ya, 2 = Tidak)",
  2: "🌾 SDG 2 – Tanpa Kelaparan:\n• r201 = Akses pangan cukup (1 = Ya, 2 = Tidak)\n• r202 = Produksi pertanian aktif (1 = Aktif, 2 = Tidak Aktif)",
  3: "⚕️ SDG 3 – Kesehatan & Kesejahteraan:\n• r301 = Jumlah fasilitas kesehatan\n• r302 = Rasio tenaga medis per 1000 penduduk",
  4: "📚 SDG 4 – Pendidikan Berkualitas:\n• r401 = Rata-rata lama sekolah\n• r402 = Jumlah lembaga pendidikan",
  5: "♀️ SDG 5 – Kesetaraan Gender:\n• r501 = Partisipasi perempuan di pendidikan tinggi (%)",
  6: "🚰 SDG 6 – Air Bersih & Sanitasi Layak:\n• r601 = Rumah dengan air bersih (%)\n• r602 = Rumah dengan sanitasi layak (%)",
  7: "⚡ SDG 7 – Energi Bersih & Terjangkau:\n• r701 = Akses listrik (% rumah tangga)\n• r702 = Sumber energi utama",
  8: "💼 SDG 8 – Pekerjaan Layak & Pertumbuhan Ekonomi:\n• r801 = Tingkat pengangguran terbuka (%)",
  9: "🏗️ SDG 9 – Industri, Inovasi, & Infrastruktur:\n• r901 = Akses jalan layak\n• r902 = Jumlah industri kecil/menengah",
  10: "⚖️ SDG 10 – Berkurangnya Kesenjangan:\n• r1001 = Rasio Gini\n• r1002 = Pendapatan rata-rata antar kelompok",
  11: "🏘️ SDG 11 – Kota & Permukiman Berkelanjutan:\n• r1101 = Akses transportasi publik\n• r1102 = Persentase kawasan kumuh",
  12: "♻️ SDG 12 – Konsumsi & Produksi Bertanggung Jawab:\n• r1201 = Keberadaan bank sampah\n• r1202 = Kegiatan 3R masyarakat",
  13: "🌍 SDG 13 – Penanganan Perubahan Iklim:\n• r1301 = Kesiapan adaptasi bencana\n• r1302 = Penanaman pohon/taman kota",
  14: "🐟 SDG 14 – Ekosistem Lautan:\n• r1401 = Kondisi terumbu karang\n• r1402 = Kegiatan konservasi laut",
  15: "🌳 SDG 15 – Ekosistem Daratan:\n• r1501 = Luas hutan desa\n• r1502_7 = Kepadatan vegetasi (1=Rendah, 2=Sedang, 3=Tinggi)",
  16: "🕊️ SDG 16 – Perdamaian & Kelembagaan:\n• r1601 = Kasus kejahatan per tahun\n• r1602 = Keberadaan forum musyawarah desa",
  17: "🤝 SDG 17 – Kemitraan untuk Tujuan:\n• r1701 = Jumlah kemitraan aktif\n• r1702 = Dukungan pemerintah/NGO",
};

const sdgOptions = Object.entries(sdgDescriptions).map(([value, text]) => ({
  value: Number(value),
  label: `SDG ${value} : ${text.split("–")[1].split(":")[0].trim()}`,
}));

async function fetchData(goal: number) {
  const tableName = `sdgs_${goal}`;
  const { data, error } = await supabase.from(tableName).select("*");
  if (error) throw new Error(`Gagal mengambil data: ${error.message}`);
  const filteredData = data.map(({ cluster, arti_cluster, ...rest }) => rest);
  return filteredData as RowData[];
}

export default function ClusteringPage() {
  const [password, setPassword] = useState("");
  const [isAuth, setIsAuth] = useState(false);
  const [goal, setGoal] = useState<number>(1);
  const [data, setData] = useState<RowData[]>([]);
  const [columns, setColumns] = useState<ColumnData[]>([]);
  const [loading, setLoading] = useState(false);
  const [clustering, setClustering] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [clusterLogs, setClusterLogs] = useState<
    { nama_desa: string; cluster: number; arti_cluster: string }[]
  >([]);

  const tryOpen = async () => {
    setMessage(null);
    if (!password) return;
    const res = await fetch("/api/check-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) setIsAuth(true);
    else setMessage("❌ Sandi salah.");
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const fetched = await fetchData(goal);
      setData(fetched);
      if (fetched.length > 0) {
        const keys = Object.keys(fetched[0]);
        const cols: ColumnData[] = keys.map((key) => ({
          key,
          label: key,
          isEditable: key !== "nama_desa",
        }));
        setColumns(cols);
      }
    } catch (e: any) {
      setMessage(`❌ ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, [goal]);

  useEffect(() => {
    if (isAuth) loadData();
  }, [isAuth, loadData]);

  const handleCellChange = (rowIndex: number, key: string, value: string) => {
    const newData = [...data];
    newData[rowIndex][key] = value;
    setData(newData);
  };

  const runClustering = async () => {
    setClustering(true);
    setClusterLogs([]);
    try {
      const res = await fetch(`${BACKEND_URL}/run-clustering`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sdg_number: goal,
          data: data.map((r) =>
            Object.fromEntries(
              Object.entries(r).map(([k, v]) => [k, k === "nama_desa" ? v : Number(v)])
            )
          ),
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      setMessage(`✅ Clustering berhasil (${result.count} baris diperbarui)`);
      if (result.results)
        setClusterLogs(
          result.results.map((r: any) => ({
            nama_desa: r.nama_desa,
            cluster: r.cluster,
            arti_cluster: r.arti_cluster,
          }))
        );
      loadData();
    } catch (e: any) {
      setMessage(`❌ ${e.message}`);
    } finally {
      setClustering(false);
    }
  };

  return (
    <div className="space-y-6 p-6 text-white">
      <h1 className="text-2xl font-semibold text-center">⚙️ Clustering Data SDGs (Admin)</h1>

      {!isAuth ? (
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="rounded-2xl border border-white/10 p-6 grid gap-4 w-full max-w-md text-center bg-white/5 backdrop-blur-sm shadow-lg">
            <div>Masukkan sandi untuk membuka halaman Clustering</div>
            <input
              type="password"
              className="border rounded-xl px-3 py-2 text-center bg-white/70 dark:bg-black/30 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Masukkan sandi admin"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              onClick={tryOpen}
              disabled={!password}
              className="rounded-xl px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold"
            >
              Buka Halaman Clustering
            </button>
            {message && <div className="text-red-500 text-sm">{message}</div>}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* 🔹 Dropdown + Tombol dalam 1 kolom rapat */}
          <div className="flex flex-wrap items-start gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <select
                  value={goal}
                  onChange={(e) => setGoal(Number(e.target.value))}
                  className="p-2 rounded bg-neutral-800 text-white border border-neutral-700"
                  disabled={loading || clustering}
                >
                  {sdgOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={loadData}
                  disabled={loading || clustering}
                  className="p-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-2"
                >
                  <FiRefreshCw className={loading ? "animate-spin" : ""} />
                  {loading ? "Memuat..." : "Refresh Data"}
                </button>
              </div>

              {/* Tombol clustering langsung di bawah dropdown */}
              <button
                onClick={runClustering}
                disabled={clustering || data.length === 0}
                className="p-3 rounded-xl bg-green-600 text-white hover:bg-green-700 transition flex items-center gap-2 font-semibold"
              >
                <FiPlayCircle className={clustering ? "animate-pulse" : ""} />
                {clustering ? "Menjalankan Clustering..." : "Jalankan Clustering"}
              </button>
              {message && (
                <div
                  className={`text-sm font-medium ${
                    message.startsWith("❌") ? "text-red-500" : "text-green-400"
                  }`}
                >
                  {message}
                </div>
              )}
            </div>

            {/* Info SDG tetap di kanan */}
            <div className="flex-1 min-w-[300px] bg-white/5 backdrop-blur-sm border border-neutral-700 rounded-xl p-4 text-sm text-neutral-300 shadow-lg">
              <div className={`flex items-center gap-2 font-semibold mb-2 ${sdgColors[goal]}`}>
                <FiInfo className="text-xl" />
                <span>{sdgDescriptions[goal]?.split(":")[0]}</span>
              </div>
              <p className="whitespace-pre-line text-sm leading-relaxed text-neutral-200 font-normal">
                {sdgDescriptions[goal]?.split(":")[1]?.trim() ||
                  "Belum ada deskripsi untuk SDG ini."}
              </p>
            </div>
          </div>

          {/* --- tabel dan log tetap sama --- */}
          <div className="rounded-xl p-4 overflow-x-auto bg-neutral-900 border border-neutral-700 shadow-lg">
            <h3 className="text-xl font-semibold mb-3 text-white">
              Data Indikator ({data.length} Baris)
            </h3>
            {loading && <div className="text-center py-8 text-neutral-400">Memuat data...</div>}
            {!loading && data.length === 0 && (
              <div className="text-center py-8 text-neutral-500">
                Tidak ada data untuk SDG {goal}.
              </div>
            )}
            {!loading && data.length > 0 && (
              <table className="min-w-full text-sm table-auto bg-neutral-800 text-white rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-neutral-700 text-white">
                    {columns.map((col) => (
                      <th key={col.key} className="px-4 py-2 text-left whitespace-nowrap">
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, i) => (
                    <tr key={i} className="border-b border-neutral-700 hover:bg-neutral-700/60">
                      {columns.map((col) => (
                        <td key={col.key} className="px-4 py-2">
                          {col.isEditable ? (
                            <input
                              type="text"
                              value={row[col.key] ?? ""}
                              onChange={(e) => handleCellChange(i, col.key, e.target.value)}
                              className="w-full p-1 bg-neutral-900 border border-neutral-600 rounded text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          ) : (
                            <span className="font-medium">{row[col.key]}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {clusterLogs.length > 0 && (
              <div className="mt-6 border-t border-neutral-600 pt-4 bg-neutral-900 rounded-lg shadow-inner p-4">
                <h3 className="text-lg font-semibold mb-2 text-white">📋 Log Hasil Clustering</h3>
                <p className="text-sm text-neutral-400 mb-3">
                  Menampilkan hasil <strong>{clusterLogs.length}</strong> baris terbaru
                  yang diperbarui:
                </p>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm table-auto bg-neutral-800 text-white rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-neutral-700">
                        <th className="px-4 py-2 text-left">Nama Desa</th>
                        <th className="px-4 py-2 text-left">Cluster</th>
                        <th className="px-4 py-2 text-left">Arti Cluster</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clusterLogs.map((log, i) => (
                        <tr key={i} className="border-b border-neutral-700 hover:bg-neutral-700/60">
                          <td className="px-4 py-2">{log.nama_desa}</td>
                          <td className="px-4 py-2 font-semibold text-blue-400">
                            {log.cluster}
                          </td>
                          <td className="px-4 py-2 text-green-400">{log.arti_cluster}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

