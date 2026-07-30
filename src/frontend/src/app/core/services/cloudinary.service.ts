import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CloudinaryUploadResponse {
  url: string;
  publicId: string;
}

@Injectable({ providedIn: 'root' })
export class CloudinaryService {
  private readonly http = inject(HttpClient);
  // Defaulting to a backend endpoint which safely delegates to Cloudinary
  // This avoids hardcoding Cloudinary secrets in the frontend.
  private readonly uploadEndpoint = 'http://localhost:5272/api/images/upload';

  /**
   * Uploads an image file using FormData to the backend, which securely forwards it to Cloudinary.
   * Ensures the correct content type (multipart/form-data) is handled by the browser.
   */
  uploadImage(file: File): Observable<CloudinaryUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    // Angular's HttpClient will automatically set the Content-Type boundary for FormData
    return this.http.post<CloudinaryUploadResponse>(this.uploadEndpoint, formData);
  }
}
