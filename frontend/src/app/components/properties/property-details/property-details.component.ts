import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PropertyService } from '../../../services/property.service';
import { BookingService } from '../../../services/booking.service';
import { AuthService } from '../../../services/auth.service';
import { Property } from '../../../models/property.model';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-property-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './property-details.component.html',
  styleUrls: ['./property-details.component.css']
})
export class PropertyDetailsComponent implements OnInit {
  property: Property | null = null;
  loading = true;
  showBookingForm = false;
  bookingData = {
    move_in_date: '',
    message: ''
  };
  bookingSuccess = false;
  bookingError = '';
  minDate = new Date().toISOString().split('T')[0];

  constructor(
    private route: ActivatedRoute,
    private propertyService: PropertyService,
    private bookingService: BookingService,
    public authService: AuthService
  ) {}

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
      },
      error: (error: any) => {
        console.error('Error loading property:', error);
        this.loading = false;
      }
    });
  }

  toggleBookingForm() {
    this.showBookingForm = !this.showBookingForm;
    this.bookingSuccess = false;
    this.bookingError = '';
  }

  submitBooking() {
    if (!this.property || !this.bookingData.move_in_date) {
      this.bookingError = 'Please select a move-in date';
      return;
    }

    // Validate move-in date is not in the past
    const selectedDate = new Date(this.bookingData.move_in_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      this.bookingError = 'Move-in date cannot be in the past';
      return;
    }

    const booking = {
      property_id: this.property.id!,
      move_in_date: this.bookingData.move_in_date,
      message: this.bookingData.message
    };

    this.bookingService.create(booking).subscribe({
      next: () => {
        this.bookingSuccess = true;
        this.bookingError = '';
        this.bookingData = { move_in_date: '', message: '' };
        setTimeout(() => {
          this.showBookingForm = false;
          this.bookingSuccess = false;
        }, 3000);
      },
      error: (error: any) => {
        this.bookingError = error.error?.message || 'Failed to submit booking request. Please try again.';
        this.bookingSuccess = false;
      }
    });
  }

  getImageUrl(imagePath?: string): string {
    if (!imagePath) {
      return '/assets/images/placeholder.svg';
    }
    const baseUrl = environment.apiUrl.replace('/api', '');

    const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    return `${baseUrl}/${cleanPath}`;
  }
}
