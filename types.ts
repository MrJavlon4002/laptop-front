
export interface Laptop {
  id: string;
  brand: string;
  model: string;
  processor: string; // Renamed from cpu
  ram: string;
  storage: string;
  screenSize?: string; // Kept as optional for detail/form views
  os?: string;         // Kept as optional for detail/form views
  price: number;
  gpu?: string;        // New field
  rating?: number;     // New field
  stock: number;
  tags?: string[];     // New field
  imageUrl?: string;   // Kept as optional
  description?: string;// Kept as optional
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface LaptopFilterParams {
  brand?: string;
  price_min?: number; // Renamed from minPrice
  price_max?: number; // Renamed from maxPrice
  ram?: string;
  storage?: string;
  rating_min?: number; // New filter
  tags?: string;       // New filter (comma-separated string)
  page?: number;
  limit?: number;
  // sortBy and sortOrder removed as per new API spec
}

export interface Meta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginatedLaptopsResponse {
  data: Laptop[]; // Changed from laptops
  meta: Meta;     // New nested structure
}

export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: { [key: string]: string[] } | { message: string }[]; // Adjusted to handle backend error structure
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}
