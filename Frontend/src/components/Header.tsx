import { useState } from 'react';
import { Search, Bell, User, Menu, Sparkles, CheckCircle2 } from 'lucide-react';
import { Page } from '../types';

interface HeaderProps {
  currentTab: Page;
  onChangeTab: (tab: Page) => void;
  onOpenMobileMenu: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilterTab: 'overview' | 'recent' | 'starred';
  onFilterTabChange: (filter: 'overview' | 'recent' | 'starred') => void;
}

export default function Header({
  currentTab,
  onChangeTab,
  onOpenMobileMenu,
  searchQuery,
  onSearchChange,
  activeFilterTab,
  onFilterTabChange
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileCard, setShowProfileCard] = useState(false);

  const notifications = [
    { id: 1, text: "Analysis of Advanced Thermodynamics is complete", time: "5 mins ago", read: false },
    { id: 2, text: "New report saved successfully", time: "1 hour ago", read: true },
    { id: 3, text: "Welcome to QGenie AI platform!", time: "1 day ago", read: true }
  ];

  const handleSubTabClick = (tabId: 'overview' | 'recent' | 'starred') => {
    onFilterTabChange(tabId);
    if (tabId === 'overview') {
      onChangeTab('dashboard');
    } else if (tabId === 'recent') {
      onChangeTab('reports');
    } else {
      onChangeTab('question_bank');
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 w-full bg-white border-b border-slate-200 px-6 gap-4 flex items-center justify-between">
      {/* Brand logo or mobile trigger */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onOpenMobileMenu}
          className="p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden focus:outline-none"
        >
          <Menu className="h-6 w-6" />
        </button>

        <div className="flex items-center gap-6">
          <span className="text-xl font-extrabold text-[#142175]">QGenie</span>
          
          {/* Sub Navigation tabs */}
          <div className="hidden md:flex items-center gap-6 h-16">
            <button
              onClick={() => handleSubTabClick('overview')}
              className={`text-sm font-semibold h-full px-2 border-b-2 transition-all relative top-[1px] ${
                activeFilterTab === 'overview' && (currentTab === 'dashboard' || currentTab === 'upload')
                  ? 'border-[#142175] text-[#142175]'
                  : 'border-transparent text-slate-500 hover:text-[#142175]'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => handleSubTabClick('recent')}
              className={`text-sm font-semibold h-full px-2 border-b-2 transition-all relative top-[1px] ${
                activeFilterTab === 'recent' || currentTab === 'reports'
                  ? 'border-[#142175] text-[#142175]'
                  : 'border-transparent text-slate-500 hover:text-[#142175]'
              }`}
            >
              Recent
            </button>
            <button
              onClick={() => handleSubTabClick('starred')}
              className={`text-sm font-semibold h-full px-2 border-b-2 transition-all relative top-[1px] ${
                activeFilterTab === 'starred' || (currentTab === 'question_bank')
                  ? 'border-[#142175] text-[#142175]'
                  : 'border-transparent text-slate-500 hover:text-[#142175]'
              }`}
            >
              Starred
            </button>
          </div>
        </div>
      </div>

      {/* Global Interactive actions & Seacher bar */}
      <div className="flex items-center gap-4">
        <div className="relative max-w-xs hidden sm:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search papers or questions..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-48 md:w-64 pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#142175] focus:ring-1 focus:ring-[#142175] transition-all"
          />
        </div>

        {/* Notifications list trigger */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileCard(false);
            }}
            className="p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-700 rounded-full transition-all relative cursor-pointer"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl border border-slate-100 shadow-xl py-2 z-50 animate-fade-in">
              <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <span className="text-xs font-bold text-slate-800">Alerts & Statuses</span>
                <span className="text-[10px] text-indigo-600 font-semibold cursor-pointer hover:underline">Mark all read</span>
              </div>
              <div className="divide-y divide-slate-50 max-h-60 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-4 hover:bg-slate-50 flex gap-3 cursor-pointer">
                    <div className="h-2 w-2 rounded-full bg-indigo-600 mt-1.5 shrink-0" style={{ opacity: n.read ? 0.3 : 1 }}></div>
                    <div>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">{n.text}</p>
                      <span className="text-[10px] text-slate-400 font-medium mt-1 inline-block">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile details trigger */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowProfileCard(!showProfileCard);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-1.5 pr-3 hover:bg-slate-50 rounded-full transition-all text-slate-600 cursor-pointer"
          >
            <div className="h-7 w-7 rounded-full bg-[#142175] text-white flex items-center justify-center text-xs font-bold font-mono">
              JD
            </div>
            <span className="text-xs font-semibold text-slate-700 hidden md:inline">Dr. Julian Dash</span>
          </button>

          {showProfileCard && (
            <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl border border-slate-100 shadow-xl p-4 z-50">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="h-10 w-10 rounded-full bg-[#142175] text-white flex items-center justify-center font-bold text-sm">
                  JD
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Dr. Julian Dash</h4>
                  <p className="text-xs text-slate-400">ryanjigo05@gmail.com</p>
                </div>
              </div>
              <div className="pt-3 space-y-1">
                <div className="flex justify-between items-center text-xs p-2 text-slate-600 hover:bg-slate-50 rounded-xl cursor-pointer">
                  <span>Current Institute:</span>
                  <span className="font-semibold text-slate-800">AI National Univ</span>
                </div>
                <div className="flex justify-between items-center text-xs p-2 text-slate-600 hover:bg-slate-50 rounded-xl cursor-pointer">
                  <span>Usage plan:</span>
                  <span className="font-semibold text-indigo-600 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> Pro Educator
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
