
import { ParkingSpot } from './types';

export const MOCK_SPOTS: ParkingSpot[] = [
  {
    id: '1',
    title: 'Secure Underground Spot near City Hall',
    description: 'A dedicated underground parking space with 24/7 security cameras and gate access. Perfect for commuters.',
    pricePerHour: 4.5,
    location: 'Downtown, Los Angeles',
    coordinates: { lat: 34.0522, lng: -118.2437 },
    image: 'https://picsum.photos/seed/park1/800/600',
    rating: 4.9,
    reviews: 124,
    features: ['CCTV', 'Underground', 'EV Charging'],
    owner: { name: 'Sarah J.', avatar: 'https://picsum.photos/seed/user1/100/100' }
  },
  {
    id: '2',
    title: 'Private Driveway - 5 min to Stadium',
    description: 'Park your car in our wide, safe driveway. Just a short walk to the main entrance of the stadium.',
    pricePerHour: 15.0,
    location: 'Inglewood, CA',
    coordinates: { lat: 33.9617, lng: -118.3531 },
    image: 'https://picsum.photos/seed/park2/800/600',
    rating: 4.7,
    reviews: 89,
    features: ['Easy Access', 'Well Lit', 'Gated'],
    owner: { name: 'Mike T.', avatar: 'https://picsum.photos/seed/user2/100/100' }
  },
  {
    id: '3',
    title: 'Corner Parking Space in Arts District',
    description: 'Oversized spot suitable for SUVs or large vans. Vibrant neighborhood with lots of cafes nearby.',
    pricePerHour: 3.0,
    location: 'Arts District, LA',
    coordinates: { lat: 34.045, lng: -118.232 },
    image: 'https://picsum.photos/seed/park3/800/600',
    rating: 4.8,
    reviews: 45,
    features: ['Large Vehicle', '24/7 Access'],
    owner: { name: 'Elena R.', avatar: 'https://picsum.photos/seed/user3/100/100' }
  }
];
