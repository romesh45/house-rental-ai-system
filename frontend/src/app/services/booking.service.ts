import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BookingRequest, CreateBookingRequest } from '../models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = `${environment.apiUrl}/bookings`;

  constructor(private http: HttpClient) {}

  create(booking: CreateBookingRequest): Observable<{ message: string; booking: BookingRequest }> {
    return this.http.post<{ message: string; booking: BookingRequest }>(this.apiUrl, booking);
  }

  getMyBookings(): Observable<{ count: number; bookings: BookingRequest[] }> {
    return this.http.get<{ count: number; bookings: BookingRequest[] }>(`${this.apiUrl}/my-bookings`);
  }

  getReceivedBookings(): Observable<{ count: number; bookings: BookingRequest[] }> {
    return this.http.get<{ count: number; bookings: BookingRequest[] }>(`${this.apiUrl}/received`);
  }

  updateStatus(id: number, status: string): Observable<{ message: string; booking: BookingRequest }> {
    return this.http.put<{ message: string; booking: BookingRequest }>(`${this.apiUrl}/${id}/status`, { status });
  }

  delete(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
