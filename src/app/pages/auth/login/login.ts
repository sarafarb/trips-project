import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  private authService = inject(AuthService);
  private router = inject(Router);

  name = signal('');
  password = signal('');
  error = signal('');

  onLogin() {
  
  this.error.set('');

  if (!this.name() || !this.password()) {
    this.error.set('יש למלא את כל השדות');
    return;
  }

  this.authService.login(this.name(), this.password())
    .subscribe({
      next: (user) => {
        if (!user) {
          this.error.set('שם משתמש או סיסמא לא תקינים');
          return;
        }
        this.router.navigateByUrl('/home');
      },
      error: (err) => {
        console.error('Login error:', err);
        this.error.set('התרחשה שגיאת תקשורת עם השרת. בדקו את הקונסול.');
      }
    
    });
}
}