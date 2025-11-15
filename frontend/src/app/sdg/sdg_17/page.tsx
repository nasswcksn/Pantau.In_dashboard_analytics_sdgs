// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip
} from "recharts";
import { motion } from "framer-motion";

export default function SDG17Page() {
  const [insight, setInsight] = useState<string>("");
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/insight?sdg=17")
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
    fetch("/api/sdgs17")
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch((err) => console.error(err));
  }, []);

  // Hitung summary untuk cards
  const summary = {
    kerjasamaAntar: data.filter(d => d["Keberadaan kerjasama antar desa"] === "ada").length,
    kerjasamaPihak: data.filter(d => d["Keberadaan kerjasama desa dengan pihak ketiga"] === "ada").length,
    proklim: data.filter(d => d["Status desa termasuk Program Kampung Iklim (Proklim)"] === "termasuk").length,
    perhutanan: data.filter(d => d["Keberadaan Program perhutanan sosial"] === "ada").length,
    siaran: data.filter(d => d["status penerimaan program siaran televisi/radio swasta"] === "bisa diterima").length,
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2
      }
    }
  };

  // Tooltip custom untuk Pie
  const CustomTooltipPie = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { name, value, key } = payload[0].payload;
      const desaList = data.filter(row => String(row[key]) === name).map(row => row.nama_desa);

      return (
        <div className="bg-black/90 text-white p-3 rounded-lg text-sm border border-white/20 shadow-lg">
          <p className="font-semibold">{name} ({value})</p>
          <p className="italic text-gray-200 mt-1">Desa:</p>
          <ul className="list-disc list-inside max-h-32 overflow-y-auto">
            {desaList.map((d, i) => <li key={i} className="text-sm text-gray-100">{d}</li>)}
          </ul>
        </div>
      );
    }
    return null;
  };

  // Fungsi untuk menentukan warna berdasarkan nilai - KONSISTEN dengan SDG 16
  const getColorForPieChart = (name: string, index: number) => {
    const nameLower = String(name).toLowerCase();
    
    // SEMUA kondisi "tidak ada" atau "tidak" berwarna MERAH
    if (nameLower.includes("tidak ada") || nameLower.includes("tidak") || nameLower.includes("tidak termasuk") || nameLower.includes("tidak bisa")) {
      return "#ef4444";
    }
    
    // SEMUA kondisi "ada" berwarna HIJAU
    if (nameLower.includes("ada") || nameLower.includes("termasuk") || nameLower.includes("bisa diterima")) {
      return "#22c55e";
    }
    
    // Untuk nilai lainnya, gunakan warna dari palette
    const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#8b5cf6", "#06b6d4", "#84cc16"];
    return COLORS[index % COLORS.length];
  };

  // Fungsi untuk render PieChart per indikator
  const renderPieChart = (key: string, title: string, shortTitle: string, index: number) => {
    const counts: Record<string, number> = {};
    data.forEach(row => {
      const val = String(row[key]);
      counts[val] = (counts[val] || 0) + 1;
    });
    const pieData = Object.entries(counts).map(([name, value]) => ({ name, value, key }));

    return (
      <div 
        key={index}
        className="glass-2 p-4 rounded-xl shadow border border-white/10 transform transition-all duration-300 hover:scale-[1.02] animate-slide-up"
        style={{animationDelay: `${index * 150}ms`}}
      >
        <h4 className="text-md font-semibold mb-4 text-center text-white truncate" title={title}>
          📊 {shortTitle}
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
              <Legend 
                verticalAlign="bottom" 
                layout="horizontal" 
                align="center"
                wrapperStyle={{ fontSize: '12px', color: '#fff' }}
              />
              <Tooltip content={<CustomTooltipPie />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  // Loading animation yang konsisten dengan SDG 16
  if (isLoading) {
    return (
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="text-center space-y-4 animate-pulse">
          <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto animate-bounce"></div>
          <p className="text-white text-lg font-semibold">Memuat Data SDG 17...</p>
          <div className="w-32 h-2 bg-white/20 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-blue-500 animate-pulse" style={{ animationDuration: '2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="glass-4 p-6 rounded-2xl shadow-lg border border-white/10 transform transition-all duration-300 hover:scale-[1.01]">
        <h2 className="text-2xl font-bold drop-shadow text-blue-400 animate-pulse">
          🌍 SDG 17: Kemitraan untuk Mencapai Tujuan
        </h2>
        <p className="text-sm text-gray-200 mt-2">
          Visualisasi: Kerjasama antar desa, pihak ketiga, Proklim, perhutanan sosial, dan siaran swasta
        </p>
      </div>

      {/* Cards Ringkasan */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { title: "Kerjasama Antar Desa", value: summary.kerjasamaAntar, emoji: "🤝", color: "text-green-400" },
          { title: "Kerjasama dgn Pihak Ketiga", value: summary.kerjasamaPihak, emoji: "💼", color: "text-green-400" },
          { title: "Program Proklim", value: summary.proklim, emoji: "🌿", color: "text-green-400" },
          { title: "Perhutanan Sosial", value: summary.perhutanan, emoji: "🌳", color: "text-green-400" },
          { title: "Akses Siaran Swasta", value: summary.siaran, emoji: "📺", color: "text-green-400" },
        ].map((item, index) => (
          <div
            key={index}
            className="glass-2 p-4 rounded-xl text-center shadow border border-white/10 transform transition-all duration-300 hover:scale-105 animate-slide-up"
            style={{animationDelay: `${index * 100}ms`}}
          >
            <div className="text-2xl mb-2">{item.emoji}</div>
            <h4 className="font-semibold text-sm text-white mb-2">{item.title}</h4>
            <p className={`text-xl font-bold ${item.color} animate-count-up`}>
              {item.value}
            </p>
            <p className="text-xs text-gray-300">Desa</p>
          </div>
        ))}
      </div>

      {/* Pie Charts */}
      <div className="glass-4 p-6 rounded-2xl shadow-lg border border-white/10 transform transition-all duration-500 animate-fade-in-up">
        <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
          📈 Indikator SDG 17
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {renderPieChart("Keberadaan kerjasama antar desa", "Keberadaan kerjasama antar desa", "Kerjasama Antar Desa", 0)}
          {renderPieChart("Keberadaan kerjasama desa dengan pihak ketiga", "Keberadaan kerjasama desa dengan pihak ketiga", "Kerjasama dengan Pihak Ketiga", 1)}
          {renderPieChart("Status desa termasuk Program Kampung Iklim (Proklim)", "Status desa termasuk Program Kampung Iklim (Proklim)", "Program Kampung Iklim", 2)}
          {renderPieChart("Keberadaan Program perhutanan sosial", "Keberadaan Program perhutanan sosial", "Perhutanan Sosial", 3)}
          {renderPieChart("status penerimaan program siaran televisi/radio swasta", "status penerimaan program siaran televisi/radio swasta", "Akses Siaran Swasta", 4)}
        </div>
      </div>
    
      {/* Insight Card */}
      <div className="glass-4 p-6 rounded-2xl shadow-lg border border-white/10 transform transition-all duration-500 animate-fade-in-up">
        <h3 className="text-lg font-semibold mb-3 text-blue-400 flex items-center gap-2">
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