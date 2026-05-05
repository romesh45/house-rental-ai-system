import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Amenity } from '../models/property.model';

@Injectable({
  providedIn: 'root'
})
export class AmenityService {
  private apiUrl = `${environment.apiUrl}/amenities`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<{ count: number; amenities: Amenity[] }> {
    return this.http.get<{ count: number; amenities: Amenity[] }>(this.apiUrl);
  }
}
