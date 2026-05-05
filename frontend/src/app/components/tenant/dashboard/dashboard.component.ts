import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tenant-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container" style="padding: 2rem 0;">
      <h1>Tenant Dashboard</h1>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-top: 2rem;">
        <div class="card" style="padding: 2rem; text-align: center;">
          <span class="material-icons" style="font-size: 4rem; color: var(--primary-color);">home</span>
          <h3>Browse Properties</h3>
          <a routerLink="/properties" class="btn btn-primary" style="margin-top: 1rem;">View Properties</a>
        </div>
        <div class="card" style="padding: 2rem; text-align: center;">
          <span class="material-icons" style="font-size: 4rem; color: var(--primary-color);">calendar_today</span>
          <h3>My Bookings</h3>
          <a routerLink="/tenant/bookings" class="btn btn-primary" style="margin-top: 1rem;">View Bookings</a>
        </div>
      </div>
    </div>
  `
})
export class TenantDashboardComponent {}
