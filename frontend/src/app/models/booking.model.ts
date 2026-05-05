export interface BookingRequest {
  id: number;
  property_id: number;
  tenant_id: number;
  owner_id: number;
  move_in_date: Date;
  message?: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  created_at?: Date;
  updated_at?: Date;
  property_title?: string;
  property_address?: string;
  property_rent?: number;
  tenant_name?: string;
  tenant_email?: string;
  tenant_phone?: string;
  owner_name?: string;
}

export interface CreateBookingRequest {
  property_id: number;
  move_in_date: string;
  message?: string;
}
