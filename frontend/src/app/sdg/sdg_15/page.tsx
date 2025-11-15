// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip
} from "recharts";

export default function SDG15Page() {
  const [insight, setInsight] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/insight?sdg=15")
      .then(res => res.json())
      .then(d => {
        setInsight(d.insight || "sedang memberikan insight berdasarkan data....");
        setIsLoading(false);
      })
      .catch(err => {
        setInsight("sedang memberikan insight berdasarkan data....");
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch("/api/sdgs15")
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch((err) => console.error(err));
  }, []);

  const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#8b5cf6", "#06b6d4", "#84cc16"];

  // Ringkasan untuk cards
  const summary = {
    tepiHutan: data.filter((d) =>
      String(d["Lokasi wilayah desa/kelurahan terhadap kawasan hutan/hutan"]).includes("tepi")
    ).length,
    luarHutan: data.filter((d) =>
      String(d["Lokasi wilayah desa/kelurahan terhadap kawasan hutan/hutan"]).includes("luar")
    ).length,
    adaPenanaman: data.filter((d) =>
      String(d["Penanaman/pemeliharaan pepohonan di lahan kritis, penanaman mangrove, dan sejenisnya oleh masyarakat desa/kelurahan"]).includes("Ada")
    ).length,
  };

  // Tooltip custom dengan animasi
  const CustomTooltipPie = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const category = payload[0].name;
      const key = payload[0].payload.key;
      const desaList = data
        .filter((row) => String(row[key]).trim() === category)
        .map((row) => row.nama_desa);

      return (
        <div className="bg-black/90 text-white p-3 rounded-lg text-sm max-w-xs border border-white/20 shadow-lg">
          <p className="font-semibold">{category}</p>
          <p className="italic mt-1">Desa:</p>
          <ul className="list-disc list-inside max-h-32 overflow-y-auto">
            {desaList.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </div>
      );
    }
    return null;
  };

  // Fungsi untuk menentukan warna berdasarkan kondisi - KONSISTEN
  const getColorForPieChart = (name: string, index: number) => {
    const nameLower = name.toLowerCase();
    
    // SEMUA kondisi "tidak ada" atau "tidak" berwarna MERAH
    if (nameLower.includes("tidak ada") || nameLower.includes("tidak")) {
      return "#ef4444";
    }
    
    // SEMUA kondisi "ada" berwarna HIJAU
    if (nameLower.includes("ada")) {
      return "#22c55e";
    }
    
    // Untuk nilai lainnya, gunakan warna dari palette
    return COLORS[index % COLORS.length];
  };

  // Generate pie chart per indikator dengan animasi
  const renderPieChart = (key: string, idx: number) => {
    const counts: Record<string, number> = {};
    data.forEach((row) => {
      const val = String(row[key]).trim();
      if (val) counts[val] = (counts[val] || 0) + 1;
    });
    const pieData = Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      key,
    }));

    // Buat judul yang lebih pendek untuk display
    const getShortTitle = (fullKey: string) => {
      const titles: Record<string, string> = {
        "Lokasi wilayah desa/kelurahan terhadap kawasan hutan/hutan": "Lokasi terhadap Kawasan Hutan",
        "Kejadian Kebakaran hutan dan lahan": "Kejadian Kebakaran Hutan & Lahan",
        "Penanaman/pemeliharaan pepohonan di lahan kritis, penanaman mangrove, dan sejenisnya oleh masyarakat desa/kelurahan": "Penanaman & Pemeliharaan Pohon",
        "Keberadaan Program perhutanan sosial": "Program Perhutanan Sosial",
        "Kepemilikan hutan milik desa": "Hutan Milik Desa"
      };
      return titles[fullKey] || fullKey;
    };

    return (
      <div 
        key={idx} 
        className="glass-2 p-4 rounded-xl shadow border border-white/10 transform transition-all duration-300 hover:scale-[1.02] animate-slide-up"
        style={{animationDelay: `${idx * 150}ms`}}
      >
        <h4 className="text-md font-semibold mb-4 text-center text-white truncate" title={key}>
          {getShortTitle(key)}
        </h4>
        <div className="w-full h-72 flex justify-center">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                labelLine={false}
              >
                {pieData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={getColorForPieChart(entry.name, i)}
                  />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" layout="horizontal" align="center" />
              <Tooltip content={<CustomTooltipPie />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  // Loading animation
  if (isLoading) {
    return (
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="text-center space-y-4 animate-pulse">
          <div className="w-16 h-16 bg-green-500 rounded-full mx-auto animate-bounce"></div>
          <p className="text-white text-lg font-semibold">Memuat Data SDG 15...</p>
          <div className="w-32 h-2 bg-white/20 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-green-500 animate-pulse" style={{ animationDuration: '2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header dengan animasi */}
      <div className="glass-4 p-6 rounded-2xl shadow-lg border border-white/10 transform transition-all duration-300 hover:scale-[1.01]">
        <h2 className="text-2xl font-bold drop-shadow text-green-400 animate-pulse">
          🌳 SDG 15: Ekosistem Daratan
        </h2>
        <p className="text-sm text-gray-200 mt-2">
          Monitoring kondisi desa terhadap kawasan hutan, kebakaran hutan, penanaman pohon, dan program perhutanan
        </p>
      </div>

      {/* Cards Ringkasan dengan animasi */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="glass-2 p-4 rounded-xl text-center shadow border border-white/10 transform transition-all duration-300 hover:scale-105 animate-slide-up">
          <h4 className="font-semibold text-sm text-white">Desa di Tepi Hutan</h4>
          <p className="text-xl font-bold text-green-400 animate-count-up">{summary.tepiHutan}</p>
          <p className="text-xs text-gray-300">Desa</p>
        </div>
        <div className="glass-2 p-4 rounded-xl text-center shadow border border-white/10 transform transition-all duration-300 hover:scale-105 animate-slide-up" style={{animationDelay: '100ms'}}>
          <h4 className="font-semibold text-sm text-white">Desa di Luar Hutan</h4>
          <p className="text-xl font-bold text-blue-400 animate-count-up">{summary.luarHutan}</p>
          <p className="text-xs text-gray-300">Desa</p>
        </div>
        <div className="glass-2 p-4 rounded-xl text-center shadow border border-white/10 transform transition-all duration-300 hover:scale-105 animate-slide-up" style={{animationDelay: '200ms'}}>
          <h4 className="font-semibold text-sm text-white">Penanaman Pohon</h4>
          <p className="text-xl font-bold text-green-400 animate-count-up">{summary.adaPenanaman}</p>
          <p className="text-xs text-gray-300">Desa</p>
        </div>
      </div>

      {/* Pie Charts dengan animasi */}
      <div className="glass-4 p-6 rounded-2xl shadow-lg border border-white/10 transform transition-all duration-500 animate-fade-in-up">
        <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
          🥧 Indikator Kehutanan & Lingkungan
        </h3>
        <div className="grid grid-cols-2 gap-6">
          {[
            "Lokasi wilayah desa/kelurahan terhadap kawasan hutan/hutan",
            "Kejadian Kebakaran hutan dan lahan",
            "Penanaman/pemeliharaan pepohonan di lahan kritis, penanaman mangrove, dan sejenisnya oleh masyarakat desa/kelurahan",
            "Keberadaan Program perhutanan sosial",
            "Kepemilikan hutan milik desa"
          ].map((key, idx) => renderPieChart(key, idx))}
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