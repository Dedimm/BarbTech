import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tela-login-usuario',
  standalone: false,
  templateUrl: './tela-login-usuario.html',
  styleUrl: './tela-login-usuario.css',
})
export class TelaLoginUsuario {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        if (res && res.is_barbeiro === false) {
          this.router.navigate(['/home-page']);
        } else {
          this.authService.logout();
          this.errorMessage = 'Use o login de profissional.';
        }
      },
      error: (err) => {
        this.errorMessage = 'Credenciais inválidas';
      }
    });
  }
}
