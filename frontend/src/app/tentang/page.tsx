"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const team = [
  {
    name: "Vana Prastha Sulthon Naillendra Agung",
    role: "Backend Developer & DevOps",
    photo: "/assets/team/athaa.webp",
    skills: ["Supabase", "PostgreSQL", "Node.js", "API Integration", "DevOps"],
    contributions: [
      "Arsitektur backend & database design",
      "Migrasi data ke Supabase",
      "Integrasi API & endpoints",
      "Deployment & production setup"
    ]
  },
  {
    name: "Anas Wicaksono",
    role: "Frontend Developer & UI/UX Specialist",
    photo: "/assets/team/anas.webp",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    contributions: [
      "Komponen UI responsif",
      "Animasi & interaksi",
      "Optimasi performa frontend",
      "Peningkatan UX"
    ]
  },
  {
    name: "Dea Kayla Putri Darusman",
    role: "Machine Learning Engineer",
    photo: "/assets/team/dea.webp",
    skills: ["Python", "TensorFlow", "Scikit-learn", "Data Analysis", "ML Models"],
    contributions: [
      "Model prediksi SDGs",
      "Algoritma clustering",
      "Feature engineering",
      "Optimasi model ML"
    ]
  },
  {
    name: "Zaki Zain Fanuruddin Putra",
    role: "Data Analyst",
    photo: "/assets/team/zaki.webp",
    skills: ["SQL", "Data Analysis", "Data Visualization", "ETL", "Statistics"],
    contributions: [
      "Migrasi & transformasi data",
      "Analisis data komparatif",
      "Visualisasi & reporting",
      "Quality assurance data"
    ]
  },
];

const features = [
  {
    icon: "🎯",
    title: "Fokus 17 SDGs",
    description: "Visualisasi komprehensif untuk semua tujuan SDGs dengan palet warna resmi dan dashboard yang informatif."
  },
  {
    icon: "📈",
    title: "Analitik & Prediksi Cerdas",
    description: "Model machine learning terintegrasi untuk forecasting perkembangan SDGs dengan akurasi tinggi."
  },
  {
    icon: "🧩",
    title: "Clustering Wilayah",
    description: "Segmentasi cerdas menggunakan algoritma K-Means dan DBSCAN untuk analisis pola daerah."
  },
  {
    icon: "🤖",
    title: "AI Assistant",
    description: "Chatbot LLM yang dapat menjawab pertanyaan kompleks tentang data SDGs dan kebijakan."
  },
  {
    icon: "⚡",
    title: "Arsitektur Modern",
    description: "Dibangun dengan Next.js 14, Supabase, dan teknologi terkini untuk performa optimal."
  },
  {
    icon: "🔐",
    title: "Siap Production",
    description: "Infrastruktur yang scalable dengan security best practices dan monitoring terintegrasi."
  }
];

export default function TentangPage() {
  const [loading, setLoading] = useState(true);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [activeMember, setActiveMember] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const toggleFlip = (index: number) => {
    setFlippedCards(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
    setActiveMember(activeMember === index ? null : index);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="text-center space-y-4 animate-pulse">
          <div className="flex space-x-2 justify-center">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
              className="w-3 h-3 bg-blue-400 rounded-full"
            />
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
              className="w-3 h-3 bg-blue-400 rounded-full"
            />
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
              className="w-3 h-3 bg-blue-400 rounded-full"
            />
          </div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "200px" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="h-1 bg-blue-400 rounded-full mx-auto"
          />
          <p className="text-white text-lg font-semibold">Memuat Halaman Tentang...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-4 p-8 rounded-2xl shadow-lg border border-white/10 text-center"
      >
        <h1 className="text-4xl font-bold text-blue-400 drop-shadow-md mb-4">
          🌍 PantauIn Dashboard
        </h1>
        <p className="text-gray-200 text-lg mb-2">
          Platform Cerdas untuk Monitoring dan Analisis Sustainable Development Goals
        </p>
        <p className="text-gray-400 text-sm">
          Mengintegrasikan Teknologi Modern untuk Mendukung Pembangunan Berkelanjutan
        </p>
      </motion.div>

      {/* Deskripsi */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="glass-4 p-6 rounded-2xl shadow-lg border border-white/10"
      >
        <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
          <span className="text-2xl">💻</span>
          Tentang Platform
        </h2>
        <div className="w-full h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent mb-6"></div>
        <div className="space-y-6 text-gray-200 leading-relaxed">
          <p className="text-lg font-medium text-white">
            Pantau.In adalah dashboard pintar yang membantu pemerintah desa dan kecamatan memantau kemajuan pembangunan desa secara real-time, tanpa perlu bingung membaca data yang rumit.
          </p>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-blue-300">
              Apa itu Pantau.In?
            </h3>
            <div className="space-y-3 text-base">
              <p>
                Seperti "aplikasi laporan perkembangan desa" yang menampilkan data SDGs dalam bentuk grafik, peta, dan angka sederhana
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Menggunakan kecerdasan buatan untuk memberikan saran program pembangunan yang tepat</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Bisa membandingkan kemajuan antar-desa dengan mudah</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Tim Pengembang dengan Flip Cards */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="glass-4 p-6 rounded-2xl shadow-lg border border-white/10"
      >
        <h2 className="text-2xl font-semibold text-white mb-8 flex items-center gap-3">
          <span className="text-3xl">👥</span>
          Anggota Tim
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              className="relative h-96 cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => toggleFlip(index)}
            >
              {/* Flip Card Container */}
              <div className={`w-full h-full transition-all duration-700 preserve-3d ${
                flippedCards.includes(index) ? 'rotate-y-180' : ''
              }`}>
                
                {/* Front Side */}
                <div className="absolute inset-0 backface-hidden">
                  <div className="glass-2 p-6 rounded-2xl border border-white/10 h-full flex flex-col items-center justify-center text-center group hover:border-blue-400/30 transition-all duration-150 shadow-lg">
                    <div className="relative mb-6">
                      <div className="relative">
                        <Image 
                          src={member.photo} 
                          alt={member.name}
                          width={140}
                          height={140}
                          className="rounded-full border-3 border-white/20 group-hover:border-blue-400 transition-all duration-500 mx-auto shadow-lg"
                        />
                        <div className="absolute inset-0 rounded-full bg-blue-400/10 scale-0 group-hover:scale-100 transition-transform duration-500" />
                      </div>
                    </div>
                    
                    <h3 className="font-bold text-white text-xl mb-3 group-hover:text-blue-300 transition-colors duration-300 leading-tight">
                      {member.name.split(' ')[0]}
                    </h3>
                    <p className="text-blue-300 text-sm font-semibold mb-4">{member.role}</p>
                    
                    <div className="flex flex-wrap justify-center gap-2 mb-6">
                      {member.skills.slice(0, 3).map((skill, i) => (
                        <span 
                          key={i}
                          className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs border border-blue-400/30 font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                      {member.skills.length > 3 && (
                        <span className="px-2 py-1 bg-gray-500/20 text-gray-300 rounded-full text-xs">
                          +{member.skills.length - 3}
                        </span>
                      )}
                    </div>

                    <div className="mt-auto">
                      <motion.div
                        animate={{ y: [0, -3, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-gray-400 text-xs flex items-center justify-center gap-1"
                      >
                        <span>More Detail</span>
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Back Side */}
                <div className="absolute inset-0 backface-hidden rotate-y-180">
                  <div className="glass-3 p-6 rounded-2xl border border-blue-400/40 h-full flex flex-col justify-between shadow-lg">
                    <div>
                      <h3 className="font-bold text-white text-lg mb-2 text-center">
                        {member.name}
                      </h3>
                      <p className="text-blue-300 text-sm font-semibold mb-4 text-center">
                        {member.role}
                      </p>

                      <div className="space-y-3">
                        <h4 className="text-white text-xs font-semibold flex items-center gap-1 mb-2">
                          <span>🎯</span>
                          Kontribusi:
                        </h4>
                        <ul className="space-y-1">
                          {member.contributions.map((contribution, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <span className="text-blue-400 text-xs mt-0.5">•</span>
                              <span className="text-gray-200 text-xs leading-tight">
                                {contribution}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-1 mt-2">
                      {member.skills.slice(0, 4).map((skill, i) => (
                        <span
                          key={i}
                          className="px-1.5 py-0.5 bg-blue-500/30 text-blue-200 rounded-full text-xs border border-blue-400/50 font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                      {member.skills.length > 4 && (
                        <span className="px-1.5 py-0.5 bg-gray-500/30 text-gray-300 rounded-full text-xs">
                          +{member.skills.length - 4}
                        </span>
                      )}
                    </div>

                    <motion.div
                      animate={{ y: [0, -2, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-gray-400 text-xs text-center mt-4"
                    >
                      Back
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Keunggulan Fitur */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="glass-4 p-8 rounded-2xl shadow-lg border border-white/10"
      >
        <h2 className="text-2xl font-semibold text-white mb-8 flex items-center gap-3">
          <span className="text-3xl">✨</span>
          Keunggulan Teknologi
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
              whileHover={{ 
                scale: 1.05,
                y: -5,
                transition: { duration: 0.3 }
              }}
              className="glass-2 p-6 rounded-2xl border border-white/10 hover:border-blue-400/30 group cursor-pointer transition-all duration-500 shadow-lg"
            >
              <div className="text-4xl mb-4 transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
                {feature.icon}
              </div>
              <h3 className="font-bold text-white text-xl mb-3 group-hover:text-blue-300 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-200 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Tech Stack */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="glass-4 p-6 rounded-2xl shadow-lg border border-white/10 text-center"
      >
        <h3 className="text-lg font-semibold text-white mb-4">🛠 Tech Stack</h3>
        <div className="flex flex-wrap justify-center gap-4">
          {["Next.js 14", "TypeScript", "Supabase", "PostgreSQL", "Tailwind CSS", 
            "Framer Motion", "Python", "TensorFlow", "Scikit-learn", "Machine Learning"].map((tech, index) => (
            <motion.span
              key={tech}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.4 + index * 0.1 }}
              className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full border border-blue-400/30 text-sm font-medium"
            >
              {tech}
            </motion.span>
          ))}
        </div>
      </motion.section>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="text-center text-gray-400 text-sm"
      >
        <p>PantauIn Dashboard • Inovasi untuk Pembangunan Berkelanjutan 2024</p>
      </motion.div>
    </div>
  );
}