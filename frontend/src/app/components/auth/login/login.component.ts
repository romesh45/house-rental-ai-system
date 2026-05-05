import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  credentials = { email: '', password: '' };
  error = '';
  loading = false;
  returnUrl: string = '/';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // If user is already logged in with a valid session, redirect
    if (this.authService.isLoggedIn) {
      const user = this.authService.currentUserValue;
      if (user?.role === 'owner') {
        this.router.navigate(['/owner']);
      } else if (user?.role === 'tenant') {
        this.router.navigate(['/tenant']);
      }
      return;
    }

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit() {
    if (!this.credentials.email || !this.credentials.password) {
      this.error = 'Please fill in all fields';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        const user = response.user;
        
        if (this.returnUrl && this.returnUrl !== '/login' && this.returnUrl !== '/') {
          this.router.navigateByUrl(this.returnUrl);
        } else {
          if (user.role === 'owner') {
            this.router.navigate(['/owner']);
          } else if (user.role === 'tenant') {
            this.router.navigate(['/tenant']);
          } else {
            this.router.navigate(['/']);
          }
        }
      },
      error: (err: any) => {
        this.error = err.error?.message || 'Login failed. Please try again.';
        this.loading = false;
      }
    });
  }
}
