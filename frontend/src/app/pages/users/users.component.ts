import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router'; 

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);

  users: User[] = [];
  loading = false;
  error: string | null = null;

  newName = '';
  newEmail = '';

  editingId: number | null = null;
  editName = '';
  editEmail = '';
  
  createForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@mpf\.gob\.ar$/)]],
  });

  constructor() { }
  
  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = null;

    this.userService.getAll().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudo cargar la lista de usuarios.';
        this.loading = false;
      },
    });
  }

  addUser(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    const name = this.createForm.value.name!.trim();
    const email = this.createForm.value.email!.trim();

    this.userService.add({ name, email }).subscribe({
      next: () => {
        this.createForm.reset();
        this.loadUsers();
      },
      error: () => (this.error = 'No se pudo agregar el usuario.'),
    });
  }

  // ✅ Iniciar edición
  startEdit(u: User): void {
    this.editingId = u.id;
    this.editName = u.name;
    this.editEmail = u.email;
    this.error = null;
  }

  // ✅ Cancelar
  cancelEdit(): void {
    this.editingId = null;
    this.editName = '';
    this.editEmail = '';
  }

  // ✅ Guardar edición
  saveEdit(u: User): void {
    const name = this.editName.trim();
    const email = this.editEmail.trim();
    if (!name || !email) return;

    const updated: User = { ...u, name, email };

    this.userService.update(updated).subscribe({
      next: () => {
        this.cancelEdit();
        this.loadUsers();
      },
      error: () => (this.error = 'No se pudo actualizar el usuario.'),
    });
  }

  // ✅ Eliminar
  deleteUser(u: User): void {
    const ok = confirm(`¿Eliminar a ${u.name}?`);
    if (!ok) return;

    this.userService.remove(u.id).subscribe({
      next: () => this.loadUsers(),
      error: () => (this.error = 'No se pudo eliminar el usuario.'),
    });
  }
}
