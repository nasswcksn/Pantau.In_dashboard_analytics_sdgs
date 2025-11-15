// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend, LabelList, PieChart, Pie, Cell
} from "recharts";

export default function SDG6Page() {
  const [insight, setInsight] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/insight?sdg=6")
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
    fetch("/api/sdgs6")
      .then((res) => res.json())
      .then((d) => {
        // Urutkan descending berdasarkan Jumlah Lembaga pengelolaan air
        d.sort(
          (a: any, b: any) =>
            (b["Jumlah Lembaga pengelolaan air"] || 0) -
            (a["Jumlah Lembaga pengelolaan air"] || 0)
        );
        setData(d);
      })
      .catch((err) => console.error(err));
  }, []);

  const COLORS = ["#22c55e", "#ef4444", "#3b82f6", "#f59e0b", "#a855f7", "#06b6d4"];

  // Ringkasan untuk card
  const totals = {
    airAman: data.filter((d) => String(d["Akses Air Minum Aman"]).toLowerCase() === "ada").length,
    airTidak: data.filter((d) => String(d["Akses Air Minum Aman"]).toLowerCase() === "tidak ada").length,
    jambanSendiri: data.filter(
      (d) =>
        String(d["Penggunaan fasilitas buang air besar sebagian besar keluarga di desa/kelurahan:"]) ===
        "Jamban sendiri"
    ).length,
    pencemaranAda: data.filter((d) => String(d["Pencemaran Limbah Sungai"]).toLowerCase() === "ada").length,
    pencemaranTidak: data.filter(
      (d) =>
        String(d["Pencemaran Limbah Sungai"]).toLowerCase() === "tidak ada" ||
        d["Pencemaran Limbah Sungai"] === 0
    ).length,
  };

  // Hitung total lembaga pengelolaan air
  const totalLembagaAir = data.reduce(
    (sum, row) => sum + (parseFloat(row["Jumlah Lembaga pengelolaan air"]) || 0),
    0
  );

  // Tooltip custom Bar dengan animasi
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

  // Tooltip custom Pie dengan animasi
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
            {desaList.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </div>
      );
    }
    return null;
  };

  // Fungsi untuk menentukan warna berdasarkan indikator dan nilai
  const getColorForPieChart = (key: string, name: string, index: number) => {
    const nameLower = name.toLowerCase();
    
    // Untuk Akses Air Minum Aman - "tidak ada" berwarna merah
    if (key === "Akses Air Minum Aman") {
      return nameLower.includes("tidak ada") ? "#ef4444" : "#22c55e";
    }
    
    // Untuk Pencemaran Limbah Sungai - "ada" berwarna merah
    if (key === "Pencemaran Limbah Sungai") {
      return nameLower.includes("tidak ada") ? "#ef4444" : "#22c55e";
    }
    
    // Untuk indikator lainnya, gunakan warna default
    if (nameLower.includes("tidak ada") || nameLower.includes("tidak")) {
      return "#ef4444";
    }
    
    return COLORS[index % COLORS.length];
  };

  // Loading animation
  if (isLoading) {
    return (
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="text-center space-y-4 animate-pulse">
          <div className="w-16 h-16 bg-cyan-500 rounded-full mx-auto animate-bounce"></div>
          <p className="text-white text-lg font-semibold">Memuat Data SDG 6...</p>
          <div className="w-32 h-2 bg-white/20 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-cyan-500 animate-pulse" style={{ animationDuration: '2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header dengan animasi */}
      <div className="glass-4 p-6 rounded-2xl shadow-lg border border-white/10 transform transition-all duration-300 hover:scale-[1.01]">
        <h2 className="text-2xl font-bold drop-shadow text-cyan-400 animate-pulse">
          💧 SDG 6: Air Bersih dan Sanitasi Layak
        </h2>
        <p className="text-sm text-gray-200 mt-2">
          Monitoring akses air minum aman, sanitasi, pencemaran limbah sungai, dan lembaga pengelolaan air
        </p>
      </div>

      {/* Cards Ringkasan dengan animasi */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="glass-2 p-4 rounded-xl text-center shadow border border-white/10 transform transition-all duration-300 hover:scale-105 animate-slide-up">
          <h4 className="font-semibold text-sm text-white">Air Minum Aman</h4>
          <p className="text-xl font-bold text-green-400 animate-count-up">{totals.airAman}</p>
          <p className="text-xs text-gray-300">Desa</p>
        </div>
        <div className="glass-2 p-4 rounded-xl text-center shadow border border-white/10 transform transition-all duration-300 hover:scale-105 animate-slide-up" style={{animationDelay: '100ms'}}>
          <h4 className="font-semibold text-sm text-white">Air Minum Tidak Aman</h4>
          <p className="text-xl font-bold text-red-400 animate-count-up">{totals.airTidak}</p>
          <p className="text-xs text-gray-300">Desa</p>
        </div>
        <div className="glass-2 p-4 rounded-xl text-center shadow border border-white/10 transform transition-all duration-300 hover:scale-105 animate-slide-up" style={{animationDelay: '200ms'}}>
          <h4 className="font-semibold text-sm text-white">Jamban Sendiri</h4>
          <p className="text-xl font-bold text-blue-400 animate-count-up">{totals.jambanSendiri}</p>
          <p className="text-xs text-gray-300">Desa</p>
        </div>
        <div className="glass-2 p-4 rounded-xl text-center shadow border border-white/10 transform transition-all duration-300 hover:scale-105 animate-slide-up" style={{animationDelay: '300ms'}}>
          <h4 className="font-semibold text-sm text-white">Pencemaran Ada</h4>
          <p className="text-xl font-bold text-red-400 animate-count-up">{totals.pencemaranAda}</p>
          <p className="text-xs text-gray-300">Desa</p>
        </div>
        <div className="glass-2 p-4 rounded-xl text-center shadow border border-white/10 transform transition-all duration-300 hover:scale-105 animate-slide-up" style={{animationDelay: '400ms'}}>
          <h4 className="font-semibold text-sm text-white">Pencemaran Tidak Ada</h4>
          <p className="text-xl font-bold text-green-400 animate-count-up">{totals.pencemaranTidak}</p>
          <p className="text-xs text-gray-300">Desa</p>
        </div>
      </div>

      {/* Card Total Lembaga Pengelolaan Air */}
      <div className="glass-4 p-6 rounded-2xl shadow-lg border border-white/10 transform transition-all duration-500 animate-fade-in-up">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2 text-white flex items-center justify-center">
            🏢 Total Lembaga Pengelolaan Air
          </h3>
          <p className="text-4xl font-extrabold text-cyan-400 animate-count-up mb-2">
            {totalLembagaAir.toLocaleString()}
          </p>
          <p className="text-sm text-gray-300">Lembaga tersebar di {data.length} desa</p>
        </div>
      </div>

      {/* Bar Chart Jumlah Lembaga Pengelolaan Air dengan animasi */}
      <div className="glass-4 p-6 rounded-2xl shadow-lg border border-white/10 transform transition-all duration-500 animate-fade-in-up">
        <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
          📊 Jumlah Lembaga Pengelolaan Air per Desa
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
              <Legend />
              <Bar
                dataKey="Jumlah Lembaga pengelolaan air"
                fill="#06b6d4"
                radius={[6, 6, 0, 0]}
                className="transition-all duration-500"
              >
                <LabelList 
                  dataKey="Jumlah Lembaga pengelolaan air" 
                  position="top" 
                  fill="#fff" 
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Charts untuk indikator kualitatif dengan animasi */}
      <div className="glass-4 p-6 rounded-2xl shadow-lg border border-white/10 transform transition-all duration-500 animate-fade-in-up">
        <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
          🥧 Indikator Kualitatif Sanitasi & Air
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            "Akses Air Minum Aman",
            "Penggunaan fasilitas buang air besar sebagian besar keluarga di desa/kelurahan:",
            "Pencemaran Limbah Sungai",
            "Tempat/saluran pembuangan limbah cair dari air mandi/cuci sebagian besar keluarga:"
          ].map((key, idx) => {
            const counts: Record<string, number> = {};
            data.forEach((row) => {
              const val = String(row[key]);
              if (val) {
                counts[val] = (counts[val] || 0) + 1;
              }
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
                <h4 className="text-md font-semibold mb-4 text-center text-white truncate" title={key}>
                  {key}
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
                            fill={getColorForPieChart(key, entry.name, i)} 
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