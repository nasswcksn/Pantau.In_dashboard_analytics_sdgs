// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend, LabelList, PieChart, Pie, Cell
} from "recharts";

export default function SDG4Page() {
  const [insight, setInsight] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/insight?sdg=4")
      .then(res => res.json())
      .then(d => {
        setInsight(d.insight || "sedang memberikan insight berdasarkan data....");
        setIsLoading(false);
      })
      .catch(() => {
        setInsight("sedang memberikan insight berdasarkan data....");
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch("/api/sdgs4")
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch((err) => console.error(err));
  }, []);

  const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#eab308", "#ef4444", "#8b5cf6"];

  // Hitung total lembaga komputer (kemungkinan 0 semua)
  const totalLembagaKomputer = data.reduce(
    (sum, row) => sum + (parseFloat(row["Jumlah Lembaga Keterampilan Komputer"]) || 0),
    0
  );

  // Tooltip custom untuk pie chart
  const CustomTooltipPie = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const category = payload[0].name;
      const key = payload[0].payload.key;
      const desaList = data
        .filter((row) => String(row[key]) === category)
        .map((row) => row.nama_desa);

      return (
        <div className="bg-black/90 text-white p-3 rounded-lg text-sm max-w-xs border border-white/20 shadow-lg">
          <p className="font-semibold">{category}</p>
          <p className="italic mt-1">Desa:</p>
          <ul className="list-disc list-inside max-h-32 overflow-y-auto">
            {desaList.map((d, i) => <li key={i}>{d}</li>)}
          </ul>
        </div>
      );
    }
    return null;
  };

  // Loading animation
  if (isLoading) {
    return (
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="text-center space-y-4 animate-pulse">
          <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto animate-bounce"></div>
          <p className="text-white text-lg font-semibold">Memuat Data SDG 4...</p>
          <div className="w-32 h-2 bg-white/20 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-blue-500 animate-pulse" style={{ animationDuration: '2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header dengan animasi */}
      <div className="glass-4 p-6 rounded-2xl shadow-lg border border-white/10 transform transition-all duration-300 hover:scale-[1.01]">
        <h2 className="text-2xl font-bold drop-shadow text-blue-400 animate-pulse">
          📚 SDG 4: Pendidikan Berkualitas
        </h2>
        <p className="text-sm text-gray-200 mt-2">
          Monitoring Akses pendidikan dasar, PAUD, program keaksaraan, paket A/B/C, dan lembaga keterampilan komputer
        </p>
      </div>

      {/* Card Informasi Lembaga Komputer (Mengganti Bar Chart) */}
      <div className="glass-4 p-6 rounded-2xl shadow-lg border border-white/10 transform transition-all duration-500 animate-fade-in-up">
        <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
          💻 Lembaga Keterampilan Komputer
        </h3>
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500/20 rounded-full mb-4 animate-pulse">
            <span className="text-3xl">💻</span>
          </div>
          <h4 className="text-xl font-bold text-white mb-2">
            {totalLembagaKomputer === 0 ? "Belum Tersedia" : `${totalLembagaKomputer} Lembaga`}
          </h4>
          <p className="text-gray-300 max-w-2xl mx-auto">
            {totalLembagaKomputer === 0 
              ? "Saat ini belum terdapat lembaga keterampilan komputer yang tercatat di seluruh desa. Program pelatihan komputer dapat menjadi prioritas pengembangan untuk meningkatkan literasi digital masyarakat."
              : `Terdapat ${totalLembagaKomputer} lembaga keterampilan komputer yang tersebar di berbagai desa.`}
          </p>
          {totalLembagaKomputer === 0 && (
            <div className="mt-4 p-4 bg-yellow-500/20 rounded-lg border border-yellow-500/30 max-w-md mx-auto">
              <p className="text-yellow-300 text-sm">
                💡 Rekomendasi: Pertimbangkan untuk mengembangkan program pelatihan komputer 
                untuk meningkatkan keterampilan digital masyarakat desa.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Pie Charts untuk indikator kualitatif dengan animasi */}
      <div className="glass-4 p-2 rounded-2xl shadow-lg border border-white/10 transform transition-all duration-500 animate-fade-in-up">
        <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
          🥧 Indikator Kualitatif Pendidikan
        </h3>
        <div className="grid grid-cols-2 gap-6">
          {[
            "Akses ke SD Terdekat",
            "Jarak ke PAUD Terdekat", 
            "Ketersediaan Program Keaksaraan",
            "Ketersediaan Program Paket A/B/C"
          ].map((key, idx) => {
            const counts: Record<string, number> = {};
            data.forEach((row) => {
              const val = String(row[key]);
              if (val) counts[val] = (counts[val] || 0) + 1;
            });

            const pieData = Object.entries(counts).map(([name, value]) => ({
              name,
              value,
              key,
            }));

            return (
              <div 
                key={idx} 
                className="glass-2 p-4 rounded-xl shadow border border-white/10 transform transition-all duration-300 hover:scale-[1.02] animate-slide-up"
                style={{animationDelay: `${idx * 150}ms`}}
              >
                <h4 className="text-lg font-semibold mb-4 text-center text-white truncate" title={key}>
                  {key}
                </h4>
                <div className="w-full h-96 flex justify-center">
                  <ResponsiveContainer>
                    <PieChart margin={{ top: 10, right: 10, bottom: 40, left: 10 }}>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={90}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        labelLine={false}
                      >
                        {pieData.map((entry, i) => {
                          const fillColor =
                            entry.name.toLowerCase().includes("tidak ada") || 
                            entry.name.toLowerCase().includes("tidak")
                              ? "#ef4444"
                              : COLORS[i % COLORS.length];
                          return <Cell key={i} fill={fillColor} />;
                        })}
                      </Pie>
                      <Legend verticalAlign="bottom" layout="horizontal" align="center" />
                      <Tooltip content={<CustomTooltipPie />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Insight Card dengan animasi */}
      <div className="glass-4 p-6 rounded-2xl shadow-lg border border-white/10 transform transition-all duration-500 animate-fade-in-up">
        <h3 className="text-lg font-semibold mb-3 text-blue-400 flex items-center">
          💡 Insight Otomatis
        </h3>
        <div className="bg-black/30 p-4 rounded-lg border border-blue-500/30">
          <p className="text-sm text-gray-100 whitespace-pre-line leading-relaxed animate-pulse-slow">
            {insight || "Sedang menganalisis data untuk memberikan insight..."}
          </p>
        </div>
      </div>
    </div>
  );
}