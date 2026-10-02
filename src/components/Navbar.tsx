import React, { useState } from 'react';
import { Sparkles, PenTool, LayoutDashboard, BookOpen, Database, User as UserIcon, LogOut, Menu, X, ArrowRight } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentUser: User | null;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onOpenSqlQueries: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  currentUser,
  onOpenLogin,
  onOpenRegister,
  onOpenSqlQueries,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Home' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'create', label: 'Create Blog' },
    { id: 'my-blogs', label: 'My Blogs' },
  ];

  const handleNavClick = (tabId: string) => {
    setCurrentTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-rose-200/60 bg-white/80 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <button
          onClick={() => handleNavClick('landing')}
          className="group flex items-center gap-2.5 text-left focus:outline-none"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-rose-400 via-rose-500 to-rose-600 text-white shadow-sm shadow-rose-300/40 transition-transform group-hover:scale-105">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <span className="font-editorial text-xl font-bold tracking-tight text-stone-900 group-hover:text-rose-950 transition-colors">
              Bloom<span className="text-rose-600 italic">Script</span>
            </span>
            <span className="block text-[10px] tracking-wider uppercase text-rose-800/80 font-semibold">
              AI Editorial Studio
            </span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-1.5 text-sm font-medium transition-colors relative ${
                  isActive
                    ? 'text-rose-800 font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-rose-500 rounded-full" />
                )}
              </button>
            );
          })}

          {/* PostgreSQL 18 Queries Trigger Button */}
          <button
            onClick={onOpenSqlQueries}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50/80 hover:bg-rose-100/80 border border-rose-200/80 rounded-lg transition-all ml-2"
            title="Inspect PostgreSQL 18 schema & production queries"
          >
            <Database className="h-3.5 w-3.5 text-rose-500" />
            <span>Postgres 18 Docs</span>
          </button>
        </nav>

        {/* Right Action: User Avatar or Auth CTA */}
        <div className="hidden md:flex items-center gap-3">
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 rounded-full p-1 pl-2 text-sm text-stone-700 hover:bg-rose-50/60 border border-transparent hover:border-rose-200/60 transition-all focus:outline-none"
              >
                <img
                  src={currentUser.profile_image || `https://api.dicebear.com/7.x/notionists/svg?seed=${currentUser.email}`}
                  alt={currentUser.full_name}
                  className="h-8 w-8 rounded-full border border-rose-200 object-cover"
                />
                <span className="font-medium text-stone-800 text-xs hidden lg:inline">
                  {currentUser.full_name.split(' ')[0]}
                </span>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-rose-100 bg-white p-2 shadow-lg shadow-rose-900/5 ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-2 border-b border-rose-50">
                    <p className="text-xs font-semibold text-stone-900 truncate">{currentUser.full_name}</p>
                    <p className="text-[11px] text-stone-700 truncate">{currentUser.email}</p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setCurrentTab('profile');
                        setUserDropdownOpen(false);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-stone-700 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <UserIcon className="h-3.5 w-3.5 text-stone-500" />
                      View Author Profile
                    </button>
                    <button
                      onClick={() => {
                        setCurrentTab('my-blogs');
                        setUserDropdownOpen(false);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-stone-700 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <BookOpen className="h-3.5 w-3.5 text-stone-500" />
                      My Articles ({currentUser.blogs_count || 0})
                    </button>
                  </div>
                  <div className="border-t border-rose-50 pt-1">
                    <button
                      onClick={() => {
                        onLogout();
                        setUserDropdownOpen(false);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenLogin}
                className="px-3.5 py-1.5 text-xs font-medium text-stone-700 hover:text-rose-600 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={onOpenRegister}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 rounded-lg shadow-sm shadow-rose-300/40 transition-all hover:shadow"
              >
                <span>Register</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Quick Create Button */}
          <button
            onClick={() => handleNavClick('create')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-rose-900 bg-rose-100/70 hover:bg-rose-200/80 rounded-lg border border-rose-300/60 transition-all"
          >
            <PenTool className="h-3.5 w-3.5 text-rose-600" />
            <span>Write</span>
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-stone-600 hover:text-stone-900 rounded-lg focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-rose-100 bg-white px-4 pt-2 pb-4 shadow-xl">
          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`block w-full text-left px-3 py-2 text-sm font-medium rounded-lg ${
                  currentTab === item.id ? 'bg-rose-50 text-rose-600' : 'text-stone-700 hover:bg-rose-50/50'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => {
                onOpenSqlQueries();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm font-medium text-rose-700 bg-rose-50/60 rounded-lg"
            >
              <Database className="h-4 w-4" />
              PostgreSQL 18 Queries
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-rose-100">
            {currentUser ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-3 py-1">
                  <img
                    src={currentUser.profile_image}
                    alt={currentUser.full_name}
                    className="h-9 w-9 rounded-full border border-rose-200"
                  />
                  <div>
                    <p className="text-sm font-semibold text-stone-900">{currentUser.full_name}</p>
                    <p className="text-xs text-stone-700">{currentUser.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleNavClick('profile')}
                  className="block w-full text-left px-3 py-1.5 text-xs text-stone-700 hover:bg-rose-50 rounded"
                >
                  View Profile
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded font-medium"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    onOpenLogin();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-sm font-medium text-stone-700 border border-stone-200 rounded-lg text-center"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    onOpenRegister();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-sm font-medium text-white bg-rose-600 rounded-lg text-center"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
