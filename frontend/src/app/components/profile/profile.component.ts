import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/auth.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container" style="padding: 2rem 0; max-width: 600px;">
      <h1>My Profile</h1>
      
      @if (user) {
        <div class="card" style="padding: 2rem; margin-top: 2rem;">
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input type="text" class="form-control" [(ngModel)]="user.full_name" />
          </div>

          <div class="form-group">
            <label class="form-label">Email</label>
            <input type="email" class="form-control" [value]="user.email" disabled />
          </div>

          <div class="form-group">
            <label class="form-label">Phone</label>
            <input type="tel" class="form-control" [(ngModel)]="user.phone" />
          </div>

          <div class="form-group">
            <label class="form-label">Role</label>
            <input type="text" class="form-control" [value]="user.role" disabled />
          </div>

          <button class="btn btn-primary" (click)="updateProfile()">Update Profile</button>
        </div>
      }
    </div>
  `
})
export class ProfileComponent implements OnInit {
  user: User | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.user = this.authService.currentUserValue;
  }

  updateProfile() {
    if (this.user) {
      this.authService.updateProfile({
        full_name: this.user.full_name,
        phone: this.user.phone
      }).subscribe({
        next: () => { alert('Profile updated successfully!'); },
        error: () => { alert('Failed to update profile'); }
      });
    }
  }
}
