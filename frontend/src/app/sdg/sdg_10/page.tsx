// @ts-nocheck
"use client";

import { useEffect, useState } from "react";

export default function SDG10Page() {
  const [insight, setInsight] = useState<string>("");

  useEffect(() => {
    fetch("/api/insight?sdg=10")
      .then(res => res.json())
      .then(d => setInsight(d.insight || "sedang memberikan insight berdasarkan data...."))
      .catch(err => setInsight("sedang memberikan insight berdasarkan data...."));
  }, []);

  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/sdgs10")
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold">SDG 10 Detail</h2>
      {data.length === 0 ? (
        <p>Belum ada data untuk ditampilkan.</p>
      ) : (
        <pre className="bg-black/30 p-4 rounded-lg text-sm overflow-x-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    
      {/* Insight Card */}
      <div className="glass-4 p-6 rounded-2xl shadow-lg mt-4">
        <h3 className="text-lg font-semibold mb-2 text-blue-400">Insight Otomatis</h3>
        <p className="text-sm text-gray-100 whitespace-pre-line">
          {insight || "sedang memberikan insight berdasarkan data...."}
        </p>
      </div>
</div>
  );
}