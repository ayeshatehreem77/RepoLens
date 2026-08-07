import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navigation = [
  {
    name: 'Dashboard',
    to: '/dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    name: 'Projects',
    to: '/projects',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.25 12.75l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12.75M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
  {
    name: 'Issues',
    to: '/issues',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>
    ),
  },
  {
    name: 'Pull Requests',
    to: '/pull-requests',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
  },
];

const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const { user, logout } = useAuth();

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity" 
          onClick={() => setMobileOpen(false)} 
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0A1228] border-r border-[rgba(216,193,138,0.20)] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo / Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#101B35] border border-[#D8C18A]/40 flex items-center justify-center gold-glow-sm">
              <span className="text-[#D8C18A] font-bold text-lg leading-none">R</span>
            </div>
            <span className="text-[#F2F0E8] font-bold text-lg tracking-wider">
              Repo<span className="text-[#D8C18A]">Lens</span>
            </span>
          </div>

          <button 
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-[#A9B2C5] hover:text-[#F2F0E8] focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <div className="px-3 mb-3 text-xs font-medium text-[#A9B2C5]/60 uppercase tracking-widest">
            Menu
          </div>
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-[#101B35] text-[#D8C18A] border-l-2 border-[#D8C18A] shadow-inner'
                    : 'text-[#A9B2C5] hover:text-[#F2F0E8] hover:bg-[#101B35]/50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`mr-3 transition-colors ${isActive ? 'text-[#D8C18A]' : 'text-[#A9B2C5] group-hover:text-[#F2F0E8]'}`}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User / Profile Footer Section */}
        <div className="p-4 border-t border-[rgba(255,255,255,0.06)] bg-[#050B1C]/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 overflow-hidden">
              <img
                src={user?.avatar || 'https://via.placeholder.com/40'}
                alt={user?.name || 'User Avatar'}
                className="w-9 h-9 rounded-full object-cover border border-[#D8C18A]/30"
              />
              <div className="truncate">
                <p className="text-sm font-medium text-[#F2F0E8] truncate">{user?.name || 'Developer'}</p>
                <p className="text-xs text-[#A9B2C5] truncate">{user?.role || 'Developer'}</p>
              </div>
            </div>

            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 text-[#A9B2C5] hover:text-[#D8C18A] hover:bg-[#101B35] rounded-md transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;