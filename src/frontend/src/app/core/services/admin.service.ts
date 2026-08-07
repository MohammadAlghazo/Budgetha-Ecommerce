import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TransactionHistoryDto } from '../../features/admin/admin-logs.component';

export interface AdminStats {
  totalUsers: number;
  totalProducts: number;
  pendingProducts: number;
  totalOrders: number;
}

export interface SellerStats {
  totalProducts: number;
  totalSales: number;
  totalRevenue: number;
  totalOrders: number;
}

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  createdAt: string;
  isBanned?: boolean;
}

export interface AdminUserProfile extends AdminUser {
  products: {
    id: string;
    name: string;
    price: number;
    categories: { name: string }[];
    images: string[];
    approvalStatus: string;
  }[];
  orders: {
    id: string;
    orderNumber: string;
    date: string;
    totalAmount: number;
    status: string;
  }[];
}

export interface AdminProductResult {
  items: any[];
  total: number;
  totalPages: number;
}

export interface PagedUserResult {
  items: AdminUser[];
  total: number;
  totalPages: number;
  page: number;
  pageSize: number;
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

  getSellerStats(): Observable<SellerStats> {
    return this.http.get<SellerStats>(`${this.apiUrl}/seller-stats`);
  }

  getRecentUsers(count: number = 5): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>(`${this.apiUrl}/recent-users?count=${count}`);
  }

  getAllUsers(page: number = 1, pageSize: number = 20): Observable<PagedUserResult> {
    return this.http.get<PagedUserResult>(`${this.apiUrl}/users?page=${page}&pageSize=${pageSize}`);
  }

  getAllProducts(page: number = 1, pageSize: number = 50, sort?: string, category?: string): Observable<AdminProductResult> {
    let url = `${this.apiUrl}/products?page=${page}&pageSize=${pageSize}`;
    if (sort) url += `&sort=${sort}`;
    if (category) url += `&category=${category}`;
    return this.http.get<AdminProductResult>(url);
  }

  
  assignRole(userId: string, role: string): Observable<any> {
    return this.http.post(`${this.rolesUrl}/assign`, { userId, role });
  }

  removeRole(userId: string, role: string): Observable<any> {
    return this.http.post(`${this.rolesUrl}/remove`, { userId, role });
  }

  
  approveProduct(productId: string, status: 'Approved' | 'Rejected'): Observable<any> {
    const statusValue = status === 'Approved' ? 1 : 2;
    return this.http.patch(`${this.productsUrl}/${productId}/approve`, statusValue, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  
  deleteProduct(productId: string): Observable<any> {
    return this.http.delete(`${this.productsUrl}/${productId}`);
  }

  
  getUserProfile(userId: string): Observable<AdminUserProfile> {
    return this.http.get<AdminUserProfile>(`${this.apiUrl}/users/${userId}/profile`);
  }

  banUser(userId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/${userId}/ban`, {});
  }

  unbanUser(userId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/${userId}/unban`, {});
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${userId}`, { observe: 'response' });
  }

  getTransactionHistory(type: string, startDate?: string, endDate?: string): Observable<TransactionHistoryDto[]> {
    let params = new HttpParams().set('type', type);
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);

    return this.http.get<TransactionHistoryDto[]>(`${environment.apiUrl}/orders/history`, { params });
  }

  getAnnouncements(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/announcements`);
  }
}
