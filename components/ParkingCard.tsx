import React, { useState } from 'react';
import { ParkingSpot } from '../types.ts';

interface ParkingCardProps {
  spot: ParkingSpot;
  onClick: (spot: ParkingSpot) => void;
}

export const ParkingCard: React.FC<ParkingCardProps> = ({ spot, onClick }) => {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  return (
    <div 
      className="group cursor-pointer flex flex-col gap-3 animate-in"
      onClick={() => onClick(spot)}
    >
      <div className="relative aspect-square overflow-hidden rounded-[1.5rem] bg-gray-100 shadow-sm">
        {/* Shimmer Placeholder */}
        {status === 'loading' && (
          <div className="absolute inset-0 shimmer flex items-center justify-center">
            <i className="fas fa-car text-gray-300 text-3xl"></i>
          </div>
        )}

        {/* Error Fallback */}
        {status === 'error' && (
          <div className="absolute inset-0 bg-gray-200 flex flex-col items-center justify-center text-gray-400 p-4 text-center">
            <i className="fas fa-image-slash text-2xl mb-2"></i>
            <span className="text-[10px] font-bold uppercase">Image Preview Unavailable</span>
          </div>
        )}
        
        <img 
          src={spot.image} 
          alt={spot.title} 
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          className={`object-cover w-full h-full transition-all duration-700 group-hover:scale-110 
            ${status === 'loaded' ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        />
        
        <button 
          className="absolute top-4 right-4 text-white/90 text-xl drop-shadow-lg hover:scale-125 hover:text-red-500 transition-all z-10"
          onClick={(e) => { e.stopPropagation(); /* Handle favorite */ }}
        >
          <i className="fa-regular fa-heart"></i>
        </button>
        
        {spot.rating >= 4.9 && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-sm z-10">
            Guest Favorite
          </div>
        )}
      </div>
      
      <div className="px-1">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-gray-900 line-clamp-1">{spot.location}</h3>
          <div className="flex items-center gap-1">
            <i className="fas fa-star text-xs text-indigo-600"></i>
            <span className="text-sm font-semibold">{spot.rating}</span>
          </div>
        </div>
        <p className="text-gray-500 text-sm line-clamp-1 mt-0.5">{spot.title}</p>
        <p className="text-indigo-600/70 text-[10px] font-bold mt-1 uppercase tracking-tighter">Instant Book</p>
        <p className="mt-2 font-bold text-lg">
          ${spot.pricePerHour.toFixed(2)} <span className="font-medium text-gray-400 text-sm">hour</span>
        </p>
      </div>
    </div>
  );
};