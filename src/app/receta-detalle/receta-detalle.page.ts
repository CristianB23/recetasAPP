import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { RecetasService } from '../services/recetas.service';
import { Receta } from '../models/receta.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LocalStorageService } from '../services/local-storage.service';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-receta-detalle',
  templateUrl: './receta-detalle.page.html',
  styleUrls: ['./receta-detalle.page.scss'],
})
export class RecetaDetallePage implements OnInit {
  receta!: Receta;
  urlVideo?: SafeResourceUrl;
  isLoggedIn: boolean = false;
  username: string = '';


  constructor(
    private activatedRoute: ActivatedRoute,
    private recetasService: RecetasService,
    private sanitizer: DomSanitizer,
    private localStorageService: LocalStorageService,
    private router: Router,
    private toastController: ToastController
  ) {}
  

  ngOnInit() {
    this.isLoggedIn = this.localStorageService.get('isLoggedIn') === 'true';
    this.username = this.localStorageService.get('username') || '';
    this.activatedRoute.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id !== null) {
        this.recetasService.obtenerDetallesReceta(id).subscribe((data: any) => {
          this.receta = data.meals[0];
          this.urlVideo = this.generarUrlVideoEmbed(this.receta.strYoutube);
        });
      }
    });
  }

  getIngredients(): string[] {
    const ingredients: string[] = [];
    for (let i = 1; i <= 20; i++) {
      const ingredientProp = `strIngredient${i}` as keyof Receta;
      if (this.receta[ingredientProp]) {
        ingredients.push(this.receta[ingredientProp] as string);
      } else {
        break;
      }
    }
    return ingredients;
  }

  generarUrlVideoEmbed(url: string | null): SafeResourceUrl {
    if (url) {
      const idVideo = this.extraerIdVideoYoutube(url);
      if (idVideo) {
        const urlEmbed = `https://www.youtube.com/embed/${idVideo}`;
        return this.sanitizer.bypassSecurityTrustResourceUrl(urlEmbed);
      }
    }

    // Devuelve una URL segura predeterminada (por ejemplo, un video de YouTube)
    const urlDefaultEmbed = 'https://www.youtube.com/embed/VIDEO_ID';
    return this.sanitizer.bypassSecurityTrustResourceUrl(urlDefaultEmbed);
  }

  extraerIdVideoYoutube(url: string): string | null {
    // Expresión regular para coincidir con los patrones de URL de video de YouTube
    const patronUrlYoutube = /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^\s&]+)$/;

    // Extraer el ID del video desde la URL utilizando una coincidencia de expresiones regulares
    const coincidencias = url.match(patronUrlYoutube);
    if (coincidencias && coincidencias.length === 2) {
      return coincidencias[1];
    } else {
      return null;
    }
  }

  agregarFavorito() {
  if (this.isLoggedIn) {
    const favoritosPorUsuario = this.localStorageService.get(this.username + '_favoritos') || [];
    const existeReceta = favoritosPorUsuario.some((receta: Receta) => receta.idMeal === this.receta.idMeal);

    if (!existeReceta) {
      favoritosPorUsuario.push(this.receta);
      this.localStorageService.set(this.username + '_favoritos', favoritosPorUsuario);
      this.mostrarMensaje('Receta agregada a favoritos', 'success');
    } else {
      this.mostrarMensaje('La receta ya está en favoritos', 'warning');
    }
  } else {
    this.router.navigate(['/login']);
  }
}

  async mostrarMensaje(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      color: color,
      duration: 2000 // Duración del mensaje en milisegundos
    });
    toast.present();
  }
  
}
