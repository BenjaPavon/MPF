import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { ReactiveFormsModule, FormBuilder, Validators, FormArray } from '@angular/forms';
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
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phones: this.fb.array([
      this.fb.control('', Validators.required)
    ])
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

    const phones = this.phones.controls
      .map(c => String(c.value ?? '').trim())
      .filter(p => p.length > 0);

    this.userService.add({ name, email, phones }).subscribe({
      next: () => {
        this.createForm.reset();
        // dejar 1 input de teléfono “vacío” para el próximo alta
        this.createForm.setControl('phones', this.fb.array([this.fb.control('', Validators.required)]));
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

  get phones(): FormArray {
    return this.createForm.get('phones') as FormArray;
  }

  addPhone(): void {
    this.phones.push(
      this.fb.control('', Validators.required)
    );
  }

  removePhone(index: number): void {
    this.phones.removeAt(index);
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
