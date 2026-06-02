import { apiClient } from './apiClient';
import { ApiResponse } from './authService';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
}

export const userService = {
  async getProfile(): Promise<ApiResponse<UserProfile>> {
    return apiClient('/user/profile', {
      method: 'GET',
    });
  }
};
