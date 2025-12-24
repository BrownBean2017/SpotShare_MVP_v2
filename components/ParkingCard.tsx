
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
      <div className="relative aspect-square overflow-hidden rounded-xl">
        <img 
          src={spot.image} 
          alt={spot.title} 
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
        />
        <button className="absolute top-3 right-3 text-white text-xl drop-shadow-md hover:scale-110 transition-transform">
          <i className="far fa-heart"></i>
        </button>
      </div>
      
      <div>
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-gray-900 line-clamp-1">{spot.location}</h3>
          <div className="flex items-center gap-1">
            <i className="fas fa-star text-xs text-indigo-600"></i>
            <span className="text-sm font-medium">{spot.rating}</span>
          </div>
        </div>
        <p className="text-gray-500 text-sm line-clamp-1">{spot.title}</p>
        <p className="text-gray-500 text-sm mt-1">Available now</p>
        <p className="mt-2 font-semibold">
          ${spot.pricePerHour.toFixed(2)} <span className="font-normal text-gray-500">hour</span>
        </p>
      </div>
    </div>
  );
};
