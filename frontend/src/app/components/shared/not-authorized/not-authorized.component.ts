import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-not-authorized',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="not-authorized-container">
      <mat-card class="not-authorized-card">
        <mat-card-header>
          <mat-icon color="warn" class="large-icon">block</mat-icon>
        </mat-card-header>
        <mat-card-content>
          <h1>Access Denied</h1>
          <p>You do not have permission to access this page.</p>
          <p class="hint">Please log in with the appropriate account type.</p>
        </mat-card-content>
        <mat-card-actions>
          <button mat-raised-button color="primary" (click)="goHome()">
            <mat-icon>home</mat-icon>
            Go to Home
          </button>
          <button mat-button (click)="logout()">
            <mat-icon>logout</mat-icon>
            Logout
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .not-authorized-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }
    
    .not-authorized-card {
      max-width: 500px;
      width: 100%;
      text-align: center;
      padding: 40px 20px;
    }
    
    .large-icon {
      font-size: 80px;
      width: 80px;
      height: 80px;
      margin: 0 auto 20px;
    }
    
    h1 {
      color: #333;
      margin: 20px 0;
      font-size: 28px;
    }
    
    p {
      color: #666;
      margin: 10px 0;
      font-size: 16px;
    }
    
    .hint {
      font-style: italic;
      font-size: 14px;
    }
    
    mat-card-actions {
      margin-top: 30px;
      display: flex;
      gap: 10px;
      justify-content: center;
    }
    
    button {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `]
})
export class NotAuthorizedComponent {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  goHome(): void {
    const user = this.authService.currentUserValue;
    if (user?.role === 'tenant') {
      this.router.navigate(['/tenant']);
    } else if (user?.role === 'owner') {
      this.router.navigate(['/owner']);
    } else {
      this.router.navigate(['/']);
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
