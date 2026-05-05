import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { PropertyService } from '../../../../services/property.service';
import { AmenityService } from '../../../../services/amenity.service';
import { Property, PropertySearchFilters, Amenity } from '../../../../models/property.model';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-tenant-property-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatExpansionModule
  ],
  template: `
    <div class="property-list-container">
      <header class="page-header">
        <h1>Browse Properties</h1>
        <p>Find your perfect rental home</p>
      </header>

      <!-- Filters Section -->
      <mat-expansion-panel class="filters-panel">
        <mat-expansion-panel-header>
          <mat-panel-title>
            <mat-icon>filter_list</mat-icon>
            Search Filters
          </mat-panel-title>
        </mat-expansion-panel-header>

        <div class="filters-content">
          <div class="filters-row">
            <mat-form-field appearance="outline">
              <mat-label>City</mat-label>
              <input matInput [(ngModel)]="filters.city" placeholder="e.g., New York">
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Property Type</mat-label>
              <mat-select [(ngModel)]="filters.property_type">
                <mat-option value="">All Types</mat-option>
                <mat-option value="apartment">Apartment</mat-option>
                <mat-option value="house">House</mat-option>
                <mat-option value="condo">Condo</mat-option>
                <mat-option value="studio">Studio</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Bedrooms</mat-label>
              <mat-select [(ngModel)]="filters.bedrooms">
                <mat-option [value]="undefined">Any</mat-option>
                <mat-option [value]="1">1+</mat-option>
                <mat-option [value]="2">2+</mat-option>
                <mat-option [value]="3">3+</mat-option>
                <mat-option [value]="4">4+</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <div class="filters-row">
            <mat-form-field appearance="outline">
              <mat-label>Min Rent</mat-label>
              <input matInput type="number" [(ngModel)]="filters.minRent" placeholder="Min">
              <span matPrefix>$&nbsp;</span>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Max Rent</mat-label>
              <input matInput type="number" [(ngModel)]="filters.maxRent" placeholder="Max">
              <span matPrefix>$&nbsp;</span>
            </mat-form-field>
          </div>

          <div class="amenities-section" *ngIf="amenities.length > 0">
            <h4>Amenities</h4>
            <div class="amenities-grid">
              <mat-checkbox 
                *ngFor="let amenity of amenities"
                [checked]="filters.amenities?.includes(amenity.id!)"
                (change)="onAmenityChange(amenity.id!, $event.checked)">
                {{ amenity.name }}
              </mat-checkbox>
            </div>
          </div>

          <div class="filter-actions">
            <button mat-raised-button color="primary" (click)="applyFilters()">
              <mat-icon>search</mat-icon>
              Apply Filters
            </button>
            <button mat-button (click)="clearFilters()">
              <mat-icon>clear</mat-icon>
              Clear
            </button>
          </div>
        </div>
      </mat-expansion-panel>

      <!-- Loading State -->
      <div class="loading-container" *ngIf="loading">
        <mat-spinner></mat-spinner>
        <p>Loading properties...</p>
      </div>

      <!-- Error State -->
      <div class="error-message" *ngIf="error && !loading">
        <mat-icon color="warn">info</mat-icon>
        <p>{{ error }}</p>
      </div>

      <!-- Properties Grid -->
      <div class="properties-grid" *ngIf="!loading && properties.length > 0">
        <mat-card *ngFor="let property of properties" class="property-card">
          <div class="property-image" 
               [style.background-image]="'url(' + getImageUrl(property.images?.[0]) + ')'">
            <mat-chip-set class="property-badges">
              <mat-chip *ngIf="property.is_available" color="accent">Available</mat-chip>
              <mat-chip *ngIf="!property.is_available">Not Available</mat-chip>
            </mat-chip-set>
          </div>
          
          <mat-card-content>
            <h3>{{ property.title }}</h3>
            <p class="location">
              <mat-icon>location_on</mat-icon>
              {{ property.address }}, {{ property.city }}, {{ property.state }}
            </p>
            
            <div class="property-details">
              <span><mat-icon>bed</mat-icon> {{ property.bedrooms }} Beds</span>
              <span><mat-icon>bathroom</mat-icon> {{ property.bathrooms }} Baths</span>
              <span><mat-icon>square_foot</mat-icon> {{ property.area_sqft }} sq ft</span>
            </div>
            
            <p class="rent-price">\${{ property.rent_amount }}/month</p>
            
            <p class="description">{{ property.description | slice:0:120 }}...</p>
          </mat-card-content>
          
          <mat-card-actions>
            <button mat-raised-button color="primary" 
                    [routerLink]="['/tenant/properties', property.id]">
              <mat-icon>visibility</mat-icon>
              View Details
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <!-- Empty State -->
      <div class="empty-state" *ngIf="!loading && properties.length === 0 && !error">
        <mat-icon>search_off</mat-icon>
        <h3>No Properties Found</h3>
        <p>Try adjusting your search filters</p>
      </div>
    </div>
  `,
  styles: [`
    .property-list-container {
      max-width: 1400px;
      margin: 0 auto;
    }
    
    .page-header {
      margin-bottom: 32px;
    }
    
    .page-header h1 {
      margin: 0 0 8px 0;
      font-size: 30px;
      font-weight: 600;
      color: #111827;
      letter-spacing: -0.011em;
    }
    
    .page-header p {
      margin: 0;
      color: #6B7280;
      font-size: 15px;
      line-height: 1.6;
    }
    
    .filters-panel {
      margin-bottom: 32px;
      border-radius: 12px;
      overflow: hidden;
    }
    
    .filters-content {
      padding: 24px;
      background: white;
    }
    
    .filters-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 20px;
      margin-bottom: 20px;
    }
    
    .amenities-section h4 {
      margin: 24px 0 12px 0;
      color: #111827;
      font-size: 15px;
      font-weight: 600;
    }
    
    .amenities-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 12px;
    }
    
    .filter-actions {
      display: flex;
      gap: 12px;
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid #E5E7EB;
    }
    
    .loading-container {
      text-align: center;
      padding: 80px 20px;
    }
    
    .loading-container p {
      margin-top: 20px;
      color: #6B7280;
      font-size: 15px;
    }
    
    .error-message {
      text-align: center;
      padding: 60px 20px;
      color: #EF4444;
      background: #FEE2E2;
      border-radius: 12px;
    }
    
    .error-message mat-icon {
      font-size: 56px;
      width: 56px;
      height: 56px;
      opacity: 0.8;
    }
    
    .error-message p {
      margin-top: 16px;
      font-size: 15px;
    }
    
    .properties-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 24px;
    }
    
    .property-card {
      cursor: pointer;
      transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;
      border-radius: 12px;
    }
    
    .property-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px -4px rgba(37, 99, 235, 0.15), 0 8px 16px -4px rgba(0, 0, 0, 0.08) !important;
    }
    
    .property-image {
      height: 220px;
      background-size: cover;
      background-position: center;
      position: relative;
      border-radius: 12px 12px 0 0;
      background: linear-gradient(135deg, #E5E7EB 0%, #F3F4F6 100%);
    }
    
    .property-badges {
      position: absolute;
      top: 12px;
      right: 12px;
    }
    
    mat-card-content {
      padding: 20px !important;
    }
    
    mat-card-content h3 {
      margin: 0 0 12px 0;
      font-size: 19px;
      font-weight: 600;
      color: #111827;
      line-height: 1.4;
    }
    
    .location {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #6B7280;
      margin-bottom: 16px;
      font-size: 14px;
    }
    
    .location mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #2563EB;
    }
    
    .property-details {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
      flex-wrap: wrap;
    }
    
    .property-details span {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #6B7280;
      font-size: 14px;
      font-weight: 500;
    }
    
    .property-details mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #2563EB;
    }
    
    .rent-price {
      font-size: 24px;
      font-weight: 700;
      color: #2563EB;
      margin: 16px 0;
      letter-spacing: -0.01em;
    }
    
    .description {
      color: #6B7280;
      line-height: 1.7;
      font-size: 14px;
    }
    
    mat-card-actions {
      padding: 16px 20px !important;
      display: flex;
      justify-content: flex-end;
      border-top: 1px solid #F3F4F6;
    }
    
    .empty-state {
      text-align: center;
      padding: 100px 20px;
      color: #6B7280;
    }
    
    .empty-state mat-icon {
      font-size: 80px;
      width: 80px;
      height: 80px;
      margin-bottom: 20px;
      opacity: 0.3;
      color: #9CA3AF;
    }
    
    .empty-state h3 {
      margin: 0 0 8px 0;
      font-size: 20px;
      font-weight: 600;
      color: #111827;
    }
    
    .empty-state p {
      margin: 0;
      font-size: 15px;
    }
    
    @media (max-width: 768px) {
      .properties-grid {
        grid-template-columns: 1fr;
      }
      
      .filters-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class TenantPropertyListComponent implements OnInit {
  properties: Property[] = [];
  amenities: Amenity[] = [];
  loading = true;
  error = '';

  filters: PropertySearchFilters = {
    city: '',
    minRent: undefined,
    maxRent: undefined,
    property_type: '',
    bedrooms: undefined,
    amenities: []
  };

  constructor(
    private propertyService: PropertyService,
    private amenityService: AmenityService
  ) {}

  ngOnInit() {
    this.loadProperties();
    this.loadAmenities();
  }

  loadProperties() {
    this.loading = true;
    this.error = '';
    this.propertyService.getAll().subscribe({
      next: (response: any) => {
        this.properties = response.properties;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading properties:', error);
        this.error = 'Failed to load properties. Please try again later.';
        this.loading = false;
      }
    });
  }

  loadAmenities() {
    this.amenityService.getAll().subscribe({
      next: (response: any) => {
        this.amenities = response.amenities;
      },
      error: (error: any) => {
        console.error('Error loading amenities:', error);
      }
    });
  }

  onAmenityChange(amenityId: number, checked: boolean) {
    if (checked) {
      this.filters.amenities?.push(amenityId);
    } else {
      this.filters.amenities = this.filters.amenities?.filter(id => id !== amenityId);
    }
  }

  applyFilters() {
    this.loadProperties();
  }

  clearFilters() {
    this.filters = {
      city: '',
      minRent: undefined,
      maxRent: undefined,
      property_type: '',
      bedrooms: undefined,
      amenities: []
    };
    this.loadProperties();
  }

  getImageUrl(imagePath?: string): string {
    if (!imagePath) {
      return '/assets/images/placeholder.svg';
    }
    const baseUrl = environment.apiUrl.replace('/api', '');
    // Remove leading slash if present to avoid double slashes
    const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    return `${baseUrl}/${cleanPath}`;
  }
}
