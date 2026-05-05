import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PropertyService } from '../../../services/property.service';
import { Property } from '../../../models/property.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-my-properties',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container" style="padding: 2rem 0;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <h1>My Properties</h1>
        <a routerLink="/owner/properties/add" class="btn btn-primary">
          <span class="material-icons">add</span>
          Add Property
        </a>
      </div>

      @if (loading) {
        <div class="loading-container"><div class="spinner"></div></div>
      } @else if (properties.length > 0) {
        <div class="properties-grid">
          @for (property of properties; track property.id) {
            <div class="card">
              <div class="property-image" style="height: 200px; overflow: hidden; background: #f3f4f6;">
                <img 
                  [src]="getImageUrl(property.images?.[0])" 
                  [alt]="property.title"
                  style="width: 100%; height: 100%; object-fit: cover;"
                />
              </div>
              <div style="padding: 1.5rem;">
                <h3>{{ property.title }}</h3>
                <p style="color: var(--text-secondary);">{{ property.city }}, {{ property.state }}</p>
                <p style="font-size: 1.5rem; color: var(--primary-color); font-weight: 700;">
                  ₹{{ property.rent_amount | number }}/month
                </p>
                <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                  <a [routerLink]="['/owner/properties', property.id]" class="btn btn-outline btn-sm">View</a>
                  <a [routerLink]="['/owner/properties/edit', property.id]" class="btn btn-primary btn-sm">Edit</a>
                </div>
              </div>
            </div>
          }
        </div>
      } @else {
        <div style="text-align: center; padding: 4rem;">
          <span class="material-icons" style="font-size: 5rem; color: var(--text-light);">home</span>
          <h3>No Properties Yet</h3>
          <p>Start by adding your first property</p>
          <a routerLink="/owner/properties/add" class="btn btn-primary">Add Property</a>
        </div>
      }
    </div>
  `,
  styles: [`
    .properties-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2rem; }
  `]
})
export class MyPropertiesComponent implements OnInit {
  properties: Property[] = [];
  loading = true;

  constructor(private propertyService: PropertyService) {}

  ngOnInit() {
    this.propertyService.getMyProperties().subscribe({
      next: (response: any) => { this.properties = response.properties; this.loading = false; },
      error: () => { this.loading = false; }
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
