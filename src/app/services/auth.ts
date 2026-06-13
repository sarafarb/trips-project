import { Injectable, inject, signal, computed } from '@angular/core';
import { map, switchMap, of, tap } from 'rxjs';
import { User } from '../models/user.model';
import { UsersService } from './users';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private usersService = inject(UsersService);

  private currentUserSignal = signal<User | null>(null);

  currentUser = this.currentUserSignal.asReadonly();

  isLoggedIn = computed(() => this.currentUserSignal() !== null);

  // LOGIN
  login(name: string, password: string) {
    return this.usersService.getUsers().pipe(
      map(users => {
        const user = users.find(
          u => u.name === name && u.password === password
        );

        if (user) {
          this.currentUserSignal.set(user);
        }

        return user || null;
      })
    );
  }

  // REGISTER
  register(name: string, password: string) {
    return this.usersService.getUserByName(name).pipe(
      switchMap(existing => {
        if (existing.length > 0) {
          return of(null);
        }

        return this.usersService.getLastUserId().pipe(
          switchMap(lastId => {
            const newUser: User = {
              id: lastId + 1,
              name,
              password,
              isAdmin: false
            };

            return this.usersService.createUser(newUser).pipe(
              tap(user => this.currentUserSignal.set(user))
            );
          })
        );
      })
    );
  }

  // LOGOUT
  logout() {
    this.currentUserSignal.set(null);
  }

  // GET CURRENT USER
  getCurrentUser() {
    return this.currentUserSignal();
  }
}