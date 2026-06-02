import { apiClient } from './apiClient';
import { 
  getAccessToken, 
  getRefreshToken, 
  getUser, 
  saveAuthData, 
  clearAuthData, 
  UserData 
} from '../utils/token';

export type { UserData };

export interface AuthResponseData {
  accessToken: string;
  refreshToken: string;
  email: string;
  fullName: string;
  role?: string;
  accessTokenExpiration: string;
  refreshTokenExpiration: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export interface RegisterData {
  email: string;
  fullName: string;
  password?: string;
}

export interface LoginData {
  email: string;
  password?: string;
}

export const authService = {
  async register(data: RegisterData): Promise<ApiResponse<AuthResponseData>> {
    return apiClient('/Auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
      skipAuth: true,
    });
  },

  async login(data: LoginData): Promise<ApiResponse<AuthResponseData>> {
    return apiClient('/Auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
      skipAuth: true,
    });
  },

  async googleLogin(idToken: string): Promise<ApiResponse<AuthResponseData>> {
    return apiClient('/Auth/google-login', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
      skipAuth: true,
    });
  },

  async refreshToken(refreshToken: string): Promise<ApiResponse<AuthResponseData>> {
    return apiClient('/Auth/refresh-token', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
      skipAuth: true,
    });
  },

  async logout(_accessToken: string, refreshToken: string): Promise<ApiResponse<null>> {
    return apiClient('/Auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  },

  // Re-export token utilities to maintain backward compatibility
  saveAuthData,
  clearAuthData,
  getAccessToken,
  getRefreshToken,
  getUser,
};
