import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ShieldCheck, MapPin, Cpu, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const { brand, currentLocality } = useApp();

  return (
    <footer className="bg-[#101B33] text-[#94A3B8] text-xs border-t border-[#172541] pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#172541] border border-[#00C2B8]/40 flex items-center justify-center text-white shadow-sm">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
                  <path d="M4 19V5L12 14L20 5V19" stroke="#00C2B8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="2.5" fill="#2563EB" />
                </svg>
              </div>
              <span className="font-black text-lg tracking-tight text-white flex items-center">
                {brand.name}
                <span className="text-[#00C2B8]">.</span>
              </span>
            </div>
            <p className="text-[#66748B] text-xs leading-relaxed">
              {brand.tagline} {brand.coreMessage}
            </p>
            <div className="flex items-center gap-2 text-[11px] text-[#00C2B8] bg-[#172541] p-2.5 rounded-xl border border-[#00C2B8]/30">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-[#00C2B8]" />
              <span>
                Active Neighborhood: <strong className="text-white">{currentLocality}</strong>
              </span>
            </div>
          </div>

          {/* Platform Features */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Platform Features
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/ai-assistant" className="hover:text-[#00C2B8] transition-colors">
                  AI Local Assistant (Speech & Chat)
                </Link>
              </li>
              <li>
                <Link to="/smart-booking" className="hover:text-[#00C2B8] transition-colors">
                  Smart Person Booking Engine
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-[#00C2B8] transition-colors">
                  Local Services & Discovery
                </Link>
              </li>
              <li>
                <Link to="/community" className="hover:text-[#00C2B8] transition-colors">
                  Community Hub & Civic Reports
                </Link>
              </li>
              <li>
                <Link to="/bookings" className="hover:text-[#00C2B8] transition-colors">
                  Booking Manager
                </Link>
              </li>
            </ul>
          </div>

          {/* Specialist Categories */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Specialist Categories
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/services?category=work-repair" className="hover:text-[#00C2B8] transition-colors">
                  Work & Home Repair
                </Link>
              </li>
              <li>
                <Link to="/services?category=guidance-learning" className="hover:text-[#00C2B8] transition-colors">
                  Guidance & Academic Mentors
                </Link>
              </li>
              <li>
                <Link to="/services?category=personal-assistance" className="hover:text-[#00C2B8] transition-colors">
                  Personal & Errand Assistance
                </Link>
              </li>
              <li>
                <Link to="/services?category=consultation" className="hover:text-[#00C2B8] transition-colors">
                  Legal & Tax Advisory
                </Link>
              </li>
              <li>
                <Link to="/services?category=remote-experts" className="hover:text-[#00C2B8] transition-colors">
                  Remote Tech & Coding Mentors
                </Link>
              </li>
            </ul>
          </div>

          {/* Technology Architecture Card */}
          <div className="bg-[#172541] p-4 rounded-2xl border border-[#172541] space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              <Cpu className="w-4 h-4 text-[#00C2B8]" />
              <span>Technology Architecture</span>
            </div>
            <p className="text-[11px] text-[#94A3B8] leading-relaxed">
              Full-stack system featuring client-side React 19 + Vite, Express REST API, JWT authentication, and natural language requirement extraction.
            </p>
            <div className="pt-2 text-[10px] text-[#66748B] font-mono">
              Build {brand.version} • {brand.name} Intelligence Core
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#172541] flex flex-col sm:flex-row items-center justify-between text-[#66748B] text-[11px] gap-2">
          <div>
            © {new Date().getFullYear()} <strong className="text-slate-300">{brand.name}</strong> • {brand.tagline}
          </div>
          <div className="flex items-center gap-1 text-[#66748B]">
            <span>NEXORA Team • Configurable Brand Core</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
