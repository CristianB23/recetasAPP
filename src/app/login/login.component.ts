import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../services/local-storage.service';
import { ToastController } from '@ionic/angular';
import { Location } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  users: any[] = [
    { username: 'admin', password: 'cris123' },
    { username: 'cristian', password: 'basoalto123' },
    { username: 'profesor', password: 'pro123' }
  ];

  constructor(
    private router: Router,
    private localStorageService: LocalStorageService,
    private toastController: ToastController,
    private location: Location
  ) {}

  async login(): Promise<void> {
    // Verificar las credenciales ingresadas
    const user = this.users.find(u => u.username === this.username && u.password === this.password);
    if (user) {
      // Autenticación exitosa
      this.localStorageService.set('isLoggedIn', 'true');
      this.localStorageService.set('username', user.username);
      this.successMessage = 'Ahora puedes agregar recetas'; 
      this.mostrarMensaje(this.successMessage, 'success'); 
      setTimeout(() => {
        this.location.go('/home');
        window.location.reload();
      }, 3000);
    } else {
      // Credenciales inválidas
      this.errorMessage = 'Contraseña o Usuario incorrecto';
    }
  }
  
  async mostrarMensaje(mensaje: string, color: string): Promise<void> {
    const toast = await this.toastController.create({
      message: mensaje,
      color: color,
      duration: 2000 
    });
    toast.present();
  }
}
