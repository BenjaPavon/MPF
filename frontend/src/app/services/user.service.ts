import { Injectable } from '@angular/core';
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class UserService {
  private users: User[] = [
    { id: 1, name: 'Benja', email: 'benja@mail.com' },
    { id: 2, name: 'Ana', email: 'ana@mail.com' },
  ];

  getAll(): User[] {
    return this.users;
  }

  add(user: User) {
    this.users = [...this.users, user];
  }
}