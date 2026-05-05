import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../../services/booking.service';
import { BookingRequest } from '../../../models/booking.model';

@Component({
  selector: 'app-booking-requests',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container" style="padding: 2rem 0;">
      <h1>Booking Requests</h1>

      @if (loading) {
        <div class="loading-container"><div class="spinner"></div></div>
      } @else if (bookings.length > 0) {
        <div style="margin-top: 2rem;">
          @for (booking of bookings; track booking.id) {
            <div class="card" style="margin-bottom: 1rem; padding: 1.5rem;">
              <div style="display: flex; justify-content: space-between; align-items: start;">
                <div>
                  <h3>{{ booking.property_title }}</h3>
                  <p><strong>Tenant:</strong> {{ booking.tenant_name }}</p>
                  <p><strong>Phone:</strong> {{ booking.tenant_phone }}</p>
                  <p><strong>Move-in Date:</strong> {{ booking.move_in_date | date }}</p>
                  @if (booking.message) {
                    <p><strong>Message:</strong> {{ booking.message }}</p>
                  }
                </div>
                <div>
                  <span class="badge" [class.badge-warning]="booking.status === 'pending'"
                    [class.badge-success]="booking.status === 'approved'"
                    [class.badge-danger]="booking.status === 'rejected'">
                    {{ booking.status }}
                  </span>
                  @if (booking.status === 'pending') {
                    <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                      <button class="btn btn-success btn-sm" (click)="updateStatus(booking.id, 'approved')">Approve</button>
                      <button class="btn btn-danger btn-sm" (click)="updateStatus(booking.id, 'rejected')">Reject</button>
                    </div>
                  }
                </div>
              </div>
            </div>
          }
        </div>
      } @else {
        <div style="text-align: center; padding: 4rem;">
          <span class="material-icons" style="font-size: 5rem; color: var(--text-light);">event_busy</span>
          <h3>No Booking Requests</h3>
        </div>
      }
    </div>
  `
})
export class BookingRequestsComponent implements OnInit {
  bookings: BookingRequest[] = [];
  loading = true;

  constructor(private bookingService: BookingService) {}

  ngOnInit() {
    this.bookingService.getReceivedBookings().subscribe({
      next: (response: any) => { this.bookings = response.bookings; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  updateStatus(id: number, status: string) {
    this.bookingService.updateStatus(id, status).subscribe({
      next: () => { this.ngOnInit(); },
      error: (err: any) => { console.error(err); }
    });
  }
}
