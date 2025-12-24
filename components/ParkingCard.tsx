import React from 'react';
import { ParkingSpot } from '../types.ts';

interface ParkingCardProps {
  spot: ParkingSpot;
  onClick: (spot: ParkingSpot) => void;
}

export const ParkingCard: React.FC<ParkingCardProps> = ({ spot, onClick }) => {
  return (
    <div 
      className="group cursor-pointer flex flex-col gap-3 animate-fade-in"
      onClick={() => onClick(spot)}
    >
      <div className="relative aspect-square overflow-hidden rounded-[1.5rem] bg-gray-100">
        <img 
          src={spot.image} 
          alt={spot.title} 
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
        />
        <button className="absolute top-4 right-4 text-white/90 text-xl drop-shadow-lg hover:scale-125 hover:text-red-500 transition-all">
          <i className="fa-regular fa-heart"></i>
        </button>
        {spot.rating >= 4.9 && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-sm">
            Superhost
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
        <p className="text-indigo-600/70 text-[10px] font-bold mt-1 uppercase tracking-tighter">Available Today</p>
        <p className="mt-2 font-bold text-lg">
          ${spot.pricePerHour.toFixed(2)} <span className="font-medium text-gray-400 text-sm">hour</span>
        </p>
      </div>
    </div>
  );
};