"use client";

import { useEffect, useState } from "react";
import { LucideIcon } from "lucide-react";

interface SDGCardProps {
  goalNo: number;
  title: string;
  icon: LucideIcon;
  successPercentage: number;
  animationDelay?: number;
}

export default function SDGCard({
  goalNo,
  title,
  icon: Icon,
  successPercentage,
  animationDelay = 0
}: SDGCardProps) {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Animasi fill progress bar
    const timer = setTimeout(() => {
      setAnimatedPercentage(successPercentage);
    }, 500 + animationDelay);

    return () => clearTimeout(timer);
  }, [successPercentage, animationDelay]);

  // Tentukan warna berdasarkan persentase
  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "from-green-500 to-emerald-400";
    if (percentage >= 60) return "from-blue-500 to-cyan-400";
    if (percentage >= 40) return "from-yellow-500 to-amber-400";
    if (percentage >= 20) return "from-orange-500 to-yellow-400";
    return "from-red-500 to-orange-400";
  };

  const progressColor = getProgressColor(successPercentage);

  return (
    <div 
      className="glass-2 p-4 rounded-xl shadow-lg border border-white/10 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-white/20 cursor-pointer group"
      style={{ 
        animationDelay: `${animationDelay}ms`,
        animationFillMode: 'forwards'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header dengan ikon dan nomor */}
      <div className="flex items-center justify-between mb-3">
        <Icon size={32} className="transform transition-transform duration-300 group-hover:scale-110" />
        <div className="glass-1 px-2 py-1 rounded-lg border border-white/5">
          <span className="text-sm font-bold text-blue-300">#{goalNo}</span>
        </div>
      </div>

      {/* Judul */}
      <h3 className="text-lg font-semibold text-white mb-4 line-clamp-2 group-hover:text-blue-300 transition-colors duration-300">
        {title}
      </h3>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-300">Progress</span>
          <span className="font-bold text-white transition-all duration-300 transform group-hover:scale-110">
            {Math.round(animatedPercentage)}%
          </span>
        </div>
        
        {/* Background Bar */}
        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
          {/* Animated Fill Bar */}
          <div 
            className={`h-3 rounded-full bg-gradient-to-r ${progressColor} transition-all duration-1000 ease-out transform origin-left ${
              isHovered ? 'scale-y-125' : 'scale-y-100'
            }`}
            style={{ 
              width: `${animatedPercentage}%`,
              transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s ease'
            }}
          >
            {/* Shimmer Effect */}
            <div className="h-full w-full relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 animate-shimmer" />
            </div>
          </div>
        </div>

        {/* Status Text */}
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">Mulai</span>
          <span className={`font-semibold ${
            successPercentage >= 80 ? 'text-green-400' :
            successPercentage >= 60 ? 'text-blue-400' :
            successPercentage >= 40 ? 'text-yellow-400' :
            successPercentage >= 20 ? 'text-orange-400' : 'text-red-400'
          } transition-all duration-300 transform group-hover:scale-105`}>
            {successPercentage >= 80 ? 'Sempurna' :
             successPercentage >= 60 ? 'Bagus' :
             successPercentage >= 40 ? 'Cukup' :
             successPercentage >= 20 ? 'Perlu Perbaikan' : 'Kritis'}
          </span>
        </div>
      </div>

      {/* Hover Indicator */}
      <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-blue-400/30 transition-all duration-300 pointer-events-none" />
    </div>
  );
}