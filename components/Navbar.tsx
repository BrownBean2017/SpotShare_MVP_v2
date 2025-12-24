
import React from 'react';
import { ViewMode } from '../types.ts';

interface NavbarProps {
  onNavigate: (view: ViewMode) => void;
  currentView: ViewMode;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 md:px-12 py-4 flex items-center justify-between shadow-sm">
      <div 
        className="flex items-center gap-2 cursor-pointer group"
        onClick={() => onNavigate(ViewMode.HOME)}
      >
        <div className="bg-indigo-600 text-white p-2 rounded-lg group-hover:bg-indigo-700 transition-colors">
          <i className="fas fa-parking text-xl"></i>
        </div>
        <span className="text-xl font-bold text-gray-900 tracking-tight">ParkShare</span>
      </div>

      <div className="hidden md:flex items-center gap-8">
        <button 
          onClick={() => onNavigate(ViewMode.HOME)}
          className={`font-medium transition-colors ${currentView === ViewMode.HOME ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
        >
          Explore
        </button>
        <button 
          onClick={() => onNavigate(ViewMode.SEARCH)}
          className={`font-medium transition-colors ${currentView === ViewMode.SEARCH ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
        >
          Find Parking
        </button>
        <button 
          onClick={() => onNavigate(ViewMode.HOST)}
          className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 py-2 rounded-full font-medium transition-colors"
        >
          List your spot
        </button>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
          <i className="fas fa-globe"></i>
        </button>
        <div className="flex items-center gap-2 border border-gray-300 rounded-full px-3 py-1 hover:shadow-md transition-shadow cursor-pointer">
          <i className="fas fa-bars text-gray-500 text-sm"></i>
          <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white">
            <i className="fas fa-user text-sm"></i>
          </div>
        </div>
      </div>
    </nav>
  );
};
