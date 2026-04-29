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
        <Link href="/" className="navbar-brand">
          <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: "spring", stiffness: 400 }}>
            <Brain size={24} className="brand-icon" />
          </motion.div>
          <span className="brand-text">RecallAI</span>
        </Link>

        <div className="nav-links">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/');
            return (
              <motion.div key={href} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href={href}
                  className={`nav-link ${isActive ? 'nav-link-active relative' : 'relative'}`}
                >
                  <Icon size={16} />
                  <span>{label}</span>

                  {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute inset-0 border border-primary/20 rounded-lg pointer-events-none"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
