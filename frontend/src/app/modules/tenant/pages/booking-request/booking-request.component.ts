import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PropertyService } from '../../../../services/property.service';
import { BookingService } from '../../../../services/booking.service';
import { Property } from '../../../../models/property.model';

@Component({
  selector: 'app-booking-request',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="booking-request-container">
      <!-- Loading State -->
      <div class="loading-container" *ngIf="loading">
        <mat-spinner></mat-spinner>
        <p>Loading property details...</p>
      </div>

      <!-- Booking Form -->
      <div class="booking-content" *ngIf="!loading && property">
        <!-- Back Button -->
        <button mat-button [routerLink]="['/tenant/properties', property.id]" class="back-button">
          <mat-icon>arrow_back</mat-icon>
          Back to Property Details
        </button>

        <div class="booking-grid">
          <!-- Property Summary -->
          <mat-card class="property-summary">
            <h2>Property Summary</h2>
            <div class="summary-content">
              <h3>{{ property.title }}</h3>
              <p class="location">
                <mat-icon>location_on</mat-icon>
                {{ property.address }}, {{ property.city }}, {{ property.state }}
              </p>
              <div class="property-info">
                <span><mat-icon>bed</mat-icon> {{ property.bedrooms }} Beds</span>
                <span><mat-icon>bathroom</mat-icon> {{ property.bathrooms }} Baths</span>
                <span><mat-icon>square_foot</mat-icon> {{ property.area_sqft }} sq ft</span>
              </div>
              <div class="rent-info">
                <span class="rent-amount">\${{ property.rent_amount }}</span>
                <span class="per-month">per month</span>
              </div>
            </div>
          </mat-card>

          <!-- Booking Form -->
          <mat-card class="booking-form-card">
            <h2>Request Booking</h2>
            <p class="form-description">
              Fill out the form below to request a booking for this property. 
              The owner will review your request and respond shortly.
            </p>

            <form [formGroup]="bookingForm" (ngSubmit)="submitBooking()">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Move-in Date</mat-label>
                <input matInput 
                       [matDatepicker]="picker" 
                       formControlName="move_in_date"
                       [min]="minDate"
                       placeholder="Select your desired move-in date">
                <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
                <mat-error *ngIf="bookingForm.get('move_in_date')?.hasError('required')">
                  Move-in date is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Message to Owner (Optional)</mat-label>
                <textarea matInput 
                          formControlName="message"
                          rows="5"
                          placeholder="Tell the owner about yourself, your requirements, or any questions you may have..."></textarea>
                <mat-hint>Max 500 characters</mat-hint>
                <mat-error *ngIf="bookingForm.get('message')?.hasError('maxlength')">
                  Message cannot exceed 500 characters
                </mat-error>
              </mat-form-field>

              <div class="form-actions">
                <button mat-raised-button 
                        color="primary" 
                        type="submit"
                        [disabled]="bookingForm.invalid || submitting">
                  <mat-icon>send</mat-icon>
                  {{ submitting ? 'Submitting...' : 'Submit Request' }}
                </button>
                <button mat-button 
                        type="button"
                        [routerLink]="['/tenant/properties', property.id]"
                        [disabled]="submitting">
                  Cancel
                </button>
              </div>
            </form>

            <div class="info-box">
              <mat-icon color="primary">info</mat-icon>
              <div>
                <strong>What happens next?</strong>
                <ul>
                  <li>The property owner will review your booking request</li>
                  <li>You'll receive a notification when they respond</li>
                  <li>Check "My Bookings" to track the status</li>
                </ul>
              </div>
            </div>
          </mat-card>
        </div>
      </div>

      <!-- Error State -->
      <div class="error-container" *ngIf="!loading && !property">
        <mat-icon color="warn">error</mat-icon>
        <h2>Property Not Found</h2>
        <p>Unable to load property details for booking.</p>
        <button mat-raised-button color="primary" routerLink="/tenant/properties">
          Browse Properties
        </button>
      </div>
    </div>
  `,
  styles: [`
    .booking-request-container {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .loading-container,
    .error-container {
      text-align: center;
      padding: 80px 20px;
    }
    
    .loading-container p {
      margin-top: 16px;
      color: #666;
    }
    
    .error-container mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 16px;
    }
    
    .back-button {
      margin-bottom: 24px;
    }
    
    .booking-grid {
      display: grid;
      grid-template-columns: 350px 1fr;
      gap: 24px;
    }
    
    .property-summary h2 {
      margin: 0 0 20px 0;
      font-size: 18px;
      color: #333;
    }
    
    .summary-content h3 {
      margin: 0 0 12px 0;
      font-size: 20px;
      color: #333;
    }
    
    .location {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #666;
      margin-bottom: 16px;
    }
    
    .location mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }
    
    .property-info {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 20px;
    }
    
    .property-info span {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #666;
      font-size: 14px;
    }
    
    .property-info mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }
    
    .rent-info {
      padding: 16px;
      background-color: #f5f5f5;
      border-radius: 8px;
      text-align: center;
    }
    
    .rent-amount {
      display: block;
      font-size: 28px;
      font-weight: 700;
      color: #1976d2;
    }
    
    .per-month {
      color: #666;
      font-size: 14px;
    }
    
    .booking-form-card h2 {
      margin: 0 0 8px 0;
      font-size: 24px;
      color: #333;
    }
    
    .form-description {
      color: #666;
      margin-bottom: 32px;
      line-height: 1.6;
    }
    
    .full-width {
      width: 100%;
      margin-bottom: 20px;
    }
    
    .form-actions {
      display: flex;
      gap: 12px;
      margin: 24px 0;
    }
    
    .info-box {
      display: flex;
      gap: 12px;
      padding: 16px;
      background-color: #e3f2fd;
      border-radius: 8px;
      margin-top: 24px;
    }
    
    .info-box mat-icon {
      flex-shrink: 0;
    }
    
    .info-box strong {
      display: block;
      margin-bottom: 8px;
      color: #333;
    }
    
    .info-box ul {
      margin: 0;
      padding-left: 20px;
      color: #666;
    }
    
    .info-box li {
      margin-bottom: 4px;
    }
    
    @media (max-width: 968px) {
      .booking-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class BookingRequestComponent implements OnInit {
  property: Property | null = null;
  loading = true;
  submitting = false;
  bookingForm: FormGroup;
  minDate = new Date();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private propertyService: PropertyService,
    private bookingService: BookingService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.bookingForm = this.fb.group({
      move_in_date: ['', Validators.required],
      message: ['', [Validators.maxLength(500)]]
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProperty(parseInt(id));
    }
  }

  loadProperty(id: number) {
    this.propertyService.getById(id).subscribe({
      next: (response: any) => {
        this.property = response.property;
        this.loading = false;

        // Check if property is available
        if (!this.property?.is_available) {
          this.snackBar.open('This property is not available for booking', 'Close', {
            duration: 5000
          });
          this.router.navigate(['/tenant/properties', id]);
        }
      },
      error: (error: any) => {
        console.error('Error loading property:', error);
        this.loading = false;
      }
    });
  }

  submitBooking() {
    if (this.bookingForm.invalid || !this.property) {
      return;
    }

    this.submitting = true;

    const formValue = this.bookingForm.value;
    const booking = {
      property_id: this.property.id!,
      move_in_date: formValue.move_in_date.toISOString().split('T')[0],
      message: formValue.message || ''
    };

    this.bookingService.create(booking).subscribe({
      next: () => {
        this.snackBar.open('Booking request submitted successfully!', 'Close', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
        this.router.navigate(['/tenant/my-bookings']);
      },
      error: (error: any) => {
        console.error('Error submitting booking:', error);
        this.snackBar.open(
          error.error?.message || 'Failed to submit booking request. Please try again.',
          'Close',
          { duration: 5000, panelClass: ['error-snackbar'] }
        );
        this.submitting = false;
      }
    });
  }
}
