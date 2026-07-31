import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CloudinaryUploadResponse {
  url: string;
  publicId: string;
}

@Injectable({ providedIn: 'root' })
export class CloudinaryService {
  private readonly http = inject(HttpClient);
  
  
  private readonly uploadEndpoint = `${environment.apiUrl}/images/upload`;

  
  uploadImage(file: File): Observable<CloudinaryUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post<CloudinaryUploadResponse>(this.uploadEndpoint, formData);
  }

  deleteImage(publicId: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/images?publicId=${encodeURIComponent(publicId)}`);
  }
}
