'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Brain, LayoutDashboard, Upload, BookOpen, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/upload', label: 'Upload', icon: Upload },
  { href: '/decks', label: 'My Decks', icon: BookOpen },
  { href: '/about', label: 'About', icon: Info },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="navbar border-white/10 shadow-[0_4px_30px_rgba(0,212,255,0.1)]">
      <div className="navbar-inner">
        <Link href="/" className="navbar-brand hover:scale-105 transition-transform duration-300">
          <Brain size={24} className="brand-icon" />
          <span className="brand-text">RecallAI</span>
        </Link>

        <div className="nav-links flex gap-2">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                className="relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors text-gray-400 hover:text-white group"
              >
                <Icon size={16} className={`${isActive ? 'text-cyan-400' : 'group-hover:text-cyan-300'} transition-colors`} />
                <span className={isActive ? 'text-white' : ''}>{label}</span>
                
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute inset-0 bg-white/10 rounded-lg border border-white/10 z-[-1]"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                  />
                )}
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-cyan-400 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out rounded-full" />
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
