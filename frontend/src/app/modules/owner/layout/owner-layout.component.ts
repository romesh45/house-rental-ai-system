import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-owner-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule
  ],
  template: `
    <div class="owner-layout">
      <mat-toolbar color="primary" class="owner-navbar">
        <span class="logo" routerLink="/owner/dashboard" style="cursor: pointer;">
          <mat-icon>business</mat-icon>
          OHRTMS
        </span>
        
        <span class="spacer"></span>
        
        <nav class="nav-links">
          <button mat-button routerLink="/owner/dashboard" routerLinkActive="active">
            <mat-icon>dashboard</mat-icon>
            Dashboard
          </button>
          
          <button mat-button routerLink="/owner/properties" routerLinkActive="active">
            <mat-icon>apartment</mat-icon>
            My Properties
          </button>
          
          <button mat-button routerLink="/owner/booking-requests" routerLinkActive="active">
            <mat-icon>notifications</mat-icon>
            Booking Requests
          </button>
          
          <button mat-raised-button color="accent" routerLink="/owner/properties/add">
            <mat-icon>add</mat-icon>
            Add Property
          </button>
          
          <button mat-button [matMenuTriggerFor]="userMenu">
            <mat-icon>account_circle</mat-icon>
            {{ currentUser?.full_name }}
          </button>
          
          <mat-menu #userMenu="matMenu">
            <button mat-menu-item routerLink="/profile">
              <mat-icon>person</mat-icon>
              Profile
            </button>
            <button mat-menu-item (click)="logout()">
              <mat-icon>logout</mat-icon>
              Logout
            </button>
          </mat-menu>
        </nav>
      </mat-toolbar>
      
      <main class="content">
        <router-outlet></router-outlet>
      </main>
      
      <footer class="owner-footer">
        <p>&copy; 2025 OHRTMS - Owner Portal. All rights reserved.</p>
      </footer>
    </div>
  `,
  styles: [`
    .owner-layout {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background-color: #F9FAFB;
    }
    
    .owner-navbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06) !important;
      background-color: #10B981 !important;
      height: 64px;
      padding: 0 24px !important;
    }
    
    .logo {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 19px;
      font-weight: 600;
      letter-spacing: -0.01em;
      color: white;
      transition: opacity 200ms;
    }
    
    .logo:hover {
      opacity: 0.9;
    }
    
    .logo mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }
    
    .spacer {
      flex: 1 1 auto;
    }
    
    .nav-links {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    
    .nav-links button {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.9);
      border-radius: 8px;
      padding: 8px 16px;
      min-width: auto;
      height: 40px;
      transition: all 200ms;
    }
    
    .nav-links button mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
    
    .nav-links button:hover {
      background-color: rgba(255, 255, 255, 0.15);
    }
    
    .nav-links button.active {
      background-color: rgba(255, 255, 255, 0.2);
      color: white;
    }
    
    .content {
      flex: 1;
      padding: 32px 24px;
      max-width: 1400px;
      width: 100%;
      margin: 0 auto;
    }
    
    .owner-footer {
      background-color: #111827;
      color: rgba(255, 255, 255, 0.8);
      text-align: center;
      padding: 20px;
      margin-top: auto;
      font-size: 14px;
      letter-spacing: 0.01em;
    }
    
    @media (max-width: 968px) {
      .owner-navbar {
        padding: 0 16px !important;
      }
      
      .logo {
        font-size: 17px;
      }
      
      .nav-links {
        gap: 2px;
      }
      
      .nav-links button {
        padding: 8px 12px;
      }
      
      .nav-links button span:not(.mat-icon) {
        display: none;
      }
      
      .content {
        padding: 24px 16px;
      }
    }
  `]
})
export class OwnerLayoutComponent {
  currentUser: any;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser = this.authService.currentUserValue;
  }

  logout(): void {
    this.authService.logout();
  }
}
