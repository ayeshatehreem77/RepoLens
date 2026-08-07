import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const pageTitles = {
  '/dashboard': 'Dashboard Overview',
  '/projects': 'Project Repositories',
  '/issues': 'Issue Tracker',
  '/pull-requests': 'Pull Requests Overview',
};

const Topbar = ({ onOpenMobileSidebar }) => {
  const location = useLocation();
  const { user } = useAuth();
  const currentTitle = pageTitles[location.pathname] || 'Dashboard';

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#0A1228]/80 backdrop-blur-md border-b border-[rgba(216,193,138,0.20)] px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      {/* Left Area: Title & Mobile Trigger */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden text-[#A9B2C5] hover:text-[#F2F0E8] focus:outline-none p-1 rounded-md"
          aria-label="Open sidebar"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <h1 className="text-lg sm:text-xl font-semibold text-[#F2F0E8] tracking-tight">
          {currentTitle}
        </h1>
      </div>

      {/* Right Area: Search & Actions */}
      <div className="flex items-center space-x-3 sm:space-x-5">
        {/* Search Bar */}
        <div className="relative hidden sm:block w-48 md:w-64">
          <input
            type="text"
            placeholder="Search repositories, issues..."
            className="w-full bg-[#101B35] border border-[rgba(216,193,138,0.20)] text-xs text-[#F2F0E8] placeholder-[#A9B2C5]/50 rounded-md py-1.5 pl-9 pr-3 focus:outline-none focus:border-[#D8C18A] focus:ring-1 focus:ring-[#D8C18A] transition-colors"
          />
          <svg
            className="w-4 h-4 text-[#A9B2C5]/70 absolute left-3 top-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>

        {/* Notifications Icon */}
        <button
          className="relative p-2 text-[#A9B2C5] hover:text-[#D8C18A] hover:bg-[#101B35] rounded-full transition-colors focus:outline-none"
          aria-label="View notifications"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.857 17.082a2.375 2.375 0 01-4.286 0M12 4.5v-1.5m6.364 12.364A9 9 0 105.636 15.364l.942-.942A6 6 0 018.25 10.5V9a3.75 3.75 0 017.5 0v1.5a6 6 0 001.672 3.922l.942.942z" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#D8C18A] rounded-full ring-2 ring-[#0A1228]" />
        </button>

        {/* Divider */}
        <div className="h-5 w-[1px] bg-[rgba(255,255,255,0.08)]" />

        {/* Profile Avatar */}
        <div className="flex items-center space-x-2">
          <img
            src={user?.avatar || 'https://via.placeholder.com/32'}
            alt="Profile Avatar"
            className="w-8 h-8 rounded-full border border-[#D8C18A]/40 object-cover"
          />
          <span className="hidden md:inline-block text-xs font-medium text-[#F2F0E8]">
            {user?.name?.split(' ')[0] || 'User'}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Topbar;