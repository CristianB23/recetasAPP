import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../services/local-storage.service';
import { Receta } from '../models/receta.model';
import { ToastController } from '@ionic/angular'; // Agrega esta línea para importar el ToastController

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
})
export class FavoritosPage implements OnInit {
  favoritos: Receta[] = [];
  isLoggedIn: boolean = false;
  username: string = '';
  listaVacia: boolean = false;
  eliminadoExitoso: boolean = false;

  constructor(
    private localStorageService: LocalStorageService,
    private toastController: ToastController // Agrega esta línea para inyectar el ToastController
  ) {}

  ngOnInit() {
    this.isLoggedIn = this.localStorageService.get('isLoggedIn') === 'true';
    this.username = this.localStorageService.get('username') || '';
    console.log('Username:', this.username);
    console.log('IsLoggedIn:', this.isLoggedIn);
    this.cargarFavoritos();
  }

  cargarFavoritos() {
    const favoritosPorUsuario = this.localStorageService.get(this.username + '_favoritos') || [];
    this.favoritos = [...favoritosPorUsuario];
    this.listaVacia = this.favoritos.length === 0;
    console.log(this.favoritos);
  }

  eliminarFavorito(receta: Receta) {
    
    const favoritosPorUsuario = this.localStorageService.get(this.username + '_favoritos') || [];
    const index = favoritosPorUsuario.findIndex((favorito: Receta) => favorito.idMeal === receta.idMeal);
    if (index > -1) {
      favoritosPorUsuario.splice(index, 1);
      this.localStorageService.set(this.username + '_favoritos', favoritosPorUsuario);
      this.cargarFavoritos();
      this.mostrarEliminadoExitoso('Receta eliminada con éxito', 'success');
    }
  }

  async mostrarEliminadoExitoso(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      color: color,
      duration: 2000
    });
    toast.present();
  }
}

