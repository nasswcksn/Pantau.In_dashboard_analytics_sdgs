"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

type Msg = { role: "user" | "assistant"; text: string };

export default function TanyaSDGsPage() {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<Msg[]>([
    {
      role: "assistant",
      text: "🌍 **Halo! Saya SDGsBot**\n\nSaya siap membantu Anda menganalisis data SDGs 1-17. Anda dapat bertanya tentang:\n\n• Progress setiap tujuan SDGs\n• Perbandingan antar wilayah\n• Analisis trend dan patterns\n• Insight berdasarkan data terkini\n\nContoh: *\"Bagaimana progress SDG 4 di Kecamatan Wates?\"*",
    },
  ]);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs, loading]);

  async function send(customQ?: string) {
    const question = customQ || q;
    if (!question.trim()) return;

    setLogs((l) => [...l, { role: "user", text: question }]);
    setQ("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ q: question }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      const text = data?.answer || data?.error || "Maaf, terjadi kesalahan.";
      setLogs((l) => [...l, { role: "assistant", text }]);
    } catch {
      setLogs((l) => [
        ...l,
        { role: "assistant", text: "⚠️ Gagal menghubungi server. Silakan coba lagi." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  // 💡 Template pertanyaan cepat dengan kategori
  const templates = [
    {
      category: "Progress SDG",
      questions: [
        "Tampilkan perkembangan SDG 6 Air Bersih",
      ]
    },
    {
      category: "Analisis Data", 
      questions: [
        "Bandingkan progress SDG 4 dan SDG 8"
      ]
    },
    {
      category: "Rekomendasi",
      questions: [
        "Rekomendasi untuk meningkatkan SDG 1 di daerah tertinggal",
        "Strategi apa yang efektif untuk SDG 5 Kesetaraan Gender?"
      ]
    }
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="glass-4 p-6 rounded-2xl shadow-lg border border-white/10 text-center transform transition-all duration-300 hover:scale-[1.01]">
        <h1 className="text-3xl font-bold text-blue-400 drop-shadow-md flex items-center justify-center gap-3">
          <span className="text-4xl">🤖</span>
          Tanya SDGs
          <span className="text-4xl">🌍</span>
        </h1>
        <p className="text-gray-200 mt-2">
          AI Assistant untuk Analisis Data Sustainable Development Goals
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar dengan Template Pertanyaan */}
        <div className="lg:col-span-1 space-y-4">
          <div className="glass-2 p-4 rounded-xl border border-white/10">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <span>💡</span> Pertanyaan Cepat
            </h3>
            <div className="space-y-3">
              {templates.map((category, catIndex) => (
                <div key={catIndex} className="space-y-2">
                  <h4 className="text-sm font-medium text-blue-300">{category.category}</h4>
                  {category.questions.map((question, qIndex) => (
                    <motion.button
                      key={qIndex}
                      onClick={() => send(question)}
                      disabled={loading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full text-left p-3 text-sm rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-400/30 transition-all duration-200 text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {question}
                    </motion.button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Area Chat Utama */}
        <div className="lg:col-span-3 space-y-4">
          {/* 💬 Area percakapan */}
          <div className="glass-4 rounded-2xl p-6 h-[60vh] overflow-y-auto space-y-4 relative">
            <AnimatePresence>
              {logs.map((m, i) => (
                <motion.div
                  key={i}
                  className={`flex ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  }`}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl backdrop-blur-sm ${
                      m.role === "user"
                        ? "bg-blue-500/20 border border-blue-400/30 text-white"
                        : "bg-green-500/20 border border-green-400/30 text-white"
                    }`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className={`text-xs font-semibold mb-1 ${
                      m.role === "user" ? "text-blue-300" : "text-green-300"
                    }`}>
                      {m.role === "user" ? "👤 Anda" : "🤖 SDGsBot"}
                    </div>
                    <div className="text-sm leading-relaxed">
                      <ReactMarkdown className="prose prose-invert prose-sm max-w-none">
                        {m.text}
                      </ReactMarkdown>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Loading Indicator */}
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-gray-500/20 border border-gray-400/30 px-4 py-3 rounded-2xl max-w-[80%]">
                  <div className="flex items-center gap-2 text-gray-300">
                    <div className="flex space-x-1">
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                        className="w-2 h-2 bg-blue-400 rounded-full"
                      />
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                        className="w-2 h-2 bg-blue-400 rounded-full"
                      />
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                        className="w-2 h-2 bg-blue-400 rounded-full"
                      />
                    </div>
                    <span className="text-sm">SDGsBot sedang menganalisis...</span>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* 📝 Input Area */}
          <div className="glass-2 p-4 rounded-xl border border-white/10">
            <div className="flex gap-3">
              <motion.input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Tanyakan tentang data SDGs... (contoh: 'Progress SDG 4 di Kecamatan Wates')"
                className="flex-1 border border-white/20 rounded-xl px-4 py-3 bg-white/10 text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                whileFocus={{ scale: 1.02 }}
              />
              <motion.button
                onClick={() => send()}
                disabled={loading || !q.trim()}
                whileHover={{ scale: loading || !q.trim() ? 1 : 1.05 }}
                whileTap={{ scale: loading || !q.trim() ? 1 : 0.95 }}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  loading || !q.trim()
                    ? "bg-gray-600/50 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg"
                }`}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Memproses...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>🚀</span>
                    <span>Kirim</span>
                  </div>
                )}
              </motion.button>
            </div>
            
            {/* Quick Tips */}
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs text-gray-400 flex items-center gap-1">
                💡 Tips: Tanya spesifik dengan menyebutkan SDG dan wilayah
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-gray-400 text-sm">
        <p>SDGsBot • Powered by AI • Data SDGs 1-17</p>
      </div>
    </div>
  );
}