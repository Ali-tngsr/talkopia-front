'use client';

import type { ReactNode, ComponentType } from 'react';

interface NavItem {
  id: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
}

interface DashboardLayoutProps {
  navItems: NavItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
  children: ReactNode;
  /** Optional accent color for active tab — defaults to sage */
  accentClass?: string;
}

/**
 * Shared dashboard layout:
 * - Desktop (lg+): vertical sidebar on the start side
 * - Mobile: sticky horizontal scrollable tab bar
 */
export function DashboardLayout({
  navItems,
  activeTab,
  onTabChange,
  children,
  accentClass = 'bg-[#9EB766] text-white',
}: DashboardLayoutProps) {
  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[220px_1fr]">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block">
        <nav className="sticky top-32 space-y-1 rounded-[2rem] border border-[#5E6646]/10 bg-white/80 p-3 shadow-sm">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black transition ${
                  activeTab === item.id
                    ? `${accentClass} shadow-sm`
                    : 'text-[#5E6646]/70 hover:bg-[#F2EED9]'
                }`}
              >
                <Icon className="h-4 w-4" /> {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Mobile sticky tab bar */}
      <div className="lg:hidden">
        <nav className="sticky top-20 z-20 -mx-4 mb-2 flex gap-1.5 overflow-x-auto border-b border-[#5E6646]/10 bg-[#F2EED9]/90 px-4 py-2.5 backdrop-blur-md no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex flex-shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-black transition ${
                  activeTab === item.id
                    ? `${accentClass} shadow-sm`
                    : 'bg-white/60 text-[#5E6646]/70'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="whitespace-nowrap">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <main>{children}</main>
    </div>
  );
}
