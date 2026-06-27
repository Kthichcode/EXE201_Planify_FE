import { apiClient } from './apiClient';
import { ApiResponse } from './authService';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
}

export interface UserAdminResponse {
  id: string;
  email: string;
  fullName: string;
  roles: string[];
  planName?: string;
  planStatus?: string;
  subscriptionExpiresAt?: string;
}

export interface OnboardingStatus {
  status: 'not_started' | 'in_progress' | 'completed' | 'skipped';
  step: number;
  shouldShowTour: boolean;
}

export const userService = {
  async getProfile(): Promise<ApiResponse<UserProfile>> {
    return apiClient('/User/profile', {
      method: 'GET',
    });
  },

  async adminGetAllUsers(): Promise<ApiResponse<UserAdminResponse[]>> {
    return apiClient('/admin/users', {
      method: 'GET',
    });
  },

  async getOnboardingStatus(): Promise<ApiResponse<OnboardingStatus>> {
    return apiClient('/User/onboarding', {
      method: 'GET',
    });
  },

  async updateOnboarding(status: string, step: number): Promise<ApiResponse<OnboardingStatus>> {
    return apiClient('/User/onboarding', {
      method: 'PUT',
      body: JSON.stringify({ status, step }),
    });
  },
};

