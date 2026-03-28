import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {

  login = '';
  mdp = '';
  erreur = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.erreur = '';
    this.loading = true;

    this.authService.login(this.login, this.mdp).subscribe({
      next: (user) => {
  this.authService.saveUser(user);
  this.loading = false;
  if (user.role === 'comptable') {
    this.router.navigate(['/dashboard-comptable']);
  } else {
    this.router.navigate(['/dashboard']);
  }
},
      error: () => {
        this.erreur = 'Login ou mot de passe incorrect';
        this.loading = false;
      }
    });
  }
}