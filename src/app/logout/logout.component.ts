import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../services/local-storage.service';

@Component({
  selector: 'app-logout',
  template: '',
})
export class LogoutComponent {
  constructor(private router: Router, private localStorageService: LocalStorageService) {
    this.logout();
  }

  logout(): void {
    // Realiza las acciones necesarias para cerrar sesión
    this.localStorageService.remove('isLoggedIn');
    this.localStorageService.remove('username');
    // Redirige al usuario a la página de inicio de sesión
    this.router.navigate(['/']);
  }
}
