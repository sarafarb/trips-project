import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { map, switchMap, of, tap } from 'rxjs';
import { User } from '../models/user.model';
import { UsersService } from './users';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private usersService = inject(UsersService);
  private storageKey = 'trips-app-current-user';

  private currentUserSignal = signal<User | null>(null);

  currentUser = this.currentUserSignal.asReadonly();

  isLoggedIn = computed(() => this.currentUserSignal() !== null);

  private initCurrentUser = effect(() => {
    if (typeof window === 'undefined' || !window.localStorage) return;

    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return;

    try {
      this.currentUserSignal.set(JSON.parse(raw));
    } catch {
      localStorage.removeItem(this.storageKey);
    }
  });

  private setCurrentUser(user: User | null) {
    this.currentUserSignal.set(user);
    if (typeof window === 'undefined' || !window.localStorage) return;

    if (user) {
      localStorage.setItem(this.storageKey, JSON.stringify(user));
    } else {
      localStorage.removeItem(this.storageKey);
    }
  }

  // LOGIN
  login(name: string, password: string) {
    return this.usersService.getUsers().pipe(
      map(users => {
        const user = users.find(
          u => u.name === name && u.password === password
        );

        if (user) {
          this.setCurrentUser(user);
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
              tap(user => this.setCurrentUser(user))
            );
          })
        );
      })
    );
  }

  // LOGOUT
  logout() {
    this.setCurrentUser(null);
  }

  // GET CURRENT USER
  getCurrentUser() {
    return this.currentUserSignal();
  }
}