
export interface ParkingSpot {
  id: string;
  title: string;
  description: string;
  pricePerHour: number;
  location: string;
  coordinates: { lat: number; lng: number };
  image: string;
  rating: number;
  reviews: number;
  features: string[];
  owner: {
    name: string;
    avatar: string;
  };
}

export enum ViewMode {
  HOME = 'HOME',
  SEARCH = 'SEARCH',
  LISTING_DETAIL = 'LISTING_DETAIL',
  HOST = 'HOST'
}

export interface GroundingSource {
  title: string;
  uri: string;
}
