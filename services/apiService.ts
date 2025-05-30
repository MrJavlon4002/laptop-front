
import { API_BASE_URL } from '../constants';
import { Laptop, User, ApiError, LaptopFilterParams, PaginatedLaptopsResponse, LoginCredentials, RegisterPayload, Meta } from '../types';

const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

interface RequestOptions extends RequestInit {
  needsAuth?: boolean;
  isFormData?: boolean;
}

async function handleResponse<T,>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData;
    let rawErrorBody: string | null = null; 

    try {
      // Try to parse as JSON first
      errorData = await response.json();
    } catch (e) {
      // If JSON parsing fails, try to get raw text response
      try {
        rawErrorBody = await response.text();
      } catch (textError) {
        // If reading text also fails, log it but continue
        console.error("Failed to read error response text:", textError);
      }
      // Fallback errorData if JSON parsing failed
      errorData = { message: response.statusText || "Server request failed" };
    }
    
    let errorMessage = `Request failed with status ${response.status}`;

    if (errorData?.message && typeof errorData.message === 'string' && errorData.message.trim() !== '' && errorData.message !== "Server request failed") {
        errorMessage = errorData.message;
    } else if (Array.isArray(errorData?.errors) && errorData.errors.length > 0 && errorData.errors[0]?.message) {
        errorMessage = errorData.errors.map((err: any) => err.message || JSON.stringify(err)).join(', ');
    } else if (rawErrorBody && rawErrorBody.trim() !== '') {
        // Use truncated raw body if it's not empty and more specific JSON error wasn't found
        errorMessage = rawErrorBody.substring(0, 300) + (rawErrorBody.length > 300 ? "..." : "");
    } else if (response.statusText && response.statusText.trim() !== '') {
        errorMessage = response.statusText;
    }
    
    // Prepend status if not already part of a detailed message from JSON
    if (!errorMessage.toLowerCase().includes(`status ${response.status}`) && ! (errorData?.message && typeof errorData.message === 'string' && errorData.message.trim() !== '')) {
        errorMessage = `Status ${response.status}: ${errorMessage}`;
    }


    const error: ApiError = {
      message: errorMessage,
      statusCode: response.status,
      errors: errorData?.errors, // This might be undefined if JSON parsing failed
    };
    throw error;
  }

  // Handle successful responses
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    if (response.status === 204 || response.headers.get('content-length') === '0') {
        // For 204 No Content, or empty JSON bodies, return undefined as T
        return undefined as T;
    }
    return response.json();
  }
  // For non-JSON successful responses (if any are expected, otherwise this is unusual)
  return undefined as T; 
}


async function request<T,>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { needsAuth = false, isFormData = false, ...fetchOptions } = options;
  const headers: HeadersInit = isFormData ? {} : { 'Content-Type': 'application/json', ...fetchOptions.headers };
  
  if (needsAuth) {
    const token = getAuthToken();
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    } else {
      // Not throwing an error here, but protected routes will fail on the backend
      console.warn('Auth token not found for protected route:', endpoint);
    }
  }

  const config: RequestInit = {
    ...fetchOptions,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    return handleResponse<T>(response);
  } catch (error) {
    // Handle network errors (e.g., server down, CORS, DNS issues)
    if (error instanceof TypeError && (error.message.toLowerCase().includes('failed to fetch') || error.message.toLowerCase().includes('networkerror'))) {
      const networkError: ApiError = {
        message: `Network Error: Could not connect to the server at ${API_BASE_URL}. Please check your network connection and ensure the server is running. (Details: ${error.message})`,
        statusCode: 0, // No HTTP status code for network errors
      };
      throw networkError;
    }
    // Re-throw other errors (e.g., errors already processed by handleResponse)
    throw error;
  }
}

// Auth Services
export const loginUser = (credentials: LoginCredentials): Promise<{ token: string }> => {
  let response = request<{ token: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  console.log(response)
  return response;
};

export const registerUser = (userData: RegisterPayload): Promise<User> => {
  return request<User>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

export const getCurrentUser = (): Promise<User> => {
  return request<User>('/auth/me', { needsAuth: true });
};

// Laptop Services
export const getLaptops = (params?: LaptopFilterParams): Promise<PaginatedLaptopsResponse> => {
  const queryParams = new URLSearchParams();
  if (params) {
    const paramMappings: { [key: string]: string } = {
      price_min: 'price_min',
      price_max: 'price_max',
      rating_min: 'rating_min',
    };

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && String(value).trim() !== '') {
        const backendKey = paramMappings[key] || key;
        queryParams.append(backendKey, String(value));
      }
    });
  }
  return request<PaginatedLaptopsResponse>(`/laptops?${queryParams.toString()}`);
};

export const getLaptopById = (id: string): Promise<Laptop> => {
  return request<Laptop>(`/laptops/${id}`);
};

type LaptopCreationPayload = Omit<Laptop, 'id' | 'createdAt' | 'updatedAt'>;

export const createLaptop = (laptopData: LaptopCreationPayload): Promise<Laptop> => {
  return request<Laptop>('/laptops', {
    method: 'POST',
    body: JSON.stringify(laptopData),
    needsAuth: true,
  });
};

export const updateLaptop = (id: string, laptopData: Partial<LaptopCreationPayload>): Promise<Laptop> => {
  return request<Laptop>(`/laptops/${id}`, {
    method: 'PUT',
    body: JSON.stringify(laptopData),
    needsAuth: true,
  });
};

export const deleteLaptop = (id: string): Promise<void> => {
  return request<void>(`/laptops/${id}`, {
    method: 'DELETE',
    needsAuth: true,
  });
};
