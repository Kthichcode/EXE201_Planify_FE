import { ApiResponse } from './authService';
import { apiClient } from './apiClient';
import { 
  SubscriptionPlan, 
  UserSubscription, 
  CreateSubscriptionPlanDto, 
  UpgradeSubscriptionDto 
} from '../types/subscription.types';

export const subscriptionService = {
  // Admin Endpoints
  async adminGetAllPlans(): Promise<ApiResponse<SubscriptionPlan[]>> {
    return apiClient('/admin/subscriptions/plans', {
      method: 'GET',
    });
  },

  async adminCreatePlan(data: CreateSubscriptionPlanDto): Promise<ApiResponse<SubscriptionPlan>> {
    return apiClient('/admin/subscriptions/plans', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async adminUpdatePlan(id: string, data: CreateSubscriptionPlanDto): Promise<ApiResponse<SubscriptionPlan>> {
    return apiClient(`/admin/subscriptions/plans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async adminDeactivatePlan(id: string): Promise<ApiResponse<void>> {
    return apiClient(`/admin/subscriptions/plans/${id}`, {
      method: 'DELETE',
    });
  },

  // User Endpoints
  async getActivePlans(): Promise<ApiResponse<SubscriptionPlan[]>> {
    return apiClient('/subscriptions/plans', {
      method: 'GET',
      skipAuth: true,
    });
  },

  async getCurrentSubscription(): Promise<ApiResponse<UserSubscription>> {
    return apiClient('/subscriptions/current', {
      method: 'GET',
    });
  },

  async upgradeSubscription(data: UpgradeSubscriptionDto): Promise<ApiResponse<UserSubscription>> {
    return apiClient('/subscriptions/upgrade', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
};
