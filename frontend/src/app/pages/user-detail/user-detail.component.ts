import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-detail.component.html',
})
export class UserDetailComponent implements OnInit {
  user: User | null = null;
  loading = false;
  error: string | null = null;

  constructor(private route: ActivatedRoute, private userService: UserService) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = Number(idParam);

    if (!idParam || Number.isNaN(id)) {
      this.error = 'ID inválido en la URL.';
      return;
    }

    this.loading = true;
    this.userService.getById(id).subscribe({
      next: (u) => {
        this.user = u;
        this.loading = false;
      },
      error: () => {
        this.error = 'Usuario no encontrado o error de servidor.';
        this.loading = false;
      },
    });
  }
}
