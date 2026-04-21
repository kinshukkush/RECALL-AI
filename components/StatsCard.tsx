'use client';

import { LucideIcon } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, useState, useEffect, MouseEvent } from 'react';

interface StatsCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'red' | 'orange' | 'purple';
  description?: string;
}

export default function StatsCard({ label, value, icon: Icon, color, description }: StatsCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Animated counter
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { damping: 50, stiffness: 100 });
  const [displayValue, setDisplayValue] = useState(0);

  // Mouse position for 3D tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring physics for tilt
  const springConfig = { damping: 25, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);

  // Animate counter on mount
  useEffect(() => {
    if (typeof value === 'number') {
      motionValue.set(value);
    }
  }, [value, motionValue]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      setDisplayValue(Math.round(latest));
    });
    return unsubscribe;
  }, [springValue]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const x = (e.clientX - centerX) / rect.width;
    const y = (e.clientY - centerY) / rect.height;
    
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div className={`stats-card-3d stats-card-${color}`}>
      <motion.div
        ref={cardRef}
        className="stats-card-inner"
        style={{
          rotateX,
          rotateY,
          transformPerspective: 1000,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
      >
        {/* Ambient light effect following mouse */}
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${(mouseX.get() + 0.5) * 100}% ${(mouseY.get() + 0.5) * 100}%, rgba(255,255,255,0.08) 0%, transparent 50%)`,
            opacity: isHovered ? 1 : 0,
          }}
        />

        {/* Icon Layer - Floats higher in 3D space */}
        <motion.div 
          className="stats-icon-layer"
          animate={isHovered ? { z: 40, scale: 1.1 } : { z: 30, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <motion.div 
            className="stats-icon-wrap-3d"
            animate={isHovered ? { rotate: [0, -10, 10, 0] } : { rotate: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Icon size={26} strokeWidth={2} />
          </motion.div>
        </motion.div>

        {/* Content Layer */}
        <div className="stats-content-layer">
          <motion.div 
            className="stats-value-3d"
            animate={isHovered ? { scale: 1.02 } : { scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            {typeof value === 'number' ? displayValue.toLocaleString() : value}
          </motion.div>
          
          <div className="stats-label-3d">{label}</div>
          
          {description && (
            <motion.div 
              className="stats-description-3d"
              initial={{ opacity: 0.7 }}
              animate={{ opacity: isHovered ? 1 : 0.7 }}
            >
              {description}
            </motion.div>
          )}
        </div>

        {/* Shine effect on hover */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0, x: '-100%' }}
          animate={isHovered ? { opacity: 1, x: '100%' } : { opacity: 0, x: '-100%' }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)',
          }}
        />
      </motion.div>
    </div>
  );
}