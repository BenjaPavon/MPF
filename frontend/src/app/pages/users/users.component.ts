import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  imports: [CommonModule, FormsModule],
})
export class UsersComponent implements OnInit {
  users: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.users = this.userService.getAll();
  }
  newName = '';
newEmail = '';

addUser() {
  const nextId = (this.users.at(-1)?.id ?? 0) + 1;
  const user = { id: nextId, name: this.newName, email: this.newEmail };
  this.userService.add(user);
  this.users = this.userService.getAll();
  this.newName = '';
  this.newEmail = '';
}

}
