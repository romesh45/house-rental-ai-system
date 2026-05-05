export interface User {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
  role: 'tenant' | 'owner' | 'admin';
  profile_image?: string;
  created_at?: Date;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  role: 'tenant' | 'owner';
}
