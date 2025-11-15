// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend, LabelList, PieChart, Pie, Cell
} from "recharts";

export default function SDG2Page() {
  const [dataSDG2, setDataSDG2] = useState<any[]>([]);
  const [insight, setInsight] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/insight?sdg=2")
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
    fetch("/api/sdgs2")
      .then(res => res.json())
      .then(d => {
        if (d.length > 0) {
          // urutkan berdasarkan penderita gizi buruk
          d.sort((a, b) => {
            const va = parseFloat(a["Jumlah penderita gizi buruk"]) || 0;
            const vb = parseFloat(b["Jumlah penderita gizi buruk"]) || 0;
            return va - vb;
          });
        }
        setDataSDG2(d);
      })
      .catch(err => console.error(err));
  }, []);

  const COLORS = ["#22c55e", "#ef4444", "#3b82f6", "#f59e0b", "#8b5cf6", "#06b6d4"];

  // === Hitung Ringkasan ===
  const totalGiziBuruk = dataSDG2.reduce(
    (sum, row) => sum + (parseFloat(row["Jumlah penderita gizi buruk"]) || 0),
    0
  );

  const totalLuasPertanian = dataSDG2.reduce(
    (sum, row) => sum + (parseFloat(row["Luas areal pertanian yang terdampak bencana alam"]) || 0),
    0
  );

  // Tooltip custom untuk bar chart numerik
  const CustomTooltipBar = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/90 text-white p-3 rounded-lg text-sm border border-white/20 shadow-lg animate-pulse">
          <p className="font-semibold">{label}</p>
          {payload.map((p: any, i: number) => (
            <p key={i} className="flex items-center gap-2">
              <span 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: p.color }}
              ></span>
              {p.name}: {p.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Tooltip custom untuk pie chart
  const CustomTooltipPie = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const category = payload[0].name;
      const key = payload[0].payload.key;
      const desaList = dataSDG2
        .filter((row) => row[key] === category)
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
          <div className="w-16 h-16 bg-yellow-500 rounded-full mx-auto animate-bounce"></div>
          <p className="text-white text-lg font-semibold">Memuat Data SDG 2...</p>
          <div className="w-32 h-2 bg-white/20 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-yellow-500 animate-pulse" style={{ animationDuration: '2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      {/* Header dengan animasi */}
      <div className="glass-4 p-6 rounded-2xl shadow-lg border border-white/10 transform transition-all duration-300 hover:scale-[1.01]">
        <h2 className="text-2xl font-bold drop-shadow text-yellow-400 animate-pulse">
          🌾 SDG 2: Tanpa Kelaparan
        </h2>
        <p className="text-sm text-gray-200 mt-2">
          Monitoring Gizi Buruk, Luas Areal Pertanian Terdampak, Kerawanan Pangan, Pupuk Organik, dan Akses Jalan Pertanian
        </p>
      </div>

      {/* Cards Ringkasan dengan animasi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-2 p-6 rounded-xl text-center shadow border border-white/10 transform transition-all duration-300 hover:scale-105 animate-slide-up">
          <h4 className="font-semibold text-lg mb-2 text-white">Total Penderita Gizi Buruk</h4>
          <p className="text-4xl font-extrabold text-red-400 animate-count-up">
            {totalGiziBuruk.toLocaleString()}
          </p>
          <p className="text-xs text-gray-300 mt-2">Orang</p>
        </div>
        <div className="glass-2 p-6 rounded-xl text-center shadow border border-white/10 transform transition-all duration-300 hover:scale-105 animate-slide-up" style={{animationDelay: '100ms'}}>
          <h4 className="font-semibold text-lg mb-2 text-white">Total Luas Areal Pertanian Terdampak</h4>
          <p className="text-4xl font-extrabold text-blue-400 animate-count-up">
            {totalLuasPertanian.toLocaleString()}
          </p>
          <p className="text-xs text-gray-300 mt-2">Hektar</p>
        </div>
      </div>

      {/* Bar Chart dengan animasi */}
      <div className="glass-4 p-6 rounded-2xl shadow-lg border border-white/10 transform transition-all duration-500 animate-fade-in-up">
        <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
          📊 Jumlah Gizi Buruk & Luas Areal Pertanian Terdampak per Desa
        </h3>
        <div className="w-full h-96">
          <ResponsiveContainer>
            <BarChart data={dataSDG2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff30" />
              <XAxis 
                dataKey="nama_desa" 
                stroke="#fff" 
                tick={{ fill: "#fff", fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="#fff" tick={{ fill: "#fff" }} />
              <Tooltip content={<CustomTooltipBar />} />
              <Legend />
              <Bar
                dataKey="Jumlah penderita gizi buruk"
                fill="#ef4444"
                radius={[6, 6, 0, 0]}
                className="transition-all duration-500"
              >
                <LabelList 
                  dataKey="Jumlah penderita gizi buruk" 
                  position="top" 
                  fill="#fff" 
                  fontSize={12}
                />
              </Bar>
              <Bar
                dataKey="Luas areal pertanian yang terdampak bencana alam"
                fill="#3b82f6"
                radius={[6, 6, 0, 0]}
                className="transition-all duration-500"
              >
                <LabelList 
                  dataKey="Luas areal pertanian yang terdampak bencana alam" 
                  position="top" 
                  fill="#fff" 
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Charts dengan animasi */}
      <div className="glass-4 p-6 rounded-2xl shadow-lg border border-white/10 transform transition-all duration-500 animate-fade-in-up">
        <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
          🥧 Indikator Kualitatif
        </h3>
        <div className="grid grid-cols-3 gap-5">
          {[
            "Kejadian Kearawanan Pangan",
            "Penggalakan penggunaan pupuk organik di lahan pertanian",
            "Akses jalan darat dari sentra produksi pertanian ke jalan utama dapat dilalui kendaraan roda 4 lebih"
          ].map((key, idx) => {
            const counts: Record<string, number> = {};
            dataSDG2.forEach((row) => {
              const val = row[key];
              if (val) counts[val] = (counts[val] || 0) + 1;
            });
            const pieData = Object.entries(counts).map(([name, value]) => ({ name, value, key }));

            return (
              <div 
                key={idx} 
                className="glass-2 p-4 rounded-xl shadow border border-white/10 transform transition-all duration-300 hover:scale-[1.02] animate-slide-up"
                style={{animationDelay: `${idx * 150}ms`}}
              >
                <h4 className="text-md font-semibold mb-3 text-center text-white truncate" title={key}>
                  {key}
                </h4>
                <div className="w-full h-96 flex justify-center">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={100}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        labelLine={false}
                      >
                        {pieData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend />
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