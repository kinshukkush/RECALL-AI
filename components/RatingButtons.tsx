'use client';

import { Rating } from '@/types';
import { RotateCcw, ThumbsDown, ThumbsUp, Zap } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, useState, MouseEvent } from 'react';

interface RatingButtonsProps {
  onRate: (rating: Rating) => void;
  disabled?: boolean;
}

interface RatingConfig {
  value: Rating;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  colors: {
    text: string;
    border: string;
    bg: string;
    glow: string;
    gradient: string;
  };
  isDefault?: boolean;
}

const ratings: RatingConfig[] = [
  {
    value: 'again',
    label: 'Again',
    sublabel: 'Forgot',
    icon: <RotateCcw size={22} strokeWidth={2.5} />,
    colors: {
      text: 'text-rose-400',
      border: 'border-rose-500/20',
      bg: 'bg-rose-500/5',
      glow: 'rgba(244, 63, 94, 0.4)',
      gradient: 'from-rose-500/20 to-rose-600/5',
    }
  },
  {
    value: 'hard',
    label: 'Hard',
    sublabel: 'Struggled',
    icon: <ThumbsDown size={22} strokeWidth={2.5} />,
    colors: {
      text: 'text-amber-400',
      border: 'border-amber-500/20',
      bg: 'bg-amber-500/5',
      glow: 'rgba(245, 158, 11, 0.4)',
      gradient: 'from-amber-500/20 to-amber-600/5',
    }
  },
  {
    value: 'good',
    label: 'Good',
    sublabel: 'Got it',
    icon: <ThumbsUp size={22} strokeWidth={2.5} />,
    colors: {
      text: 'text-emerald-400',
      border: 'border-emerald-500/20',
      bg: 'bg-emerald-500/5',
      glow: 'rgba(52, 211, 153, 0.5)',
      gradient: 'from-emerald-500/20 to-emerald-600/5',
    },
    isDefault: true
  },
  {
    value: 'easy',
    label: 'Easy',
    sublabel: 'Perfect',
    icon: <Zap size={22} strokeWidth={2.5} />,
    colors: {
      text: 'text-cyan-400',
      border: 'border-cyan-500/20',
      bg: 'bg-cyan-500/5',
      glow: 'rgba(34, 211, 238, 0.4)',
      gradient: 'from-cyan-500/20 to-cyan-600/5',
    }
  },
];

// Individual 3D Rating Button Component
function RatingButton({
  config,
  onRate,
  disabled,
  index
}: {
  config: RatingConfig;
  onRate: (rating: Rating) => void;
  disabled?: boolean;
  index: number;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Mouse position for 3D tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics for smooth tilt
  const springConfig = { damping: 15, stiffness: 200 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), springConfig);

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current || disabled) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleClick = () => {
    if (disabled) return;
    setIsPressed(true);
    onRate(config.value);
    setTimeout(() => setIsPressed(false), 200);
  };

  return (
    <motion.button
      ref={buttonRef}
      onClick={handleClick}
      disabled={disabled}
      aria-label={`Rate as ${config.label}`}
      className={`
        relative w-full flex flex-col items-center justify-center
        py-5 px-3 rounded-2xl
        border ${config.colors.border}
        ${config.colors.bg}
        backdrop-blur-sm
        transition-colors duration-300
        disabled:opacity-40 disabled:cursor-not-allowed
        overflow-hidden
        group
      `}
      style={{
        rotateX: disabled ? 0 : rotateX,
        rotateY: disabled ? 0 : rotateY,
        transformPerspective: 800,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        boxShadow: isHovered && !disabled
          ? `0 20px 40px -10px ${config.colors.glow}, 0 0 20px ${config.colors.glow}`
          : '0 4px 20px rgba(0, 0, 0, 0.2)'
      }}
      transition={{
        delay: index * 0.08,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      whileTap={disabled ? {} : { scale: 0.95, y: 2 }}
    >
      {/* Background gradient layer */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${config.colors.gradient} rounded-2xl opacity-0`}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Shine sweep effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0, x: '-100%' }}
        animate={isHovered ? { opacity: 1, x: '200%' } : { opacity: 0, x: '-100%' }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
          width: '50%',
        }}
      />

      {/* Dynamic light reflection following mouse */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-2xl"
        style={{
          background: `radial-gradient(circle at ${(mouseX.get() + 0.5) * 100}% ${(mouseY.get() + 0.5) * 100}%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
        }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />

      {/* Pulsing glow for default option */}
      {config.isDefault && !disabled && (
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          animate={{
            boxShadow: [
              `0 0 0 0 ${config.colors.glow}`,
              `0 0 20px 4px ${config.colors.glow}`,
              `0 0 0 0 ${config.colors.glow}`,
            ],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Border glow on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          border: `1px solid transparent`,
          background: `linear-gradient(135deg, rgba(255,255,255,0.1), transparent) border-box`,
        }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Icon with 3D float effect */}
      <motion.div
        className={`relative z-10 ${config.colors.text} mb-2`}
        style={{ transform: 'translateZ(20px)' }}
        animate={isHovered ? {
          scale: 1.15,
          y: -4,
          rotate: config.value === 'easy' ? -10 : 0
        } : {
          scale: 1,
          y: 0,
          rotate: 0
        }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      >
        {config.icon}
      </motion.div>

      {/* Label with 3D depth */}
      <motion.span
        className={`relative z-10 font-bold tracking-wide text-base ${config.colors.text}`}
        style={{ transform: 'translateZ(15px)' }}
        animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {config.label}
      </motion.span>

      {/* Sublabel */}
      <motion.span
        className="relative z-10 text-xs text-white/40 mt-1 font-medium"
        style={{ transform: 'translateZ(10px)' }}
        initial={{ opacity: 0.4 }}
        animate={{ opacity: isHovered ? 0.8 : 0.4 }}
      >
        {config.sublabel}
      </motion.span>

      {/* Press ripple effect */}
      {isPressed && (
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          initial={{ scale: 0.5, opacity: 0.5 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            background: `radial-gradient(circle, ${config.colors.glow}, transparent 70%)`,
          }}
        />
      )}

      {/* Keyboard hint */}
      <motion.div
        className="absolute bottom-2 right-2 text-[10px] text-white/20 font-mono"
        animate={{ opacity: isHovered ? 0.5 : 0 }}
        transition={{ duration: 0.2 }}
      >
        {index + 1}
      </motion.div>
    </motion.button>
  );
}

export default function RatingButtons({ onRate, disabled }: RatingButtonsProps) {
  return (
    <div className="relative w-full max-w-3xl mx-auto">
      {/* Background glow effect */}
      <div className="absolute inset-0 -z-10 blur-3xl opacity-20 pointer-events-none">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-32 h-32 bg-rose-500 rounded-full" />
        <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-32 h-32 bg-amber-500 rounded-full" />
        <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-32 h-32 bg-emerald-500 rounded-full" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-32 h-32 bg-cyan-500 rounded-full" />
      </div>

      {/* Rating buttons container */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08 }
          }
        }}
      >
        {ratings.map((config, index) => (
          <RatingButton
            key={config.value}
            config={config}
            onRate={onRate}
            disabled={disabled}
            index={index}
          />
        ))}
      </motion.div>

      {/* Helper text */}
      <motion.p
        className="text-center text-xs text-white/30 mt-4 font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Rate how well you remembered this card
      </motion.p>
    </div>
  );
}