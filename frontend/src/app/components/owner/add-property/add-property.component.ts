import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PropertyService } from '../../../services/property.service';
import { AmenityService } from '../../../services/amenity.service';
import { Amenity } from '../../../models/property.model';

@Component({
  selector: 'app-add-property',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container" style="padding: 2rem 0; max-width: 800px;">
      <h1>Add New Property</h1>
      
      @if (error) {
        <div class="alert alert-error">{{ error }}</div>
      }

      <form (ngSubmit)="onSubmit()" class="card" style="padding: 2rem; margin-top: 2rem;">
        <div class="form-group">
          <label class="form-label">Property Title *</label>
          <input type="text" class="form-control" [(ngModel)]="propertyData.title" name="title" required />
        </div>

        <div class="row">
          <div class="col-6 form-group">
            <label class="form-label">Property Type *</label>
            <select class="form-select" [(ngModel)]="propertyData.property_type" name="type" required>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="villa">Villa</option>
              <option value="studio">Studio</option>
              <option value="penthouse">Penthouse</option>
            </select>
          </div>
          <div class="col-6 form-group">
            <label class="form-label">Rent Amount (₹) *</label>
            <input type="number" class="form-control" [(ngModel)]="propertyData.rent_amount" name="rent" required />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Description</label>
          <textarea class="form-control" [(ngModel)]="propertyData.description" name="description" rows="3"></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Address *</label>
          <input type="text" class="form-control" [(ngModel)]="propertyData.address" name="address" required />
        </div>

        <div class="row">
          <div class="col-4 form-group">
            <label class="form-label">City *</label>
            <input type="text" class="form-control" [(ngModel)]="propertyData.city" name="city" required />
          </div>
          <div class="col-4 form-group">
            <label class="form-label">State *</label>
            <input type="text" class="form-control" [(ngModel)]="propertyData.state" name="state" required />
          </div>
          <div class="col-4 form-group">
            <label class="form-label">Pincode *</label>
            <input type="text" class="form-control" [(ngModel)]="propertyData.pincode" name="pincode" required />
          </div>
        </div>

        <div class="row">
          <div class="col-4 form-group">
            <label class="form-label">Bedrooms *</label>
            <input type="number" class="form-control" [(ngModel)]="propertyData.bedrooms" name="bedrooms" required />
          </div>
          <div class="col-4 form-group">
            <label class="form-label">Bathrooms *</label>
            <input type="number" class="form-control" [(ngModel)]="propertyData.bathrooms" name="bathrooms" required />
          </div>
          <div class="col-4 form-group">
            <label class="form-label">Area (sqft)</label>
            <input type="number" class="form-control" [(ngModel)]="propertyData.area_sqft" name="area" />
          </div>
        </div>

        @if (amenities.length > 0) {
          <div class="form-group">
            <label class="form-label">Amenities</label>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 0.5rem;">
              @for (amenity of amenities; track amenity.id) {
                <label style="display: flex; align-items: center; gap: 0.5rem;">
                  <input type="checkbox" [checked]="propertyData.amenities.includes(amenity.id)"
                    (change)="toggleAmenity(amenity.id, $any($event.target).checked)" />
                  {{ amenity.name }}
                </label>
              }
            </div>
          </div>
        }

        <div class="form-group">
          <label class="form-label">Property Images</label>
          <input type="file" class="form-control" accept="image/*" multiple 
                 (change)="onImageSelect($event)" style="padding: 0.5rem;" />
          <small style="color: #666;">Select multiple images (JPEG, PNG, GIF, WebP - max 5MB each)</small>
          
          @if (selectedImages.length > 0) {
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 1rem; margin-top: 1rem;">
              @for (img of selectedImages; track $index) {
                <div style="position: relative; border: 2px solid #ddd; border-radius: 8px; padding: 0.5rem;">
                  <img [src]="img.preview" style="width: 100%; height: 100px; object-fit: cover; border-radius: 4px;" />
                  <button type="button" (click)="removeImage($index)" 
                          style="position: absolute; top: 0.25rem; right: 0.25rem; background: red; color: white; border: none; border-radius: 50%; width: 24px; height: 24px; cursor: pointer; font-size: 16px; line-height: 1;">
                    ×
                  </button>
                  <small style="display: block; margin-top: 0.25rem; font-size: 11px; color: #666;">{{ img.file.name }}</small>
                </div>
              }
            </div>
          }
        </div>

        <div style="display: flex; gap: 1rem; margin-top: 2rem;">
          <button type="submit" class="btn btn-primary" [disabled]="loading">
            {{ loading ? 'Adding...' : 'Add Property' }}
          </button>
          <button type="button" class="btn btn-outline" (click)="goBack()">Cancel</button>
        </div>
      </form>
    </div>
  `
})
export class AddPropertyComponent implements OnInit {
  propertyData: any = {
    title: '', property_type: 'apartment', description: '', address: '', city: '', state: '',
    pincode: '', rent_amount: 0, bedrooms: 1, bathrooms: 1, area_sqft: 0, amenities: []
  };
  amenities: Amenity[] = [];
  selectedImages: Array<{ file: File; preview: string }> = [];
  loading = false;
  error = '';

  constructor(
    private propertyService: PropertyService,
    private amenityService: AmenityService,
    private router: Router
  ) {}

  ngOnInit() {
    this.amenityService.getAll().subscribe({
      next: (response: any) => { this.amenities = response.amenities; },
      error: () => {}
    });
  }

  toggleAmenity(id: number, checked: boolean) {
    if (checked) { this.propertyData.amenities.push(id); }
    else { this.propertyData.amenities = this.propertyData.amenities.filter((aid: number) => aid !== id); }
  }

  onImageSelect(event: any) {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.match(/image\/(jpeg|jpg|png|gif|webp)/)) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.selectedImages.push({ file, preview: e.target.result });
          };
          reader.readAsDataURL(file);
        }
      }
    }
  }

  removeImage(index: number) {
    this.selectedImages.splice(index, 1);
  }

  onSubmit() {
    this.loading = true;
    this.error = '';

    const formData = new FormData();
    
    // Append property data
    Object.keys(this.propertyData).forEach(key => {
      if (key === 'amenities') {
        formData.append(key, JSON.stringify(this.propertyData[key]));
      } else {
        formData.append(key, this.propertyData[key]);
      }
    });

    // Append images
    this.selectedImages.forEach((img, index) => {
      formData.append('images', img.file);
    });

    this.propertyService.createWithImages(formData).subscribe({
      next: () => { this.router.navigate(['/owner/properties']); },
      error: (err: any) => { 
        this.error = err.error?.message || 'Failed to add property'; 
        this.loading = false; 
      }
    });
  }

  goBack() { this.router.navigate(['/owner/properties']); }
}
