import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Property, PropertySearchFilters } from '../models/property.model';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private apiUrl = `${environment.apiUrl}/properties`;

  constructor(private http: HttpClient) {}

  getAll(filters?: PropertySearchFilters): Observable<{ count: number; properties: Property[] }> {
    let params = new HttpParams();
    
    if (filters) {
      if (filters.city) params = params.set('city', filters.city);
      if (filters.minRent) params = params.set('minRent', filters.minRent.toString());
      if (filters.maxRent) params = params.set('maxRent', filters.maxRent.toString());
      if (filters.property_type) params = params.set('property_type', filters.property_type);
      if (filters.bedrooms) params = params.set('bedrooms', filters.bedrooms.toString());
      if (filters.amenities && filters.amenities.length > 0) {
        params = params.set('amenities', filters.amenities.join(','));
      }
    }

    return this.http.get<{ count: number; properties: Property[] }>(this.apiUrl, { params });
  }

  getById(id: number): Observable<{ property: Property }> {
    return this.http.get<{ property: Property }>(`${this.apiUrl}/${id}`);
  }

  getMyProperties(): Observable<{ count: number; properties: Property[] }> {
    return this.http.get<{ count: number; properties: Property[] }>(`${this.apiUrl}/my/properties`);
  }

  create(property: Partial<Property>): Observable<{ message: string; property: Property }> {
    return this.http.post<{ message: string; property: Property }>(this.apiUrl, property);
  }

  createWithImages(formData: FormData): Observable<{ message: string; property: Property }> {
    return this.http.post<{ message: string; property: Property }>(this.apiUrl, formData);
  }

  update(id: number, property: Partial<Property>): Observable<{ message: string; property: Property }> {
    return this.http.put<{ message: string; property: Property }>(`${this.apiUrl}/${id}`, property);
  }

  delete(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  uploadImages(propertyId: number, files: File[]): Observable<{ message: string; images: string[] }> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });
    return this.http.post<{ message: string; images: string[] }>(`${this.apiUrl}/${propertyId}/images`, formData);
  }
}
