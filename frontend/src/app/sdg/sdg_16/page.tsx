// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend, LabelList, PieChart, Pie, Cell
} from "recharts";

export default function SDG16Page() {
  const [insight, setInsight] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/insight?sdg=16")
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
    fetch("/api/sdgs16")
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch((err) => console.error(err));
  }, []);

  // Ringkasan total
  const totals = {
    inisiatif: data.filter(d =>
      d["kegiatan pengaktifan sistem keamanan lingkungan berasal dari inisiatif warga"] === "ada"
    ).length,
    regu: data.filter(d =>
      d["Pembentukan/pengaturan regu keamanan oleh warga untuk menjaga keamanan lingkungan di desa/kelurahan"] === "ada"
    ).length,
    pos: data.filter(d =>
      d["Kegiatan Pembangunan/pemeliharaan pos keamanan lingkungan oleh warga"] === "ada"
    ).length,
    lembaga: data.reduce((acc, d) => acc + (d["Jumlah jenis lembaga adat"] || 0), 0),
    konflik: data.reduce((acc, d) => acc + (d["Jumlah kejadian perkelahian Kelompok masyarakat dengan aparat keamanan"] || 0), 0)
  };

  // Tooltip custom untuk bar chart dengan animasi
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

  // Tooltip custom untuk pie chart dengan animasi
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
    const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#8b5cf6", "#06b6d4", "#84cc16"];
    return COLORS[index % COLORS.length];
  };

  // Fungsi untuk hitung data pie
  const countCategory = (key: string) => {
    const counts: Record<string, number> = {};
    data.forEach(row => {
      const val = String(row[key]);
      counts[val] = (counts[val] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value, key }));
  };

  const pieInisiatif = countCategory("kegiatan pengaktifan sistem keamanan lingkungan berasal dari inisiatif warga");
  const pieRegu = countCategory("Pembentukan/pengaturan regu keamanan oleh warga untuk menjaga keamanan lingkungan di desa/kelurahan");
  const piePos = countCategory("Kegiatan Pembangunan/pemeliharaan pos keamanan lingkungan oleh warga");

  // Loading animation
  if (isLoading) {
    return (
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="text-center space-y-4 animate-pulse">
          <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto animate-bounce"></div>
          <p className="text-white text-lg font-semibold">Memuat Data SDG 16...</p>
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
          ⚖️ SDG 16: Perdamaian, Keadilan, dan Kelembagaan yang Tangguh
        </h2>
        <p className="text-sm text-gray-200 mt-2">
          Monitoring inisiatif keamanan, regu keamanan, pos keamanan, lembaga adat, dan konflik
        </p>
      </div>

      {/* Cards Ringkasan dengan animasi */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="glass-2 p-4 rounded-xl text-center shadow border border-white/10 transform transition-all duration-300 hover:scale-105 animate-slide-up">
          <h4 className="font-semibold text-sm text-white">Inisiatif Keamanan</h4>
          <p className="text-xl font-bold text-green-400 animate-count-up">{totals.inisiatif}</p>
          <p className="text-xs text-gray-300">Desa</p>
        </div>
        <div className="glass-2 p-4 rounded-xl text-center shadow border border-white/10 transform transition-all duration-300 hover:scale-105 animate-slide-up" style={{animationDelay: '100ms'}}>
          <h4 className="font-semibold text-sm text-white">Regu Keamanan</h4>
          <p className="text-xl font-bold text-green-400 animate-count-up">{totals.regu}</p>
          <p className="text-xs text-gray-300">Desa</p>
        </div>
        <div className="glass-2 p-4 rounded-xl text-center shadow border border-white/10 transform transition-all duration-300 hover:scale-105 animate-slide-up" style={{animationDelay: '200ms'}}>
          <h4 className="font-semibold text-sm text-white">Pos Keamanan</h4>
          <p className="text-xl font-bold text-green-400 animate-count-up">{totals.pos}</p>
          <p className="text-xs text-gray-300">Desa</p>
        </div>
        <div className="glass-2 p-4 rounded-xl text-center shadow border border-white/10 transform transition-all duration-300 hover:scale-105 animate-slide-up" style={{animationDelay: '300ms'}}>
          <h4 className="font-semibold text-sm text-white">Lembaga Adat</h4>
          <p className="text-xl font-bold text-purple-400 animate-count-up">{totals.lembaga.toLocaleString()}</p>
          <p className="text-xs text-gray-300">Jenis</p>
        </div>
        <div className="glass-2 p-4 rounded-xl text-center shadow border border-white/10 transform transition-all duration-300 hover:scale-105 animate-slide-up" style={{animationDelay: '400ms'}}>
          <h4 className="font-semibold text-sm text-white">Kejadian Konflik</h4>
          <p className="text-xl font-bold text-red-400 animate-count-up">{totals.konflik.toLocaleString()}</p>
          <p className="text-xs text-gray-300">Kejadian</p>
        </div>
      </div>

      {/* Bar Chart untuk lembaga adat dengan animasi */}
      <div className="glass-4 p-6 rounded-2xl shadow-lg border border-white/10 transform transition-all duration-500 animate-fade-in-up">
        <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
          📊 Jumlah Jenis Lembaga Adat per Desa
        </h3>
        <div className="w-full h-96">
          <ResponsiveContainer>
            <BarChart data={data}>
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
              <Bar 
                dataKey="Jumlah jenis lembaga adat" 
                fill="#8b5cf6"
                radius={[6, 6, 0, 0]}
                className="transition-all duration-500"
              >
                <LabelList 
                  dataKey="Jumlah jenis lembaga adat" 
                  position="top" 
                  fill="#fff" 
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Charts kualitatif dengan animasi */}
      <div className="glass-4 p-6 rounded-2xl shadow-lg border border-white/10 transform transition-all duration-500 animate-fade-in-up">
        <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
          🥧 Indikator Keamanan Masyarakat
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { 
              title: "kegiatan pengaktifan sistem keamanan lingkungan berasal dari inisiatif warga", 
              data: pieInisiatif,
              shortTitle: "Inisiatif Keamanan Warga"
            },
            { 
              title: "Pembentukan/pengaturan regu keamanan oleh warga untuk menjaga keamanan lingkungan di desa/kelurahan", 
              data: pieRegu,
              shortTitle: "Regu Keamanan Warga"
            },
            { 
              title: "Kegiatan Pembangunan/pemeliharaan pos keamanan lingkungan oleh warga", 
              data: piePos,
              shortTitle: "Pos Keamanan Lingkungan"
            }
          ].map((item, idx) => (
            <div 
              key={idx} 
              className="glass-2 p-4 rounded-xl shadow border border-white/10 transform transition-all duration-300 hover:scale-[1.02] animate-slide-up"
              style={{animationDelay: `${idx * 150}ms`}}
            >
              <h4 className="text-md font-semibold mb-4 text-center text-white truncate" title={item.title}>
                {item.shortTitle}
              </h4>
              <div className="w-full h-72 flex justify-center">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={item.data}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={90}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      labelLine={false}
                    >
                      {item.data.map((entry, i) => (
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
          ))}
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