// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend, LabelList, PieChart, Pie, Cell
} from "recharts";

export default function SDG1Page() {
  const [dataSDG1, setDataSDG1] = useState<any[]>([]);
  const [insight, setInsight] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data SDG1
  useEffect(() => {
    setIsLoading(true);
    fetch("/api/sdgs1")
      .then(res => res.json())
      .then(d => {
        if (d.length > 0) {
          d.sort((a, b) => {
            const va = parseFloat(a["jumlah surat keterangan miskin diterbitkan"]) || 0;
            const vb = parseFloat(b["jumlah surat keterangan miskin diterbitkan"]) || 0;
            return va - vb;
          });
        }
        setDataSDG1(d);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  // Fetch insight dari LLM
  useEffect(() => {
    fetch("/api/sdgs1_insight")
      .then(res => res.json())
      .then(d => {
        console.log("INSIGHT FETCHED:", d);
        setInsight(d.insight || "Insight tidak tersedia.");
      })
      .catch(err => {
        console.error(err);
        setInsight("Insight tidak tersedia (gagal fetch API).");
      });
  }, []);

  // Ambil semua kolom selain nama_desa dan SKTM
  const availabilityKeys =
    dataSDG1.length > 0
      ? Object.keys(dataSDG1[0]).filter(
          (k) => k !== "nama_desa" && k !== "jumlah surat keterangan miskin diterbitkan"
        )
      : [];

  const COLORS = ["#22c55e", "#ef4444"];

  // === Hitung Ringkasan ===
  const totalSKTM = dataSDG1.reduce(
    (sum, row) => sum + (parseFloat(row["jumlah surat keterangan miskin diterbitkan"]) || 0),
    0
  );

  // Tooltip untuk SKTM (nama desa + jumlah SKTM)
  const CustomTooltipSKTM = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/90 text-white p-3 rounded-lg text-sm border border-white/20 shadow-lg animate-pulse">
          <p className="font-semibold">{label}</p>
          <p>Jumlah SKTM: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  // Tooltip untuk Pie Chart (daftar desa per kategori)
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const category = payload[0].name;
      const key = payload[0].payload.key;
      const desaList = dataSDG1
        .filter((row) => {
          const val = row[key];
          if (category === "Ada") return val === "ada";
          if (category === "Tidak Ada") return val === "tidak ada";
          return false;
        })
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
          <div className="w-16 h-16 bg-red-500 rounded-full mx-auto animate-bounce"></div>
          <p className="text-white text-lg font-semibold">Memuat Data SDG 1...</p>
          <div className="w-32 h-2 bg-white/20 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-red-500 animate-pulse" style={{ animationDuration: '2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      {/* Header dengan animasi */}
      <div className="glass-4 p-6 rounded-2xl shadow-lg border border-white/10 transform transition-all duration-300 hover:scale-[1.01]">
        <h2 className="text-2xl font-bold drop-shadow text-red-400 animate-pulse">
          🎯 SDG 1: Tanpa Kemiskinan
        </h2>
        <p className="text-sm text-gray-200 mt-2">
          Monitoring Jumlah SKTM diterbitkan dan status keberadaan layanan stunting di setiap desa
        </p>
      </div>

      {/* Grid Ringkasan dengan animasi staggered */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Total SKTM Card */}
        <div className="glass-2 p-6 rounded-xl text-center shadow border border-white/10 transform transition-all duration-300 hover:scale-105 col-span-1 lg:col-span-2 animate-slide-up">
          <h4 className="font-semibold text-lg mb-2 text-white">Total SKTM Diterbitkan</h4>
          <p className="text-4xl font-extrabold text-red-400 animate-count-up">
            {totalSKTM.toLocaleString()}
          </p>
          <p className="text-xs text-gray-300 mt-2">Surat Keterangan Tidak Mampu</p>
        </div>

        {/* Cards Ringkasan per Layanan */}
        {availabilityKeys.map((key, idx) => {
          let adaCount = 0;
          let tidakCount = 0;
          dataSDG1.forEach((row) => {
            if (row[key] === "ada") adaCount++;
            else if (row[key] === "tidak ada") tidakCount++;
          });

          return (
            <div 
              key={idx} 
              className="glass-2 p-4 rounded-xl shadow text-center border border-white/10 transform transition-all duration-300 hover:scale-105 animate-slide-up"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <h4 className="font-semibold text-sm mb-2 text-white truncate" title={key}>
                {key}
              </h4>
              <div className="flex justify-around">
                <div className="transform transition-transform duration-300 hover:scale-110">
                  <p className="text-green-400 font-bold text-lg">{adaCount}</p>
                  <p className="text-xs text-gray-300">Ada</p>
                </div>
                <div className="transform transition-transform duration-300 hover:scale-110">
                  <p className="text-red-400 font-bold text-lg">{tidakCount}</p>
                  <p className="text-xs text-gray-300">Tidak</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bar Chart SKTM dengan animasi */}
      <div className="glass-4 p-6 rounded-2xl shadow-lg border border-white/10 transform transition-all duration-500 animate-fade-in-up">
        <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
          📊 Jumlah SKTM per Desa
        </h3>
        <div className="w-full h-96">
          <ResponsiveContainer>
            <BarChart data={dataSDG1}>
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
              <Tooltip content={<CustomTooltipSKTM />} />
              <Legend />
              <Bar
                dataKey="jumlah surat keterangan miskin diterbitkan"
                fill="#ef4444"
                radius={[6, 6, 0, 0]}
                className="transition-all duration-500"
              >
                <LabelList
                  dataKey="jumlah surat keterangan miskin diterbitkan"
                  position="top"
                  fill="#fff"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid Pie Charts dengan animasi */}
      <div className="glass-4 p-6 rounded-2xl shadow-lg border border-white/10 transform transition-all duration-500 animate-fade-in-up">
        <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
          🥧 Keberadaan Layanan Terkait Stunting
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {availabilityKeys.map((key, idx) => {
            const counts = { ada: 0, "tidak ada": 0 };
            dataSDG1.forEach((row) => {
              if (row[key] === "ada") counts.ada++;
              else if (row[key] === "tidak ada") counts["tidak ada"]++;
            });
            const pieData = [
              { name: "Ada", value: counts.ada, key },
              { name: "Tidak Ada", value: counts["tidak ada"], key },
            ];
            return (
              <div 
                key={idx} 
                className="glass-2 p-4 rounded-xl shadow border border-white/10 transform transition-all duration-300 hover:scale-[1.02] animate-slide-up"
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                <h4 className="text-md font-semibold mb-3 text-center text-white truncate" title={key}>
                  {key}
                </h4>
                <div className="w-full h-64 flex justify-center">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={80}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        labelLine={false}
                      >
                        {pieData.map((entry, i) => {
                          const fillColor = entry.name === "Tidak Ada" ? "#ef4444" : "#22c55e";
                          return <Cell key={i} fill={fillColor} />;
                        })}
                      </Pie>
                      <Legend />
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Card Insight dengan animasi */}
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