import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/brand/Logo';

export default function LandingNav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 h-12 bg-[#161617]/80 backdrop-blur-xl">
      <div className="max-w-5xl mx-auto h-full px-6 flex items-center justify-between">
        <Link to="/" aria-label="Maple Grow home">
          <Logo className="h-8" imgClassName="h-8 rounded-md" />
        </Link>
        <nav className="hidden sm:flex items-center gap-7 text-xs text-[#d2d2d7]">
          <a href="#stocks" className="hover:text-white transition-colors">Stocks</a>
          <a href="#etfs" className="hover:text-white transition-colors">ETFs</a>
          <a href="#debt" className="hover:text-white transition-colors">Student debt</a>
        </nav>
        <div className="flex items-center gap-4 text-xs">
          <Link to="/login" className="text-[#d2d2d7] hover:text-white transition-colors">Sign in</Link>
          <Link to="/register" className="rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white px-3.5 py-1.5 font-semibold transition-colors">
            Create account
          </Link>
        </div>
      </div>
    </header>
  );
}