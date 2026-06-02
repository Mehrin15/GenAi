import { 
  LayoutDashboard, 
  CloudUpload, 
  BarChart2, 
  BookOpen, 
  Settings, 
  HelpCircle, 
  Plus,
  User
} from 'lucide-react';
import { Page } from '../types';

interface SidebarProps {
  currentTab: Page;
  onChangeTab: (tab: Page) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ currentTab, onChangeTab, isOpen = false, onClose }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard' as Page, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'upload' as Page, label: 'Upload Papers', icon: CloudUpload },
    { id: 'reports' as Page, label: 'Analysis Reports', icon: BarChart2 },
    { id: 'question_bank' as Page, label: 'Question Bank', icon: BookOpen },
  ];

  const handleTabClick = (tabId: Page) => {
    onChangeTab(tabId);
    if (onClose) onClose();
  };

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between bg-white border-r border-[#e2e8f0]">
      {/* Brand Logo and Title */}
      <div className="p-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-[#142175] flex items-center justify-center text-white font-black text-lg">
            Q
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#142175]">QGenie AI</h1>
            <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold font-mono">Academic Assistant</p>
          </div>
        </div>
      </div>

      {/* Main Navigation Tab links */}
      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-150 ${
                isActive
                  ? 'bg-[#142175] text-white shadow-sm ring-1 ring-black/5 font-semibold'
                  : 'text-slate-600 hover:bg-[#f1f5f9] hover:text-[#142175] font-medium'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-[#142175]'}`} />
                <span className="text-sm">{item.label}</span>
              </div>
              {isActive && (
                <div className="h-1.5 w-1.5 rounded-full bg-white"></div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Interactive Controls & Bottom actions */}
      <div className="p-4 border-t border-slate-100 space-y-3">
        <button
          onClick={() => handleTabClick('upload')}
          className="w-full bg-[#142175] text-white py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#25339c] transition-all hover:scale-[1.01] active:scale-[0.99] shadow-sm cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>New Analysis</span>
        </button>

        <button
          onClick={() => handleTabClick('settings')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
            currentTab === 'settings' 
              ? 'bg-[#142175]/10 text-[#142175] font-semibold' 
              : 'text-slate-600 hover:bg-[#f1f5f9] font-medium'
          }`}
        >
          <Settings className="h-5 w-5 text-slate-400" />
          <span className="text-sm">Settings</span>
        </button>

        <button
          onClick={() => handleTabClick('support')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
            currentTab === 'support' 
              ? 'bg-[#142175]/10 text-[#142175] font-semibold' 
              : 'text-slate-600 hover:bg-[#f1f5f9] font-medium'
          }`}
        >
          <HelpCircle className="h-5 w-5 text-slate-400" />
          <span className="text-sm">Support</span>
        </button>

        {/* User Account Info card */}
        <div className="flex items-center gap-3 p-3 mt-4 bg-slate-50 rounded-xl border border-slate-100">
          <div className="h-10 w-10 rounded-full bg-[#dfe0ff] text-[#142175] flex items-center justify-center font-bold font-mono">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-slate-800 truncate">Dr. Julian Dash</h4>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider truncate">Senior Examiner</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={onClose} />
      )}
      {/* Sidebar container */}
      <aside className={`fixed top-0 bottom-0 left-0 z-40 w-64 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:block`}>
        {sidebarContent}
      </aside>
    </>
  );
}
