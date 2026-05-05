import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerData = {
    email: '',
    password: '',
    full_name: '',
    phone: '',
    role: 'tenant' as 'tenant' | 'owner'
  };
  error = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // If user is already logged in, redirect to appropriate page
    if (this.authService.isLoggedIn) {
      const user = this.authService.currentUserValue;
      if (user?.role === 'owner') {
        this.router.navigate(['/owner']);
      } else if (user?.role === 'tenant') {
        this.router.navigate(['/tenant']);
      }
    }
  }

  onSubmit() {
    if (!this.registerData.email || !this.registerData.password || !this.registerData.full_name) {
      this.error = 'Please fill in all required fields';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.register(this.registerData).subscribe({
      next: (response) => {
        const user = response.user;
        if (user.role === 'owner') {
          this.router.navigate(['/owner']);
        } else if (user.role === 'tenant') {
          this.router.navigate(['/tenant']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err: any) => {
        this.error = err.error?.message || 'Registration failed. Please try again.';
        this.loading = false;
      }
    });
  }
}
