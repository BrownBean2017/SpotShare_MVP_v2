import React from 'react';
import { ViewMode } from '../types.ts';

interface NavbarProps {
  onNavigate: (view: ViewMode) => void;
  currentView: ViewMode;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView }) => {
  return (
    <nav className="sticky top-0 z-50 glass-nav border-b border-gray-100 px-4 md:px-12 py-4 flex items-center justify-between">
      <div 
        className="flex items-center gap-2 cursor-pointer group"
        onClick={() => onNavigate(ViewMode.HOME)}
      >
        <div className="bg-indigo-600 text-white w-10 h-10 rounded-xl flex items-center justify-center group-hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
          <i className="fas fa-p text-xl font-black"></i>
        </div>
        <span className="text-2xl font-black text-gray-900 tracking-tighter">ParkShare</span>
      </div>

      <div className="hidden md:flex items-center gap-8">
        <button 
          onClick={() => onNavigate(ViewMode.HOME)}
          className={`font-bold text-sm transition-colors ${currentView === ViewMode.HOME ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`}
        >
          Explore
        </button>
        <button 
          onClick={() => onNavigate(ViewMode.SEARCH)}
          className={`font-bold text-sm transition-colors ${currentView === ViewMode.SEARCH ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`}
        >
          Map View
        </button>
        <button 
          onClick={() => onNavigate(ViewMode.HOST)}
          className={`font-bold text-sm transition-colors ${currentView === ViewMode.HOST ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`}
        >
          Host a Spot
        </button>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all">
          <i className="fas fa-globe"></i>
        </button>
        <div className="flex items-center gap-3 border border-gray-200 rounded-full pl-3 pr-1 py-1 hover:shadow-lg transition-all cursor-pointer bg-white">
          <i className="fas fa-bars text-gray-400 text-sm"></i>
          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 shadow-inner">
            <i className="fas fa-user text-xs"></i>
          </div>
        </div>
      </div>
    </nav>
  );
};