import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Announcement {
  id: string;
  message: string;
  subtitle?: string;
  badgeText?: string;
  promoCode?: string;
  discountPercent?: number;
  linkUrl?: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  created: string;
}

export interface CreateAnnouncementDto {
  message: string;
  subtitle?: string;
  badgeText?: string;
  promoCode?: string;
  discountPercent?: number;
  linkUrl?: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
}

export interface UpdateAnnouncementDto extends CreateAnnouncementDto {
  id: string;
}

@Injectable({ providedIn: 'root' })
export class AnnouncementService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/announcements`;

  getAll(): Observable<Announcement[]> {
    return this.http.get<Announcement[]>(this.apiUrl);
  }

  getActive(): Observable<Announcement | null> {
    return this.http.get<Announcement | null>(`${this.apiUrl}/active`);
  }

  create(dto: CreateAnnouncementDto): Observable<string> {
    return this.http.post<string>(this.apiUrl, dto);
  }

  update(id: string, dto: UpdateAnnouncementDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
