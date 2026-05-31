'use client';
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { tValue, Language } from '@/lib/i18n';
import { Globe, Menu, X, User, LogOut, Sprout, ChevronDown } from 'lucide-react';
import NotificationBell from './notification-bell';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  lang: Language;
  onLangChange: (lang: Language) => void;
  onLoginClick: () => void;
}

const TABS = [
  { id: 'home', key: 'home' },
  { id: 'prices', key: 'prices' },
  { id: 'marketplace', key: 'marketplace' },
  { id: 'weather', key: 'weather' },
  { id: 'forum', key: 'forum' },
];

const MORE_TABS = [
  { id: 'directory', key: 'directory' },
  { id: 'alerts', key: 'alerts' },
  { id: 'dashboard', key: 'dashboard' },
  { id: 'profile', key: 'profile' },
];

export default function Header({ activeTab, onTabChange, lang, onLangChange, onLoginClick }: HeaderProps) {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const handleTab = (tab: string) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
    setMoreOpen(false);
  };

  const avatarUrl = user?.id === 'admin1' ? '/admin-photo.png' : null;

  return (
    <header className="sticky top-0 z-50 glass bg-gradient-to-r from-green-600/95 to-green-700/95 text-white shadow-lg shadow-green-900/10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16">
          <button onClick={() => handleTab('home')} className="flex items-center gap-2 font-bold text-xl hover:opacity-90 transition group">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition shadow-inner">
              <Sprout className="w-5 h-5" />
            </div>
            <span className="flex items-center gap-1.5">
              TogoAgric
              <span className="text-base">🇹🇬</span>
            </span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full hidden sm:inline">v7</span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTab(tab.id)}
                className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white shadow-sm'
                    : 'text-green-100 hover:bg-white/10 hover:text-white'
                } ${activeTab === tab.id ? 'tab-active-indicator' : ''}`}
              >
                {tValue(tab.key, lang)}
              </button>
            ))}
            {/* More dropdown */}
            <div className="relative">
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                  MORE_TABS.some(t => t.id === activeTab)
                    ? 'bg-white/20 text-white shadow-sm'
                    : 'text-green-100 hover:bg-white/10 hover:text-white'
                } ${MORE_TABS.some(t => t.id === activeTab) ? 'tab-active-indicator' : ''}`}
              >
                Plus
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
              </button>
              {moreOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMoreOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-xl py-2 min-w-[200px] z-50 animate-fade-in-up border border-gray-100">
                    {MORE_TABS.map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => handleTab(tab.id)}
                        className={`block w-full text-left px-4 py-2.5 text-sm transition ${
                          activeTab === tab.id ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {tValue(tab.key, lang)}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Language switcher */}
            <div className="flex items-center bg-white/10 rounded-lg overflow-hidden border border-white/10">
              {(['fr', 'ewe', 'kab'] as Language[]).map(l => (
                <button
                  key={l}
                  onClick={() => onLangChange(l)}
                  className={`px-2 py-1.5 text-xs font-bold uppercase transition ${
                    lang === l ? 'bg-white text-green-700 shadow-sm' : 'text-green-100 hover:bg-white/10'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-2">
                {avatarUrl ? (
                  <button
                    onClick={() => handleTab('profile')}
                    className="w-8 h-8 rounded-full border-2 border-white/30 overflow-hidden hover:border-white/60 transition shadow-sm"
                  >
                    <img src={avatarUrl} alt="Profile" className="w-8 h-8 object-cover" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleTab('profile')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition"
                  >
                    <User className="w-4 h-4" />
                    <span className="max-w-[100px] truncate">{user?.name}</span>
                  </button>
                )}
                {isAdmin && (
                  <span className="text-[10px] bg-amber-400/20 text-amber-200 px-1.5 py-0.5 rounded-full border border-amber-400/30">
                    Admin
                  </span>
                )}
                <button
                  onClick={logout}
                  className="p-1.5 bg-white/10 rounded-lg hover:bg-white/20 transition"
                  title={tValue('logout', lang)}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 bg-white text-green-700 rounded-lg text-sm font-bold hover:bg-green-50 transition shadow-sm"
              >
                <User className="w-4 h-4" />
                {tValue('login', lang)}
              </button>
            )}

            {/* Notification bell - only for authenticated users */}
            {isAuthenticated && (
              <div className="hidden sm:block">
                <NotificationBell lang={lang} />
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 border-t border-white/20 pt-3 animate-fade-in-up">
            <div className="grid grid-cols-2 gap-2">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => handleTab(tab.id)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium text-left transition ${
                    activeTab === tab.id
                      ? 'bg-white/20 text-white shadow-sm'
                      : 'text-green-100 hover:bg-white/10'
                  }`}
                >
                  {tValue(tab.key, lang)}
                </button>
              ))}
            </div>
            <div className="border-t border-white/10 my-2" />
            <div className="grid grid-cols-2 gap-2">
              {MORE_TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => handleTab(tab.id)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium text-left transition ${
                    activeTab === tab.id
                      ? 'bg-white/20 text-white shadow-sm'
                      : 'text-green-100 hover:bg-white/10'
                  }`}
                >
                  {tValue(tab.key, lang)}
                </button>
              ))}
            </div>
            {/* Mobile auth section */}
            <div className="border-t border-white/10 my-2" />
            <div className="px-2 py-1">
              {isAuthenticated ? (
                <div className="flex items-center justify-between px-2 py-2">
                  <div className="flex items-center gap-2">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Profile" className="w-8 h-8 rounded-full object-cover border-2 border-white/30 shadow-sm" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                    <div>
                      <span className="text-sm font-medium text-white">{user?.name}</span>
                      {isAdmin && <span className="ml-1.5 text-[10px] bg-amber-400/20 text-amber-200 px-1.5 py-0.5 rounded-full">Admin</span>}
                    </div>
                  </div>
                  <button onClick={logout} className="text-sm text-red-200 hover:text-white px-3 py-1.5 bg-white/10 rounded-lg transition">{tValue('logout', lang)}</button>
                </div>
              ) : (
                <button
                  onClick={() => { onLoginClick(); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 bg-white text-green-700 rounded-xl text-sm font-bold shadow-sm hover:bg-green-50 transition"
                >
                  {tValue('login', lang)}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
