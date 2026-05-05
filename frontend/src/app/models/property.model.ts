export interface Property {
  id: number;
  owner_id: number;
  title: string;
  description?: string;
  property_type: 'apartment' | 'house' | 'villa' | 'studio' | 'penthouse';
  address: string;
  city: string;
  state: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  rent_amount: number;
  security_deposit?: number;
  area_sqft?: number;
  bedrooms: number;
  bathrooms: number;
  is_available: boolean;
  available_from?: Date;
  created_at?: Date;
  updated_at?: Date;
  owner_name?: string;
  owner_phone?: string;
  owner_email?: string;
  images?: string[];
  primary_image?: string;
  amenities?: Amenity[];
}

export interface Amenity {
  id: number;
  name: string;
  icon?: string;
}

export interface PropertySearchFilters {
  city?: string;
  minRent?: number;
  maxRent?: number;
  property_type?: string;
  bedrooms?: number;
  amenities?: number[];
}
