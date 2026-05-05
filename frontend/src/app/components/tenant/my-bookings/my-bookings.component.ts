import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookingService } from '../../../services/booking.service';
import { BookingRequest } from '../../../models/booking.model';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container" style="padding: 2rem 0;">
      <h1>My Bookings</h1>

      @if (loading) {
        <div class="loading-container"><div class="spinner"></div></div>
      } @else if (bookings.length > 0) {
        <div style="margin-top: 2rem;">
          @for (booking of bookings; track booking.id) {
            <div class="card" style="margin-bottom: 1rem; padding: 1.5rem;">
              <div style="display: flex; justify-content: space-between;">
                <div>
                  <h3>{{ booking.property_title }}</h3>
                  <p>{{ booking.property_address }}</p>
                  <p><strong>Rent:</strong> ₹{{ booking.property_rent | number }}/month</p>
                  <p><strong>Move-in Date:</strong> {{ booking.move_in_date | date }}</p>
                  <p><strong>Owner:</strong> {{ booking.owner_name }}</p>
                </div>
                <div>
                  <span class="badge" [class.badge-warning]="booking.status === 'pending'"
                    [class.badge-success]="booking.status === 'approved'"
                    [class.badge-danger]="booking.status === 'rejected'">
                    {{ booking.status }}
                  </span>
                </div>
              </div>
              <div style="margin-top: 1rem;">
                <a [routerLink]="['/properties', booking.property_id]" class="btn btn-outline btn-sm">View Property</a>
              </div>
            </div>
          }
        </div>
      } @else {
        <div style="text-align: center; padding: 4rem;">
          <span class="material-icons" style="font-size: 5rem; color: var(--text-light);">event_busy</span>
          <h3>No Bookings Yet</h3>
          <p>Start by browsing properties</p>
          <a routerLink="/properties" class="btn btn-primary">Browse Properties</a>
        </div>
      }
    </div>
  `
})
export class MyBookingsComponent implements OnInit {
  bookings: BookingRequest[] = [];
  loading = true;

  constructor(private bookingService: BookingService) {}

  ngOnInit() {
    this.bookingService.getMyBookings().subscribe({
      next: (response: any) => { this.bookings = response.bookings; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }
}
