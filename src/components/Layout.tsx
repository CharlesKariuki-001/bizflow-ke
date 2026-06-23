import React, { useState } from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  BarChart3,
  Settings,
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
  Store,
  Clock,
  CreditCard } from
'lucide-react';
import { useTheme } from './ThemeProvider';
import { Button } from './ui/Button';
import { motion } from 'framer-motion';
interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
}
export function Layout({
  children,
  currentView,
  onNavigate,
  onLogout
}: LayoutProps) {
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const navItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard
  },
  {
    id: 'pos',
    label: 'Point of Sale',
    icon: ShoppingCart
  },
  {
    id: 'inventory',
    label: 'Inventory',
    icon: Package
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: BarChart3
  },
  {
    id: 'billing',
    label: 'Billing & Plans',
    icon: CreditCard
  }];

  const handleNavigate = (id: string) => {
    onNavigate(id);
    setIsMobileMenuOpen(false);
  };
  return (
    <div className="min-h-screen bg-background bg-kenya-pattern flex transition-colors duration-300">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen &&
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
        onClick={() => setIsMobileMenuOpen(false)} />

      }

      {/* Sidebar */}
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-72 bg-surface/80 backdrop-blur-xl border-r border-border
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col shadow-soft-lg lg:shadow-none
      `}>
        
        {/* Logo Area */}
        <div className="h-20 flex items-center px-6 border-b border-border shrink-0">
          <div className="flex items-center gap-3 text-brand">
            <div className="p-2 bg-brand/10 rounded-xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-brand/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <Store className="w-8 h-8 relative z-10" />
            </div>
            <div>
              <h1 className="font-display font-bold text-xl text-text tracking-tight">
                BizFlow <span className="text-brand">KE</span>
              </h1>
              <p className="text-xs text-muted font-medium">SME Business OS</p>
            </div>
          </div>
          <button
            className="ml-auto lg:hidden text-muted hover:text-text"
            onClick={() => setIsMobileMenuOpen(false)}>
            
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all relative overflow-hidden
                  ${isActive ? 'text-white shadow-soft' : 'text-muted hover:bg-black/5 dark:hover:bg-white/5 hover:text-text'}
                `}>
                
                {isActive &&
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 bg-brand rounded-xl -z-10"
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30
                  }} />

                }
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} />
                {item.label}
              </button>);

          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-border space-y-2 shrink-0">
          <button
            onClick={() => setIsClockedIn(!isClockedIn)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-all border ${isClockedIn ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900/50 text-green-700 dark:text-green-400' : 'bg-surface border-border text-muted hover:bg-black/5 dark:hover:bg-white/5 hover:text-text'}`}>
            
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5" />
              {isClockedIn ? 'Clocked In' : 'Clock In'}
            </div>
            {isClockedIn &&
            <span className="text-xs font-bold animate-pulse">08:42</span>
            }
          </button>

          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-muted hover:bg-black/5 dark:hover:bg-white/5 hover:text-text transition-all">
            
            {theme === 'dark' ?
            <Sun className="w-5 h-5" /> :

            <Moon className="w-5 h-5" />
            }
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-muted hover:bg-black/5 dark:hover:bg-white/5 hover:text-text transition-all">
            <Settings className="w-5 h-5" />
            Settings
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-accent hover:bg-accent/10 transition-all">
            
            <LogOut className="w-5 h-5" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 bg-surface border-b border-border flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-2 text-brand">
            <Store className="w-6 h-6" />
            <span className="font-display font-bold text-lg text-text">
              BizFlow <span className="text-brand">KE</span>
            </span>
          </div>
          <button
            className="p-2 text-muted hover:text-text bg-black/5 dark:bg-white/5 rounded-lg"
            onClick={() => setIsMobileMenuOpen(true)}>
            
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 no-scrollbar relative z-10">
          <motion.div
            key={currentView}
            initial={{
              opacity: 0,
              y: 10
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.3
            }}
            className="max-w-7xl mx-auto h-full">
            
            {children}
          </motion.div>
        </div>
      </main>
    </div>);

}