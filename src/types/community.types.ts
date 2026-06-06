import { Plan } from './plan.types';

export interface CommunityPlanSummary {
  id: string;
  planId: string;
  userId: string;
  authorName: string | null;
  categoryId: string | null;
  title: string;
  description: string | null;
  status: string;
  downloadCount: number;
  likeCount: number;
  isLikedByCurrentUser: boolean | null;
  createdAt: string;
}

export interface CommunityPlan extends Omit<CommunityPlanSummary, 'isLikedByCurrentUser'> {
  reviewedBy: string | null;
  reviewedAt: string | null;
  rejectReason: string | null;
  isLikedByCurrentUser: boolean | null;
  updatedAt: string;
  plan: Plan | null;
}

export interface CommunityPlanQuery {
  search?: string;
  categoryId?: string;
  sortBy?: 'newest' | 'popular' | 'most_downloaded';
  page?: number;
  pageSize?: number;
}

export interface PublishPlanDto {
  planId: string;
  title: string;
  description?: string;
  categoryId?: string | null;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page?: number;
  pageSize?: number;
}
