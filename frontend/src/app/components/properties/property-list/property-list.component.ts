import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PropertyService } from '../../../services/property.service';
import { AmenityService } from '../../../services/amenity.service';
import { Property, PropertySearchFilters, Amenity } from '../../../models/property.model';

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.css']
})
export class PropertyListComponent implements OnInit {
  properties: Property[] = [];
  amenities: Amenity[] = [];
  loading = true;
  error = '';
  showFilters = false;

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
        if (this.properties.length === 0) {
          this.error = 'No properties found matching your filters. Try adjusting your search criteria.';
        }
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
    this.showFilters = false;
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

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }
}
