// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend, LabelList, PieChart, Pie, Cell
} from "recharts";

export default function SDG3Page() {
  const [insight, setInsight] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [activeFilters, setActiveFilters] = useState({
    puskesmas: true,
    posyandu: true,
    kader: true
  });

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/insight?sdg=3")
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
    fetch("/api/sdgs3")
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch((err) => console.error(err));
  }, []);

  const COLORS = ["#22c55e", "#ef4444", "#3b82f6", "#f59e0b", "#8b5cf6", "#06b6d4"];

  // === Hitung total untuk card ===
  const totalPuskesmas = data.reduce(
    (sum, row) => sum + (parseFloat(row["Jumlah Puskesmas dengan sarana Rawat Inap"]) || 0),
    0
  );
  const totalPosyandu = data.reduce(
    (sum, row) => sum + (parseFloat(row["Jumlah Posyandu Aktif"]) || 0),
    0
  );
  const totalKader = data.reduce(
    (sum, row) => sum + (parseFloat(row["Jumlah Kader KB/KIA"]) || 0),
    0
  );

  // Filter handlers
  const toggleFilter = (filterName: keyof typeof activeFilters) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  const selectAllFilters = () => {
    setActiveFilters({
      puskesmas: true,
      posyandu: true,
      kader: true
    });
  };

  const clearAllFilters = () => {
    setActiveFilters({
      puskesmas: false,
      posyandu: false,
      kader: false
    });
  };

  // Tooltip custom untuk bar chart
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
      const desaList = data
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
          <div className="w-16 h-16 bg-green-500 rounded-full mx-auto animate-bounce"></div>
          <p className="text-white text-lg font-semibold">Memuat Data SDG 3...</p>
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
          🏥 SDG 3: Kesehatan yang Baik dan Kesejahteraan
        </h2>
        <p className="text-sm text-gray-200 mt-2">
          Monitoring Puskesmas Rawat Inap, Posyandu Aktif, Kader KB/KIA, dan Program Jaminan Kesehatan
        </p>
      </div>

      {/* Cards Ringkasan dengan animasi */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-2 p-6 rounded-xl text-center shadow border border-white/10 transform transition-all duration-300 hover:scale-105 animate-slide-up">
          <h4 className="font-semibold text-lg mb-2 text-white">Total Puskesmas Rawat Inap</h4>
          <p className="text-4xl font-extrabold text-red-400 animate-count-up">
            {totalPuskesmas.toLocaleString()}
          </p>
          <p className="text-xs text-gray-300 mt-2">Unit</p>
        </div>
        <div className="glass-2 p-6 rounded-xl text-center shadow border border-white/10 transform transition-all duration-300 hover:scale-105 animate-slide-up" style={{animationDelay: '100ms'}}>
          <h4 className="font-semibold text-lg mb-2 text-white">Total Posyandu Aktif</h4>
          <p className="text-4xl font-extrabold text-blue-400 animate-count-up">
            {totalPosyandu.toLocaleString()}
          </p>
          <p className="text-xs text-gray-300 mt-2">Unit</p>
        </div>
        <div className="glass-2 p-6 rounded-xl text-center shadow border border-white/10 transform transition-all duration-300 hover:scale-105 animate-slide-up" style={{animationDelay: '200ms'}}>
          <h4 className="font-semibold text-lg mb-2 text-white">Total Kader KB/KIA</h4>
          <p className="text-4xl font-extrabold text-green-400 animate-count-up">
            {totalKader.toLocaleString()}
          </p>
          <p className="text-xs text-gray-300 mt-2">Orang</p>
        </div>
      </div>

      {/* Filter Slicer untuk Bar Chart */}
      <div className="glass-4 p-6 rounded-2xl shadow-lg border border-white/10 transform transition-all duration-300 animate-fade-in-up">
        <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
          🎚️ Filter Data Bar Chart
        </h3>
        <div className="flex flex-wrap gap-4 items-center">
          {/* Filter Toggles */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => toggleFilter('puskesmas')}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                activeFilters.puskesmas 
                  ? 'bg-red-500 text-white border border-red-400 shadow-lg' 
                  : 'bg-gray-700 text-gray-300 border border-gray-600'
              }`}
            >
              🏥 Puskesmas {activeFilters.puskesmas ? '✓' : ''}
            </button>
            
            <button
              onClick={() => toggleFilter('posyandu')}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                activeFilters.posyandu 
                  ? 'bg-blue-500 text-white border border-blue-400 shadow-lg' 
                  : 'bg-gray-700 text-gray-300 border border-gray-600'
              }`}
            >
              🩺 Posyandu {activeFilters.posyandu ? '✓' : ''}
            </button>
            
            <button
              onClick={() => toggleFilter('kader')}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                activeFilters.kader 
                  ? 'bg-green-500 text-white border border-green-400 shadow-lg' 
                  : 'bg-gray-700 text-gray-300 border border-gray-600'
              }`}
            >
              👥 Kader KB/KIA {activeFilters.kader ? '✓' : ''}
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 ml-auto">
            <button
              onClick={selectAllFilters}
              className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold transition-all duration-300 transform hover:scale-105 hover:bg-green-500 border border-green-400"
            >
              Pilih Semua
            </button>
            <button
              onClick={clearAllFilters}
              className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold transition-all duration-300 transform hover:scale-105 hover:bg-red-500 border border-red-400"
            >
              Hapus Semua
            </button>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="mt-3 text-sm text-gray-300">
          Menampilkan: 
          {Object.entries(activeFilters)
            .filter(([_, isActive]) => isActive)
            .map(([key]) => {
              const labels = {
                puskesmas: 'Puskesmas',
                posyandu: 'Posyandu', 
                kader: 'Kader KB/KIA'
              };
              return labels[key as keyof typeof labels];
            })
            .join(', ') || 'Tidak ada data yang dipilih'}
        </div>
      </div>

      {/* Bar Chart untuk fasilitas kesehatan dengan animasi */}
      <div className="glass-4 p-6 rounded-2xl shadow-lg border border-white/10 transform transition-all duration-500 animate-fade-in-up">
        <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
          📊 Fasilitas Kesehatan per Desa
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
              
              {/* Conditional Bars based on filters */}
              {activeFilters.puskesmas && (
                <Bar
                  dataKey="Jumlah Puskesmas dengan sarana Rawat Inap"
                  fill="#ef4444"
                  radius={[6, 6, 0, 0]}
                  className="transition-all duration-500"
                >
                  <LabelList 
                    dataKey="Jumlah Puskesmas dengan sarana Rawat Inap" 
                    position="top" 
                    fill="#fff" 
                    fontSize={12}
                  />
                </Bar>
              )}
              
              {activeFilters.posyandu && (
                <Bar
                  dataKey="Jumlah Posyandu Aktif"
                  fill="#3b82f6"
                  radius={[6, 6, 0, 0]}
                  className="transition-all duration-500"
                >
                  <LabelList 
                    dataKey="Jumlah Posyandu Aktif" 
                    position="top" 
                    fill="#fff" 
                    fontSize={12}
                  />
                </Bar>
              )}
              
              {activeFilters.kader && (
                <Bar
                  dataKey="Jumlah Kader KB/KIA"
                  fill="#22c55e"
                  radius={[6, 6, 0, 0]}
                  className="transition-all duration-500"
                >
                  <LabelList 
                    dataKey="Jumlah Kader KB/KIA" 
                    position="top" 
                    fill="#fff" 
                    fontSize={12}
                  />
                </Bar>
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Charts untuk program jaminan dengan animasi */}
      <div className="glass-4 p-6 rounded-2xl shadow-lg border border-white/10 transform transition-all duration-500 animate-fade-in-up">
        <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
          🥧 Program Jaminan Kesehatan
        </h3>
        <div className="grid grid-cols-2 gap-6">
          {[
            "ketersediaan program jaminan layanan kesehatan khusus untuk ibu hamil",
            "ketersediaan jaminan layanan kesehatan untuk bayi dibawah dua tahun(baduta)"
          ].map((key, idx) => {
            // Hitung jumlah per kategori
            const counts: Record<string, number> = {};
            data.forEach((row) => {
              const val = row[key];
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
                    <PieChart margin={{ top: 10, right: 10, bottom: 40, left: 10 }}>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={90}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        labelLine={false}
                      >
                        {pieData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend
                        verticalAlign="bottom"
                        layout="horizontal"
                        align="center"
                        wrapperStyle={{ marginTop: "20px" }}
                      />
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