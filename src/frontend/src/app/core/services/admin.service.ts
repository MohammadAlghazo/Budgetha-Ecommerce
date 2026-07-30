import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AdminStats {
  totalUsers: number;
  totalProducts: number;
  pendingProducts: number;
  totalOrders: number;
}

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  createdAt: string;
}

export interface AdminProductResult {
  items: any[];
  total: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/admin`;
  private readonly rolesUrl = `${environment.apiUrl}/roles`;
  private readonly productsUrl = `${environment.apiUrl}/products`;

  getStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(`${this.apiUrl}/stats`);
  }

  getRecentUsers(count: number = 5): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>(`${this.apiUrl}/recent-users?count=${count}`);
  }

  getAllUsers(): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>(`${this.apiUrl}/users`);
  }

  getAllProducts(page: number = 1, pageSize: number = 50): Observable<AdminProductResult> {
    return this.http.get<AdminProductResult>(`${this.apiUrl}/products?page=${page}&pageSize=${pageSize}`);
  }

  // Role management (SuperAdmin only)
  assignRole(userId: string, role: string): Observable<any> {
    return this.http.post(`${this.rolesUrl}/assign`, { userId, role });
  }

  removeRole(userId: string, role: string): Observable<any> {
    return this.http.post(`${this.rolesUrl}/remove`, { userId, role });
  }

  // Product approval (Admin + SuperAdmin)
  approveProduct(productId: string, status: 'Approved' | 'Rejected'): Observable<any> {
    return this.http.patch(`${this.productsUrl}/${productId}/approve`, status, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Product deletion (SuperAdmin only)
  deleteProduct(productId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/products/${productId}`);
  }
}
