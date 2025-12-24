import React, { useState } from 'react';
import { ParkingSpot } from '../types.ts';

interface ParkingCardProps {
  spot: ParkingSpot;
  onClick: (spot: ParkingSpot) => void;
}

export const ParkingCard: React.FC<ParkingCardProps> = ({ spot, onClick }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div 
      className="group cursor-pointer flex flex-col gap-3 animate-fade-in"
      onClick={() => onClick(spot)}
    >
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100 border border-gray-100">
        {!isLoaded && (
          <div className="absolute inset-0 shimmer flex items-center justify-center">
            <i className="fas fa-car text-gray-300 text-3xl"></i>
          </div>
        )}
        
        <img 
          src={spot.image} 
          alt={spot.title} 
          onLoad={() => setIsLoaded(true)}
          className={`object-cover w-full h-full transition-all duration-500 group-hover:scale-105 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
        
        <div className="absolute top-3 right-3 text-white/90 drop-shadow-md hover:scale-110 transition-transform">
          <i className="fa-regular fa-heart text-xl"></i>
        </div>
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-gray-900 truncate">{spot.location}</h3>
          <div className="flex items-center gap-1">
            <i className="fas fa-star text-[10px] text-indigo-600"></i>
            <span className="text-sm font-semibold">{spot.rating}</span>
          </div>
        </div>
        <p className="text-gray-500 text-sm truncate">{spot.title}</p>
        <p className="font-bold mt-1">
          ${spot.pricePerHour.toFixed(2)} <span className="font-normal text-gray-500 text-sm">/ hr</span>
        </p>
      </div>
    </div>
  );
};