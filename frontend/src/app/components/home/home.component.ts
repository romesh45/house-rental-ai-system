import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PropertyService } from '../../services/property.service';
import { Property } from '../../models/property.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  featuredProperties: Property[] = [];
  loading = true;

  constructor(private propertyService: PropertyService) {}

  ngOnInit() {
    this.loadFeaturedProperties();
  }

  loadFeaturedProperties() {
    this.propertyService.getAll({ limit: 6 } as any).subscribe({
      next: (response: any) => {
        this.featuredProperties = response.properties;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading properties:', error);
        this.loading = false;
      }
    });
  }

  getImageUrl(imagePath?: string): string {
    if (!imagePath) {
      return 'assets/images/no-image.svg';
    }
    const baseUrl = environment.apiUrl.replace('/api', '');
    const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    return `${baseUrl}/${cleanPath}`;
  }
}
