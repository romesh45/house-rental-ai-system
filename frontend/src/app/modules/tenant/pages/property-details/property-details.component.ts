import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { PropertyService } from '../../../../services/property.service';
import { Property } from '../../../../models/property.model';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-tenant-property-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ],
  template: `
    <div class="property-details-container">
      <!-- Loading State -->
      <div class="loading-container" *ngIf="loading">
        <mat-spinner></mat-spinner>
        <p>Loading property details...</p>
      </div>

      <!-- Property Details -->
      <div class="property-content" *ngIf="!loading && property">
        <!-- Back Button -->
        <button mat-button routerLink="/tenant/properties" class="back-button">
          <mat-icon>arrow_back</mat-icon>
          Back to Properties
        </button>

        <!-- Property Header -->
        <mat-card class="header-card">
          <div class="property-header">
            <div class="header-info">
              <h1>{{ property.title }}</h1>
              <p class="location">
                <mat-icon>location_on</mat-icon>
                {{ property.address }}, {{ property.city }}, {{ property.state }} {{ property.pincode }}
              </p>
            </div>
            <div class="header-price">
              <div class="rent-amount">\${{ property.rent_amount }}</div>
              <div class="per-month">per month</div>
            </div>
          </div>
        </mat-card>

        <!-- Property Images -->
        <mat-card class="images-card" *ngIf="property.images && property.images.length > 0">
          <div class="images-gallery">
            <img [src]="getImageUrl(property.images[0])" [alt]="property.title" class="main-image">
          </div>
        </mat-card>

        <!-- Property Details Grid -->
        <div class="details-grid">
          <!-- Basic Info -->
          <mat-card class="info-card">
            <h2>Property Details</h2>
            <mat-divider></mat-divider>
            <div class="info-list">
              <div class="info-item">
                <mat-icon>category</mat-icon>
                <span class="label">Type:</span>
                <span class="value">{{ property.property_type | titlecase }}</span>
              </div>
              <div class="info-item">
                <mat-icon>bed</mat-icon>
                <span class="label">Bedrooms:</span>
                <span class="value">{{ property.bedrooms }}</span>
              </div>
              <div class="info-item">
                <mat-icon>bathroom</mat-icon>
                <span class="label">Bathrooms:</span>
                <span class="value">{{ property.bathrooms }}</span>
              </div>
              <div class="info-item">
                <mat-icon>square_foot</mat-icon>
                <span class="label">Square Feet:</span>
                <span class="value">{{ property.area_sqft }} sq ft</span>
              </div>
              <div class="info-item">
                <mat-icon>event</mat-icon>
                <span class="label">Available From:</span>
                <span class="value">{{ property.available_from | date: 'mediumDate' }}</span>
              </div>
            </div>
          </mat-card>

          <!-- Availability -->
          <mat-card class="info-card">
            <h2>Availability</h2>
            <mat-divider></mat-divider>
            <div class="availability-status">
              <mat-chip-set>
                <mat-chip [color]="property.is_available ? 'accent' : 'warn'" highlighted>
                  {{ property.is_available ? 'Available Now' : 'Not Available' }}
                </mat-chip>
              </mat-chip-set>
              <p class="availability-text" *ngIf="property.is_available">
                This property is currently available for booking.
              </p>
              <p class="availability-text" *ngIf="!property.is_available">
                This property is currently not available.
              </p>
            </div>
          </mat-card>
        </div>

        <!-- Description -->
        <mat-card class="description-card">
          <h2>Description</h2>
          <mat-divider></mat-divider>
          <p class="description-text">{{ property.description }}</p>
        </mat-card>

        <!-- Amenities -->
        <mat-card class="amenities-card" *ngIf="property.amenities && property.amenities.length > 0">
          <h2>Amenities</h2>
          <mat-divider></mat-divider>
          <div class="amenities-list">
            <div class="amenity-item" *ngFor="let amenity of property.amenities">
              <mat-icon color="primary">check_circle</mat-icon>
              <span>{{ amenity.name }}</span>
            </div>
          </div>
        </mat-card>

        <!-- Booking Action -->
        <mat-card class="action-card" *ngIf="property.is_available">
          <div class="action-content">
            <div class="action-info">
              <h3>Interested in this property?</h3>
              <p>Submit a booking request to the property owner.</p>
            </div>
            <button mat-raised-button color="primary" 
                    [routerLink]="['/tenant/properties', property.id, 'book']"
                    class="book-button">
              <mat-icon>event_available</mat-icon>
              Request Booking
            </button>
          </div>
        </mat-card>
      </div>

      <!-- Error State -->
      <div class="error-container" *ngIf="!loading && !property">
        <mat-icon color="warn">error</mat-icon>
        <h2>Property Not Found</h2>
        <p>The property you're looking for doesn't exist or has been removed.</p>
        <button mat-raised-button color="primary" routerLink="/tenant/properties">
          Browse Properties
        </button>
      </div>
    </div>
  `,
  styles: [`
    .property-details-container {
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
      margin-bottom: 16px;
    }
    
    .header-card {
      margin-bottom: 24px;
    }
    
    .property-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 24px;
    }
    
    .header-info h1 {
      margin: 0 0 12px 0;
      font-size: 32px;
      color: #333;
    }
    
    .location {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #666;
      font-size: 16px;
      margin: 0;
    }
    
    .header-price {
      text-align: right;
    }
    
    .rent-amount {
      font-size: 36px;
      font-weight: 700;
      color: #1976d2;
      line-height: 1;
    }
    
    .per-month {
      color: #666;
      margin-top: 4px;
    }
    
    .images-card {
      margin-bottom: 24px;
    }
    
    .main-image {
      width: 100%;
      height: 500px;
      object-fit: cover;
      border-radius: 8px;
    }
    
    .details-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
      margin-bottom: 24px;
    }
    
    .info-card h2 {
      margin: 0 0 16px 0;
      font-size: 20px;
      color: #333;
    }
    
    .info-list {
      margin-top: 16px;
    }
    
    .info-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 1px solid #eee;
    }
    
    .info-item:last-child {
      border-bottom: none;
    }
    
    .info-item mat-icon {
      color: #1976d2;
    }
    
    .info-item .label {
      color: #666;
      min-width: 120px;
    }
    
    .info-item .value {
      font-weight: 500;
      color: #333;
    }
    
    .availability-status {
      margin-top: 16px;
    }
    
    .availability-text {
      margin-top: 16px;
      color: #666;
      line-height: 1.6;
    }
    
    .description-card,
    .amenities-card,
    .action-card {
      margin-bottom: 24px;
    }
    
    .description-card h2,
    .amenities-card h2 {
      margin: 0 0 16px 0;
      font-size: 20px;
      color: #333;
    }
    
    .description-text {
      margin-top: 16px;
      color: #666;
      line-height: 1.8;
      white-space: pre-line;
    }
    
    .amenities-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
      margin-top: 16px;
    }
    
    .amenity-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .amenity-item mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
    
    .action-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    
    .action-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 24px;
    }
    
    .action-info h3 {
      margin: 0 0 8px 0;
      color: white;
    }
    
    .action-info p {
      margin: 0;
      opacity: 0.9;
    }
    
    .book-button {
      flex-shrink: 0;
    }
    
    @media (max-width: 768px) {
      .property-header {
        flex-direction: column;
      }
      
      .header-price {
        text-align: left;
      }
      
      .main-image {
        height: 300px;
      }
      
      .action-content {
        flex-direction: column;
        text-align: center;
      }
      
      .book-button {
        width: 100%;
      }
    }
  `]
})
export class TenantPropertyDetailsComponent implements OnInit {
  property: Property | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private propertyService: PropertyService
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

  getImageUrl(imagePath?: string): string {
    if (!imagePath) {
      return '/assets/images/placeholder.svg';
    }
    const baseUrl = environment.apiUrl.replace('/api', '');

    const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    return `${baseUrl}/${cleanPath}`;
  }
}
