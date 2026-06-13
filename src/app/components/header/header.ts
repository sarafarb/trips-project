import { Component, inject, computed, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {

  private authService = inject(AuthService);
  private router = inject(Router);

currentUser = this.authService.currentUser;
  
isLoggedIn = this.authService.isLoggedIn;
  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}