import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from '../models/shop.models';
import { environment } from '../../../environments/environment';

export interface AddReviewDto {
  productId: string;
  rating: number;
  comment?: string;
  images?: File[];
}

export interface UpdateReviewDto {
  reviewId: string;
  rating: number;
  comment?: string;
}

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/reviews`;

  getReviews(productId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/${productId}`);
  }

  getEligibility(productId: string): Observable<{ canReview: boolean; hasReviewed: boolean }> {
    return this.http.get<{ canReview: boolean; hasReviewed: boolean }>(`${this.apiUrl}/${productId}/eligibility`);
  }

  addReview(dto: AddReviewDto): Observable<string> {
    const formData = new FormData();
    formData.append('productId', dto.productId);
    formData.append('rating', dto.rating.toString());
    if (dto.comment) {
      formData.append('comment', dto.comment);
    }
    if (dto.images) {
      dto.images.forEach(img => {
        formData.append('images', img, img.name);
      });
    }
    return this.http.post<string>(this.apiUrl, formData);
  }

  updateReview(id: string, dto: UpdateReviewDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, dto);
  }

  deleteReview(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
