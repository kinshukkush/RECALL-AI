'use client';

import { LucideIcon } from 'lucide-react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useState } from 'react';

interface StatsCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'red' | 'orange' | 'purple';
  description?: string;
}

const colorMaps = {
  blue: 'from-cyan-500/20 to-transparent border-cyan-500/30 text-cyan-400',
  green: 'from-emerald-500/20 to-transparent border-emerald-500/30 text-emerald-400',
  red: 'from-rose-500/20 to-transparent border-rose-500/30 text-rose-400',
  orange: 'from-amber-500/20 to-transparent border-amber-500/30 text-amber-400',
  purple: 'from-purple-500/20 to-transparent border-purple-500/30 text-purple-400',
};

const shadowMaps = {
  blue: 'hover:shadow-cyan-500/20',
  green: 'hover:shadow-emerald-500/20',
  red: 'hover:shadow-rose-500/20',
  orange: 'hover:shadow-amber-500/20',
  purple: 'hover:shadow-purple-500/20',
};

export default function StatsCard({ label, value, icon: Icon, color, description }: StatsCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    if (typeof value === 'number') {
      const animation = animate(count, value, { duration: 2, ease: "easeOut" });
      return animation.stop;
    }
  }, [value, count]);

  return (
    <motion.div 
      className={`relative glass rounded-2xl p-6 border-l-4 overflow-hidden perspective-container transition-all duration-300 ${colorMaps[color]} ${shadowMaps[color]}`}
      whileHover={{ y: -5, scale: 1.02, rotateX: 5, rotateY: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className={`absolute inset-0 bg-gradient-to-r ${colorMaps[color].split(' ')[0]} opacity-20`} />
      
      <div className="relative z-10 flex justify-between items-start mb-4">
        <motion.div 
          className={`p-3 rounded-xl bg-white/5 border border-white/10 ${colorMaps[color].split(' ').pop()}`}
          animate={isHovered ? { scale: 1.1, rotate: [0, -10, 10, 0] } : { scale: 1, rotate: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Icon size={24} />
        </motion.div>
      </div>

      <div className="relative z-10">
        <motion.div className="font-display text-4xl font-bold text-white mb-1 drop-shadow-md">
          {typeof value === 'number' ? <motion.span>{rounded}</motion.span> : value}
        </motion.div>
        <div className="text-sm font-medium text-gray-300 tracking-wide">{label}</div>
        {description && <div className="text-xs text-gray-500 mt-2">{description}</div>}
      </div>
    </motion.div>
  );
}
