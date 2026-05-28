import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tela-login-profissional',
  standalone: false,
  templateUrl: './tela-login-profissional.html',
  styleUrl: './tela-login-profissional.css',
})
export class TelaLoginProfissional {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        if (res && res.is_barbeiro === true) {
          this.router.navigate(['/home-profissional']);
        } else {
          this.authService.logout();
          this.errorMessage = 'Esta conta não é de profissional.';
        }
      },
      error: (err) => {
        this.errorMessage = 'Credenciais inválidas';
      }
    });
  }
}
