// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip
} from "recharts";

export default function SDG11Page() {
  const [insight, setInsight] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/insight?sdg=11")
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
    fetch("/api/sdgs11")
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch((err) => console.error(err));
  }, []);

  // Warna kategori
  const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#8b5cf6", "#06b6d4", "#84cc16"];

  // Ringkasan Cards
  const summary = {
    permukimanKumuh: data.filter((d) => d["Keberadaan permukiman kumuh (sanitasi lingkungan buruk, bangunan padat dan sebagian besar tidak layak huni)"] === "ada").length,
    sistemPeringatan: data.filter((d) => d["Fasilitas sistem peringatan dini bencana alam"] === "ada").length,
    rambuEvakuasi: data.filter((d) => d["Fasilitas Rambu–rambu dan jalur evakuasi bencana"] === "ada").length,
    desaTangguh: data.filter((d) => d["Status Desa Tangguh Bencana"] === "termasuk").length,
    programLingkungan: data.filter((d) => d["Keberadaan program pengelolaan lingkungan perumahan desa/kelurahan"] === "ada").length,
  };

  // Tooltip custom dengan animasi
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

  // Fungsi untuk menentukan warna berdasarkan kondisi - DISEMPURNAKAN
  const getColorForPieChart = (name: string, index: number) => {
    const nameLower = name.toLowerCase();
    
    // SEMUA kondisi "tidak ada" atau "tidak termasuk" berwarna MERAH
    if (nameLower.includes("tidak ada") || nameLower.includes("tidak termasuk")) {
      return "#ef4444";
    }
    
    // SEMUA kondisi "ada" atau "termasuk" berwarna HIJAU
    if (nameLower.includes("ada") || nameLower.includes("termasuk")) {
      return "#22c55e";
    }
    
    // Untuk nilai lainnya, gunakan warna dari palette
    return COLORS[index % COLORS.length];
  };

  // Fungsi render Pie Chart per indikator dengan animasi
  const renderPieChart = (key: string, idx: number) => {
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

    // Buat judul yang lebih pendek untuk display
    const getShortTitle = (fullKey: string) => {
      const titles: Record<string, string> = {
        "Keberadaan permukiman kumuh (sanitasi lingkungan buruk, bangunan padat dan sebagian besar tidak layak huni)": "Permukiman Kumuh",
        "Fasilitas sistem peringatan dini bencana alam": "Sistem Peringatan Dini",
        "Fasilitas Rambu–rambu dan jalur evakuasi bencana": "Rambu & Jalur Evakuasi",
        "Status Desa Tangguh Bencana": "Desa Tangguh Bencana",
        "Keberadaan program pengelolaan lingkungan perumahan desa/kelurahan": "Program Lingkungan Perumahan"
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
          <div className="w-16 h-16 bg-amber-500 rounded-full mx-auto animate-bounce"></div>
          <p className="text-white text-lg font-semibold">Memuat Data SDG 11...</p>
          <div className="w-32 h-2 bg-white/20 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-amber-500 animate-pulse" style={{ animationDuration: '2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header dengan animasi */}
      <div className="glass-4 p-6 rounded-2xl shadow-lg border border-white/10 transform transition-all duration-300 hover:scale-[1.01]">
        <h2 className="text-2xl font-bold drop-shadow text-amber-400 animate-pulse">
          🏙️ SDG 11: Kota dan Permukiman yang Berkelanjutan
        </h2>
        <p className="text-sm text-gray-200 mt-2">
          Monitoring permukiman kumuh, fasilitas bencana, desa tangguh, dan program pengelolaan lingkungan
        </p>
      </div>

      {/* Cards Ringkasan dengan animasi - DIKOREKSI WARNA */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Permukiman Kumuh: karena ini kondisi negatif, "ada" = merah */}
        <div className="glass-2 p-4 rounded-xl text-center shadow border border-white/10 transform transition-all duration-300 hover:scale-105 animate-slide-up">
          <h4 className="font-semibold text-sm text-white">Permukiman Kumuh</h4>
          <p className="text-xl font-bold text-red-400 animate-count-up">{summary.permukimanKumuh}</p>
          <p className="text-xs text-gray-300">Desa</p>
        </div>
        
        {/* Fasilitas positif: "ada" = hijau */}
        <div className="glass-2 p-4 rounded-xl text-center shadow border border-white/10 transform transition-all duration-300 hover:scale-105 animate-slide-up" style={{animationDelay: '100ms'}}>
          <h4 className="font-semibold text-sm text-white">Sistem Peringatan</h4>
          <p className="text-xl font-bold text-green-400 animate-count-up">{summary.sistemPeringatan}</p>
          <p className="text-xs text-gray-300">Desa</p>
        </div>
        
        <div className="glass-2 p-4 rounded-xl text-center shadow border border-white/10 transform transition-all duration-300 hover:scale-105 animate-slide-up" style={{animationDelay: '200ms'}}>
          <h4 className="font-semibold text-sm text-white">Rambu Evakuasi</h4>
          <p className="text-xl font-bold text-green-400 animate-count-up">{summary.rambuEvakuasi}</p>
          <p className="text-xs text-gray-300">Desa</p>
        </div>
        
        <div className="glass-2 p-4 rounded-xl text-center shadow border border-white/10 transform transition-all duration-300 hover:scale-105 animate-slide-up" style={{animationDelay: '300ms'}}>
          <h4 className="font-semibold text-sm text-white">Desa Tangguh</h4>
          <p className="text-xl font-bold text-green-400 animate-count-up">{summary.desaTangguh}</p>
          <p className="text-xs text-gray-300">Desa</p>
        </div>
        
        <div className="glass-2 p-4 rounded-xl text-center shadow border border-white/10 transform transition-all duration-300 hover:scale-105 animate-slide-up" style={{animationDelay: '400ms'}}>
          <h4 className="font-semibold text-sm text-white">Program Lingkungan</h4>
          <p className="text-xl font-bold text-green-400 animate-count-up">{summary.programLingkungan}</p>
          <p className="text-xs text-gray-300">Desa</p>
        </div>
      </div>

      {/* Pie Charts dengan animasi */}
      <div className="glass-4 p-6 rounded-2xl shadow-lg border border-white/10 transform transition-all duration-500 animate-fade-in-up">
        <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
          🥧 Indikator Kota dan Permukiman Berkelanjutan
        </h3>
        <div className="grid grid-cols-2 gap-6">
          {[
            "Keberadaan permukiman kumuh (sanitasi lingkungan buruk, bangunan padat dan sebagian besar tidak layak huni)",
            "Fasilitas sistem peringatan dini bencana alam",
            "Fasilitas Rambu–rambu dan jalur evakuasi bencana",
            "Status Desa Tangguh Bencana",
            "Keberadaan program pengelolaan lingkungan perumahan desa/kelurahan"
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