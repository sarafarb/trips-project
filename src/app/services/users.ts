import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/users';

  // 👥 get all users
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  // 👤 get by id
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  // 🔎 search by name (login helper)
  getUserByName(name: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}?name=${name}`);
  }

  // 🧮 get last id
  getLastUserId(): Observable<number> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      map(users => {
        if (!users.length) return 0;
        return Math.max(...users.map(u => Number(u.id || 0)));
      })
    );
  }

  // ➕ create user
  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  // ✏️ update user
  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  // 🗑 delete user
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}