import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from '../models/shop.models';

export interface AddReviewDto {
  productId: string;
  rating: number;
  comment?: string;
}

export interface UpdateReviewDto {
  reviewId: string;
  rating: number;
  comment?: string;
}

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5272/api/reviews';

  getReviews(productId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/${productId}`);
  }

  addReview(dto: AddReviewDto): Observable<string> {
    return this.http.post<string>(this.apiUrl, dto);
  }

  updateReview(id: string, dto: UpdateReviewDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, dto);
  }

  deleteReview(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
