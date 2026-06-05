import { apiClient } from './apiClient';
import { ApiResponse } from './authService';
import { PlanFramework, CreatePlanFrameworkDto, UpdatePlanFrameworkDto } from '../types/admin.types';

export const adminFrameworkService = {
  async getAll(): Promise<ApiResponse<PlanFramework[]>> {
    return apiClient('/admin/plan-frameworks', {
      method: 'GET',
    });
  },

  async getById(id: string): Promise<ApiResponse<PlanFramework>> {
    return apiClient(`/admin/plan-frameworks/${id}`, {
      method: 'GET',
    });
  },

  async create(data: CreatePlanFrameworkDto): Promise<ApiResponse<PlanFramework>> {
    return apiClient('/admin/plan-frameworks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: UpdatePlanFrameworkDto): Promise<ApiResponse<PlanFramework>> {
    return apiClient(`/admin/plan-frameworks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deactivate(id: string): Promise<ApiResponse<boolean>> {
    return apiClient(`/admin/plan-frameworks/${id}/deactivate`, {
      method: 'DELETE',
    });
  },

  async delete(id: string): Promise<ApiResponse<boolean>> {
    return apiClient(`/admin/plan-frameworks/${id}`, {
      method: 'DELETE',
    });
  }
};
