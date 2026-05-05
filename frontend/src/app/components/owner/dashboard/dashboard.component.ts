import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <div class="container">
        <h1>Owner Dashboard</h1>
        <div class="dashboard-grid">
          <div class="stat-card">
            <span class="material-icons">home</span>
            <h3>My Properties</h3>
            <p>Manage your listings</p>
            <a routerLink="/owner/properties" class="btn btn-primary">View Properties</a>
          </div>
          <div class="stat-card">
            <span class="material-icons">calendar_today</span>
            <h3>Booking Requests</h3>
            <p>Handle tenant requests</p>
            <a routerLink="/owner/bookings" class="btn btn-primary">View Bookings</a>
          </div>
          <div class="stat-card">
            <span class="material-icons">add_circle</span>
            <h3>Add Property</h3>
            <p>List a new property</p>
            <a routerLink="/owner/properties/add" class="btn btn-primary">Add New</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container { padding: 2rem 0; min-height: calc(100vh - 140px); }
    .dashboard-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-top: 2rem; }
    .stat-card { background: var(--bg-primary); padding: 2rem; border-radius: var(--radius-lg); box-shadow: var(--shadow-md); text-align: center; }
    .stat-card .material-icons { font-size: 4rem; color: var(--primary-color); margin-bottom: 1rem; }
    .stat-card h3 { margin-bottom: 0.5rem; }
    .stat-card p { color: var(--text-secondary); margin-bottom: 1.5rem; }
  `]
})
export class DashboardComponent {}
