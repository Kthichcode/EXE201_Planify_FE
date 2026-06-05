export interface PlanFramework {
  id: string;
  name: string;
  slug: string;
  description: string;
  structure: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePlanFrameworkDto {
  name: string;
  slug: string;
  description: string;
  structure: string;
  isActive: boolean;
}

export interface UpdatePlanFrameworkDto {
  name: string;
  slug: string;
  description: string;
  structure: string;
  isActive: boolean;
}

export interface PlanTemplate {
  id: string;
  frameworkId: string | null;
  frameworkName?: string;
  categoryId: string | null;
  title: string;
  description: string;
  templateContent: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePlanTemplateDto {
  frameworkId: string | null;
  categoryId: string | null;
  title: string;
  description: string;
  templateContent: string;
  isActive: boolean;
}

export interface UpdatePlanTemplateDto {
  frameworkId: string | null;
  categoryId: string | null;
  title: string;
  description: string;
  templateContent: string;
  isActive: boolean;
}
