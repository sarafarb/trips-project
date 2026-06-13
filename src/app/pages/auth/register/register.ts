import { Component, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  private authService = inject(AuthService);
  private router = inject(Router);

  name = signal('');
  password = signal('');
  confirmPassword = signal('');
  error = signal('');

  passwordsMatch = computed(() =>
    this.password() === this.confirmPassword()
  );

  onRegister() {
  this.error.set('');

  if (!this.name() || !this.password()) {
    this.error.set('יש למלא את כל השדות');
    return;
  }

  if (!this.passwordsMatch()) {
    this.error.set('הסיסמאות לא תואמות');
    return;
  }

  this.authService.register(this.name(), this.password())
    .subscribe({
      next: (user) => {
        if (!user) {
          this.error.set('שם משתמש כבר קיים');
          return;
        }
        this.router.navigateByUrl('/home');
      },
      error: (err) => {
        console.error('Registration error:', err);
        this.error.set('התרחשה שגיאת תקשורת עם השרת. בדקו את הקונסול.');
      }
    });
}
}