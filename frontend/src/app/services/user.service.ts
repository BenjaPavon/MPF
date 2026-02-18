import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private baseUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }

  add(user: Omit<User, 'id'>) {
    return this.http.post<User>(this.baseUrl, user);
  }

  update(user: User): Observable<User> {
    // json-server soporta PUT /users/:id
    return this.http.put<User>(`${this.baseUrl}/${user.id}`, user);
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }
  
  remove(id: number): Observable<void> {
    // json-server soporta DELETE /users/:id
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

}