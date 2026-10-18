import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Search,
  MapPin,
  ChevronDown,
  Bot,
  CalendarPlus,
  CalendarCheck,
  Users,
  CircleHelp,
  X,
  Menu,
  ShieldCheck,
  CheckCircle2,
  Check,
  ArrowRight,
  Send,
  AlertTriangle,
  RotateCcw,
  Lock,
  User,
  Sparkles,
  Phone,
  Briefcase
} from 'lucide-react';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    brand = {},
    currentUser,
    logout,
    switchRole,
    currentLocality = 'Indiranagar',
    setCurrentLocality,
    localities = [],
    providers = [],
    bookings = [],
    openProviderDetail,
    showToast
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const [navSearchQuery, setNavSearchQuery] = useState('');
  const [quickSearchModalOpen, setQuickSearchModalOpen] = useState(false);
  const [modalSearchQuery, setModalSearchQuery] = useState('');
  const [localityDropdownOpen, setLocalityDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);

  // Help Center states
  const [helpTab, setHelpTab] = useState('all');
  const [helpSearch, setHelpSearch] = useState('');
  const [ticketName, setTicketName] = useState('');
  const [ticketContact, setTicketContact] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Login & OTP Issues');
  const [ticketPriority, setTicketPriority] = useState('Normal');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSuccess, setTicketSuccess] = useState(null);
  const [ticketError, setTicketError] = useState('');

  const searchContainerRef = useRef(null);
  const profileMenuRef = useRef(null);
  const modalInputRef = useRef(null);

  // Keyboard shortcut Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setQuickSearchModalOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setSearchDropdownOpen(false);
        setHelpModalOpen(false);
        setQuickSearchModalOpen(false);
        setProfileDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (quickSearchModalOpen) {
      setTimeout(() => modalInputRef.current?.focus(), 50);
    }
  }, [quickSearchModalOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setSearchDropdownOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered providers for search
  const filteredNavProviders = useMemo(() => {
    if (!navSearchQuery.trim()) return [];
    const q = navSearchQuery.toLowerCase().trim();
    return (providers || []).filter(p =>
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.title && p.title.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q)) ||
      (p.locality && p.locality.toLowerCase().includes(q))
    ).slice(0, 5);
  }, [navSearchQuery, providers]);

  const filteredModalProviders = useMemo(() => {
    if (!modalSearchQuery.trim()) return [];
    const q = modalSearchQuery.toLowerCase().trim();
    return (providers || []).filter(p =>
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.title && p.title.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q)) ||
      (p.locality && p.locality.toLowerCase().includes(q))
    ).slice(0, 8);
  }, [modalSearchQuery, providers]);

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (navSearchQuery.trim()) {
      setSearchDropdownOpen(false);
      navigate(`/services?q=${encodeURIComponent(navSearchQuery.trim())}&locality=${encodeURIComponent(currentLocality)}`);
    }
  };

  const handleModalSearchSubmit = (e) => {
    e?.preventDefault();
    if (modalSearchQuery.trim()) {
      setQuickSearchModalOpen(false);
      navigate(`/services?q=${encodeURIComponent(modalSearchQuery.trim())}&locality=${encodeURIComponent(currentLocality)}`);
    }
  };

  // Comprehensive Help Topics
  const helpArticles = [
    {
      id: 'h-auth-1',
      cat: 'auth',
      title: 'Login & Signup Troubleshooting Guide',
      tags: ['login', 'signup', 'password', 'oauth', 'google'],
      summary: 'Ensure your phone number has 10 digits and your email is entered correctly. Clear browser cache or disable pop-up blockers if Google One-Tap does not display.'
    },
    {
      id: 'h-otp-2',
      cat: 'otp',
      title: 'OTP Delivery & Verification Assistance',
      tags: ['otp', 'sms', 'email', 'verification', 'code'],
      summary: 'OTP codes expire in 10 minutes. If SMS is delayed, check DND settings on your mobile device or use email OTP verification.'
    },
    {
      id: 'h-prof-3',
      cat: 'account',
      title: 'Customer Profile & Account Management',
      tags: ['profile', 'account', 'customer', 'settings'],
      summary: 'Update your address, saved neighborhoods, preferred contact numbers, and payment preferences under your Profile dashboard.'
    },
    {
      id: 'h-prov-4',
      cat: 'provider',
      title: 'Service Provider Registration & Verification',
      tags: ['provider', 'join', 'verification', 'earnings'],
      summary: 'Apply via For Providers. Submit government identification, certifications, and skills to receive verified specialist badge.'
    },
    {
      id: 'h-smrt-5',
      cat: 'booking',
      title: 'Smart Person Booking: How It Works',
      tags: ['smart', 'person', 'queue', 'companion', 'booking'],
      summary: 'Book reliable local people for real-world tasks like standing in ticket queues, senior accompaniment, document filing, or local guidance.'
    },
    {
      id: 'h-cncl-6',
      cat: 'cancellation',
      title: 'Booking Status, Rescheduling & Cancellation Policy',
      tags: ['cancel', 'cancellation', 'reschedule', 'refund'],
      summary: 'Free cancellation up to 2 hours before scheduled task start. Rescheduling can be requested directly from My Bookings.'
    }
  ];

  const filteredHelpArticles = useMemo(() => {
    let list = helpArticles;
    if (helpTab !== 'all') {
      list = list.filter(a => a.cat === helpTab);
    }
    if (helpSearch.trim()) {
      const q = helpSearch.toLowerCase().trim();
      list = list.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.tags.some(t => t.includes(q))
      );
    }
    return list;
  }, [helpTab, helpSearch]);

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    setTicketError('');
    if (!ticketName.trim()) {
      setTicketError('Please provide your full name.');
      return;
    }
    if (!ticketContact.trim()) {
      setTicketError('Please provide a valid email or phone number.');
      return;
    }
    if (!ticketMessage.trim() || ticketMessage.trim().length < 10) {
      setTicketError('Please describe your issue in at least 10 characters.');
      return;
    }

    const ticketId = 'NX-' + Math.floor(100000 + Math.random() * 900000);
    const newTicket = {
      id: ticketId,
      name: ticketName.trim(),
      contact: ticketContact.trim(),
      category: ticketCategory,
      priority: ticketPriority,
      message: ticketMessage.trim(),
      createdAt: new Date().toISOString(),
      status: 'Open'
    };

    try {
      const existing = JSON.parse(localStorage.getItem('nexora_support_tickets') || '[]');
      existing.unshift(newTicket);
      localStorage.setItem('nexora_support_tickets', JSON.stringify(existing));
    } catch (err) {
      console.warn('Could not persist support ticket to localStorage', err);
    }

    setTicketSuccess({
      id: ticketId,
      message: `Support ticket ${ticketId} registered. Our specialized operations team will respond to ${ticketContact.trim()} within 2 business hours.`
    });
    setTicketMessage('');
    if (showToast) showToast('Support ticket submitted successfully', 'success');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FFFFFF] shadow-xs">
        {/* TOP INFORMATION STRIP */}
        <div className="bg-[#101B33] text-white text-[11px] py-1.5 px-4 sm:px-6 lg:px-8 border-b border-[#172541]">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 font-medium text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00C2B8] animate-pulse"></span>
                <span>Hyperlocal Intelligence Network</span>
              </span>
              <span className="hidden sm:inline text-slate-600">•</span>
              <span className="hidden sm:inline text-slate-400">
                Verified Specialists & Task Companions
              </span>
            </div>
            <div className="flex items-center gap-4 text-slate-300">
              <span className="flex items-center gap-1 text-[11px]">
                <Phone className="w-3 h-3 text-[#00C2B8]" />
                <span className="hidden md:inline text-slate-400">Helpline:</span>
                <span className="font-semibold text-slate-200">112</span>
              </span>
              <button
                onClick={() => setHelpModalOpen(true)}
                className="hover:text-[#00C2B8] text-slate-300 transition-colors flex items-center gap-1 font-medium"
              >
                <CircleHelp className="w-3 h-3 text-[#00C2B8]" />
                <span>Help & Support</span>
              </button>
            </div>
          </div>
        </div>

        {/* MAIN NAVIGATION BAR */}
        <div className="bg-[#FFFFFF] border-b border-[#E2E8F0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 gap-3 lg:gap-6">
              
              {/* Left Brand & Controls */}
              <div className="flex items-center gap-3 lg:gap-4 shrink-0">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2.5 group">
                  <div className="w-9 h-9 rounded-xl bg-[#101B33] border border-[#172541] shadow-xs flex items-center justify-center p-1.5 group-hover:border-[#00C2B8]/60 transition-colors">
                    <svg viewBox="0 0 24 24" className="w-full h-full" fill="none">
                      <path
                        d="M4 19V5L12 14L20 5V19"
                        stroke="#00C2B8"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle cx="12" cy="12" r="2.5" fill="#2563EB" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl font-black tracking-tight text-[#182338] leading-none flex items-center">
                      NEXORA
                      <span className="text-[#00C2B8] ml-0.5">.</span>
                    </span>
                    <span className="text-[10px] font-semibold text-[#66748B] tracking-wider uppercase mt-0.5">
                      Hyperlocal
                    </span>
                  </div>
                </Link>

                {/* Location Selector */}
                <div className="relative hidden md:block">
                  <button
                    onClick={() => setLocalityDropdownOpen(prev => !prev)}
                    className="h-10 px-3 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0] hover:border-[#00C2B8] text-[#182338] text-xs font-semibold flex items-center gap-2 transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#00C2B8]" />
                    <span className="truncate max-w-[110px]">{currentLocality}</span>
                    <ChevronDown className="w-3 h-3 text-[#66748B]" />
                  </button>

                  {localityDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-52 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl shadow-lg p-2 z-50">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#66748B] px-3 py-1.5">
                        Select Neighborhood
                      </div>
                      <div className="max-h-60 overflow-y-auto space-y-1">
                        {localities.map(loc => (
                          <button
                            key={loc}
                            onClick={() => {
                              setCurrentLocality(loc);
                              setLocalityDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                              currentLocality === loc
                                ? 'bg-[#00C2B8]/10 text-[#00C2B8] font-bold'
                                : 'text-[#182338] hover:bg-[#F7F9FC]'
                            }`}
                          >
                            <span>{loc}</span>
                            {currentLocality === loc && <Check className="w-3.5 h-3.5 text-[#00C2B8]" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Search Bar */}
                <div ref={searchContainerRef} className="relative hidden lg:block w-72">
                  <form onSubmit={handleSearchSubmit} className="relative">
                    <input
                      type="text"
                      value={navSearchQuery}
                      onChange={(e) => {
                        setNavSearchQuery(e.target.value);
                        setSearchDropdownOpen(true);
                      }}
                      onFocus={() => setSearchDropdownOpen(true)}
                      placeholder="Search services, tasks, people..."
                      className="w-full h-10 pl-9 pr-14 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0] text-xs text-[#182338] placeholder-[#66748B] focus:outline-none focus:border-[#00C2B8] focus:bg-[#FFFFFF] transition-all"
                    />
                    <Search className="w-4 h-4 text-[#66748B] absolute left-3 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setQuickSearchModalOpen(true)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded-md bg-[#FFFFFF] border border-[#E2E8F0] text-[10px] text-[#66748B] font-mono hover:text-[#182338]"
                    >
                      ⌘K
                    </button>
                  </form>

                  {/* Autocomplete Dropdown */}
                  {searchDropdownOpen && navSearchQuery.trim() && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl shadow-lg p-2 z-50">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#66748B] px-3 py-1">
                        Matching Specialists
                      </div>
                      {filteredNavProviders.length > 0 ? (
                        filteredNavProviders.map(p => (
                          <button
                            key={p.id}
                            onClick={() => {
                              openProviderDetail(p);
                              setSearchDropdownOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#F7F9FC] flex items-center justify-between transition-colors"
                          >
                            <div>
                              <div className="text-xs font-semibold text-[#182338]">{p.name}</div>
                              <div className="text-[11px] text-[#66748B]">{p.title} • {p.locality}</div>
                            </div>
                            <span className="text-[11px] font-semibold text-[#00C2B8]">₹{p.hourlyRate}/hr</span>
                          </button>
                        ))
                      ) : (
                        <div className="px-3 py-3 text-xs text-[#66748B] text-center">
                          No direct specialists found. Press Enter to view all results.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Center Navigation Links */}
              <nav className="hidden xl:flex items-center gap-1">
                <Link
                  to="/"
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    isActive('/')
                      ? 'text-[#00C2B8] bg-[#00C2B8]/10 font-bold'
                      : 'text-[#66748B] hover:text-[#182338] hover:bg-[#F7F9FC]'
                  }`}
                >
                  Home
                </Link>

                <Link
                  to="/ai-assistant"
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    isActive('/ai-assistant')
                      ? 'text-[#00C2B8] bg-[#00C2B8]/15 font-bold border border-[#00C2B8]/30'
                      : 'text-[#182338] hover:text-[#00C2B8] hover:bg-[#F7F9FC]'
                  }`}
                >
                  <Bot className="w-3.5 h-3.5 text-[#00C2B8]" />
                  <span>AI Assistant</span>
                </Link>

                {/* Smart Person Booking: Highlighted Core Feature */}
                <Link
                  to="/smart-booking"
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                    isActive('/smart-booking')
                      ? 'bg-[#101B33] text-[#00C2B8] ring-2 ring-[#00C2B8]'
                      : 'bg-[#172541] text-white hover:bg-[#101B33]'
                  }`}
                >
                  <CalendarPlus className="w-3.5 h-3.5 text-[#00C2B8]" />
                  <span>Smart Person Booking</span>
                </Link>

                <Link
                  to="/services"
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    isActive('/services')
                      ? 'text-[#00C2B8] bg-[#00C2B8]/10 font-bold'
                      : 'text-[#66748B] hover:text-[#182338] hover:bg-[#F7F9FC]'
                  }`}
                >
                  Directory
                </Link>

                <Link
                  to="/community"
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    isActive('/community')
                      ? 'text-[#00C2B8] bg-[#00C2B8]/10 font-bold'
                      : 'text-[#66748B] hover:text-[#182338] hover:bg-[#F7F9FC]'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-[#66748B]" />
                  <span>Community</span>
                </Link>

                {/* Clean My Bookings link (NO fake counts) */}
                <Link
                  to="/bookings"
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    isActive('/bookings')
                      ? 'text-[#00C2B8] bg-[#00C2B8]/10 font-bold'
                      : 'text-[#66748B] hover:text-[#182338] hover:bg-[#F7F9FC]'
                  }`}
                >
                  <CalendarCheck className="w-3.5 h-3.5 text-[#66748B]" />
                  <span>My Bookings</span>
                </Link>

                <Link
                  to="/provider-dashboard"
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    isActive('/provider-dashboard')
                      ? 'text-[#00C2B8] bg-[#00C2B8]/10 font-bold'
                      : 'text-[#66748B] hover:text-[#182338] hover:bg-[#F7F9FC]'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5 text-[#66748B]" />
                  <span>For Providers</span>
                </Link>

                <button
                  onClick={() => setHelpModalOpen(true)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-[#66748B] hover:text-[#182338] hover:bg-[#F7F9FC] flex items-center gap-1.5 transition-colors"
                >
                  <CircleHelp className="w-3.5 h-3.5 text-[#66748B]" />
                  <span>Help</span>
                </button>
              </nav>

              {/* Right Action Controls */}
              <div className="flex items-center gap-2.5">
                {/* Mobile Search button */}
                <button
                  onClick={() => setQuickSearchModalOpen(true)}
                  className="lg:hidden p-2 rounded-xl bg-[#F7F9FC] text-[#182338] border border-[#E2E8F0] hover:border-[#00C2B8]"
                >
                  <Search className="w-4 h-4" />
                </button>

                {currentUser ? (
                  <div ref={profileMenuRef} className="relative">
                    <button
                      onClick={() => setProfileDropdownOpen(prev => !prev)}
                      className="flex items-center gap-2 p-1.5 rounded-xl border border-[#E2E8F0] bg-[#F7F9FC] hover:bg-[#FFFFFF] transition-colors"
                    >
                      <div className="w-7 h-7 rounded-lg bg-[#101B33] text-white flex items-center justify-center font-bold text-xs">
                        {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
                      </div>
                      <span className="text-xs font-semibold text-[#182338] hidden sm:inline max-w-[90px] truncate">
                        {currentUser.name}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-[#66748B]" />
                    </button>

                    {profileDropdownOpen && (
                      <div className="absolute right-0 top-full mt-2 w-56 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl shadow-xl p-2 z-50">
                        <div className="px-3 py-2 border-b border-[#E2E8F0] mb-1">
                          <div className="text-xs font-bold text-[#182338]">{currentUser.name}</div>
                          <div className="text-[11px] text-[#66748B] truncate">{currentUser.email || currentUser.phone}</div>
                          <div className="mt-1 inline-block px-2 py-0.5 rounded-md bg-[#00C2B8]/15 text-[#00C2B8] text-[10px] font-bold">
                            {currentUser.role === 'provider' ? 'Provider Account' : 'Customer Account'}
                          </div>
                        </div>

                        <Link
                          to="/profile"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="block px-3 py-2 rounded-lg text-xs font-medium text-[#182338] hover:bg-[#F7F9FC]"
                        >
                          Profile & Settings
                        </Link>
                        <Link
                          to="/bookings"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="block px-3 py-2 rounded-lg text-xs font-medium text-[#182338] hover:bg-[#F7F9FC]"
                        >
                          My Bookings
                        </Link>
                        {currentUser.role === 'provider' && (
                          <Link
                            to="/provider-dashboard"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="block px-3 py-2 rounded-lg text-xs font-medium text-[#182338] hover:bg-[#F7F9FC]"
                          >
                            Provider Dashboard
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            switchRole(currentUser.role === 'provider' ? 'customer' : 'provider');
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-[#182338] hover:bg-[#F7F9FC]"
                        >
                          Switch to {currentUser.role === 'provider' ? 'Customer' : 'Provider'}
                        </button>
                        <div className="border-t border-[#E2E8F0] mt-1 pt-1">
                          <button
                            onClick={() => {
                              logout();
                              setProfileDropdownOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50"
                          >
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link
                      to="/login"
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#182338] hover:bg-[#F7F9FC] transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#2563EB] hover:bg-blue-700 shadow-xs transition-colors"
                    >
                      Join NEXORA
                    </Link>
                  </div>
                )}

                {/* Mobile Drawer Toggle */}
                <button
                  onClick={() => setMobileMenuOpen(prev => !prev)}
                  className="xl:hidden p-2 rounded-xl text-[#182338] hover:bg-[#F7F9FC]"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* MOBILE DRAWER */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-[#FFFFFF] border-b border-[#E2E8F0] p-4 space-y-3 shadow-lg">
            {/* Mobile Location Selector */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0]">
              <span className="text-xs text-[#66748B] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#00C2B8]" />
                Location
              </span>
              <select
                value={currentLocality}
                onChange={(e) => setCurrentLocality(e.target.value)}
                className="bg-transparent text-xs font-bold text-[#182338] focus:outline-none"
              >
                {localities.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* Mobile Nav Links */}
            <div className="space-y-1">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-xs font-semibold text-[#182338] hover:bg-[#F7F9FC]"
              >
                Home
              </Link>
              <Link
                to="/ai-assistant"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-xs font-semibold text-[#00C2B8] bg-[#00C2B8]/10"
              >
                AI Local Assistant
              </Link>
              <Link
                to="/smart-booking"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-xs font-bold bg-[#172541] text-white"
              >
                Smart Person Booking Engine
              </Link>
              <Link
                to="/services"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-xs font-semibold text-[#182338] hover:bg-[#F7F9FC]"
              >
                Directory & Services
              </Link>
              <Link
                to="/community"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-xs font-semibold text-[#182338] hover:bg-[#F7F9FC]"
              >
                Community Hub
              </Link>
              <Link
                to="/bookings"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-xs font-semibold text-[#182338] hover:bg-[#F7F9FC]"
              >
                My Bookings
              </Link>
              <Link
                to="/provider-dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-xs font-semibold text-[#182338] hover:bg-[#F7F9FC]"
              >
                For Providers
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setHelpModalOpen(true);
                }}
                className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold text-[#182338] hover:bg-[#F7F9FC] flex items-center gap-2"
              >
                <CircleHelp className="w-4 h-4 text-[#00C2B8]" />
                <span>Help & Customer Support</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* QUICK SEARCH MODAL (Ctrl+K) */}
      {quickSearchModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#101B33]/70 backdrop-blur-xs flex items-start justify-center pt-20 px-4">
          <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-[#E2E8F0] flex items-center gap-3">
              <Search className="w-5 h-5 text-[#66748B]" />
              <input
                ref={modalInputRef}
                type="text"
                value={modalSearchQuery}
                onChange={(e) => setModalSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleModalSearchSubmit(e);
                }}
                placeholder="Search specialists, queue standers, tutors, repairs..."
                className="w-full bg-transparent text-sm text-[#182338] placeholder-[#66748B] focus:outline-none"
              />
              <button
                onClick={() => setQuickSearchModalOpen(false)}
                className="p-1 rounded-lg text-[#66748B] hover:text-[#182338]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto p-4 space-y-4">
              {filteredModalProviders.length > 0 ? (
                <div className="space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#66748B]">
                    Specialists ({filteredModalProviders.length})
                  </div>
                  {filteredModalProviders.map(p => (
                    <button
                      key={p.id}
                      onClick={() => {
                        openProviderDetail(p);
                        setQuickSearchModalOpen(false);
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-[#F7F9FC] flex items-center justify-between border border-transparent hover:border-[#E2E8F0] transition-colors"
                    >
                      <div>
                        <div className="text-xs font-bold text-[#182338]">{p.name}</div>
                        <div className="text-[11px] text-[#66748B]">{p.title} • {p.locality}</div>
                      </div>
                      <span className="text-xs font-bold text-[#00C2B8]">₹{p.hourlyRate}/hr</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-xs text-[#66748B]">
                  Type keywords to explore local specialists, verified companions, and services.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* COMPREHENSIVE HELP CENTER MODAL */}
      {helpModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#101B33]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-[#101B33] text-white p-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <CircleHelp className="w-5 h-5 text-[#00C2B8]" />
                  NEXORA Help & Support Center
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Search troubleshooting guides, booking policies, or connect directly with our resolution specialists.
                </p>
              </div>
              <button
                onClick={() => setHelpModalOpen(false)}
                className="p-1.5 rounded-xl bg-[#172541] hover:bg-slate-700 text-slate-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  value={helpSearch}
                  onChange={(e) => setHelpSearch(e.target.value)}
                  placeholder="Search help articles (e.g., OTP delivery, Google login, refund, queue task)..."
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0] text-xs text-[#182338] placeholder-[#66748B] focus:outline-none focus:border-[#00C2B8]"
                />
                <Search className="w-4 h-4 text-[#66748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>

              {/* Categories Navigation */}
              <div className="flex flex-wrap gap-2 border-b border-[#E2E8F0] pb-3">
                {[
                  { id: 'all', label: 'All Articles' },
                  { id: 'auth', label: 'Login & Signup' },
                  { id: 'otp', label: 'OTP Verification' },
                  { id: 'account', label: 'Customer Account' },
                  { id: 'provider', label: 'Provider Guidance' },
                  { id: 'booking', label: 'Smart Booking' },
                  { id: 'cancellation', label: 'Cancellations & Refunds' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setHelpTab(tab.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      helpTab === tab.id
                        ? 'bg-[#101B33] text-white'
                        : 'bg-[#F7F9FC] text-[#66748B] hover:text-[#182338]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Articles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredHelpArticles.map(article => (
                  <div
                    key={article.id}
                    className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F7F9FC] space-y-2 hover:border-[#00C2B8] transition-colors"
                  >
                    <h4 className="text-xs font-bold text-[#182338]">{article.title}</h4>
                    <p className="text-[11px] text-[#66748B] leading-relaxed">{article.summary}</p>
                  </div>
                ))}
              </div>

              {/* Contact Support Form */}
              <div className="p-5 rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] space-y-4">
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4 text-[#00C2B8]" />
                  <h4 className="text-xs font-bold text-[#182338] uppercase tracking-wider">
                    Submit a Support Request
                  </h4>
                </div>

                {ticketSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                    {ticketSuccess.message}
                  </div>
                )}
                {ticketError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                    {ticketError}
                  </div>
                )}

                <form onSubmit={handleSupportSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={ticketName}
                      onChange={(e) => setTicketName(e.target.value)}
                      placeholder="Your Full Name"
                      className="h-10 px-3 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0] text-xs text-[#182338] focus:outline-none focus:border-[#00C2B8]"
                    />
                    <input
                      type="text"
                      value={ticketContact}
                      onChange={(e) => setTicketContact(e.target.value)}
                      placeholder="Email or 10-digit Phone"
                      className="h-10 px-3 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0] text-xs text-[#182338] focus:outline-none focus:border-[#00C2B8]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <select
                      value={ticketCategory}
                      onChange={(e) => setTicketCategory(e.target.value)}
                      className="h-10 px-3 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0] text-xs text-[#182338] focus:outline-none focus:border-[#00C2B8]"
                    >
                      <option value="Login & OTP Issues">Login & OTP Issues</option>
                      <option value="Booking Cancellation / Reschedule">Booking Cancellation / Reschedule</option>
                      <option value="Provider Verification">Provider Verification</option>
                      <option value="Payment & Refund Inquiry">Payment & Refund Inquiry</option>
                      <option value="General Query">General Query</option>
                    </select>

                    <select
                      value={ticketPriority}
                      onChange={(e) => setTicketPriority(e.target.value)}
                      className="h-10 px-3 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0] text-xs text-[#182338] focus:outline-none focus:border-[#00C2B8]"
                    >
                      <option value="Normal">Priority: Normal</option>
                      <option value="High">Priority: High (Task in &lt; 2 hrs)</option>
                      <option value="Urgent">Priority: Urgent Emergency</option>
                    </select>
                  </div>

                  <textarea
                    rows={3}
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    placeholder="Describe your issue or question in detail..."
                    className="w-full p-3 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0] text-xs text-[#182338] focus:outline-none focus:border-[#00C2B8]"
                  />

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Support Ticket</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
