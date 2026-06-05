import { apiClient } from './apiClient';
import { ApiResponse } from './authService';
import { PlanTemplate, CreatePlanTemplateDto, UpdatePlanTemplateDto } from '../types/admin.types';

export const adminTemplateService = {
  async getAll(): Promise<ApiResponse<PlanTemplate[]>> {
    return apiClient('/admin/plan-templates', {
      method: 'GET',
    });
  },

  async getById(id: string): Promise<ApiResponse<PlanTemplate>> {
    return apiClient(`/admin/plan-templates/${id}`, {
      method: 'GET',
    });
  },

  async getByFrameworkId(frameworkId: string): Promise<ApiResponse<PlanTemplate[]>> {
    return apiClient(`/admin/plan-templates/framework/${frameworkId}`, {
      method: 'GET',
    });
  },

  async create(data: CreatePlanTemplateDto): Promise<ApiResponse<PlanTemplate>> {
    return apiClient('/admin/plan-templates', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: UpdatePlanTemplateDto): Promise<ApiResponse<PlanTemplate>> {
    return apiClient(`/admin/plan-templates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deactivate(id: string): Promise<ApiResponse<boolean>> {
    return apiClient(`/admin/plan-templates/${id}/deactivate`, {
      method: 'DELETE',
    });
  },

  async delete(id: string): Promise<ApiResponse<boolean>> {
    return apiClient(`/admin/plan-templates/${id}`, {
      method: 'DELETE',
    });
  }
};
