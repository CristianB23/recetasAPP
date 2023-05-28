import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { RecetasService } from '../services/recetas.service';
import { Receta } from '../models/receta.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LocalStorageService } from '../services/local-storage.service';
import { ToastController, AlertController, ModalController  } from '@ionic/angular';
import { EditarComentarioModal } from '../editar-comentario-modal/editar-comentario-modal.component';

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
  newComment: string = '';
  comentario: any;
  comentariosReceta: { username: string; comment: string; }[] = [];
  comentarioEditado: { username: string; comment: string }[] = [];;
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private recetasService: RecetasService,
    private sanitizer: DomSanitizer,
    private localStorageService: LocalStorageService,
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController,
    private modalController: ModalController
  ) {}
  
  esFavorito: boolean = false;

  toggleFavorito() {
    this.esFavorito = !this.esFavorito;
  }

  ngOnInit() {
    this.isLoggedIn = this.localStorageService.get('isLoggedIn') === 'true';
    this.username = this.localStorageService.get('username') || '';
    this.activatedRoute.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id !== null) {
        this.recetasService.obtenerDetallesReceta(id).subscribe((data: any) => {
          this.receta = data.meals[0];
          this.urlVideo = this.generarUrlVideoEmbed(this.receta.strYoutube);
          this.comentariosReceta = this.recetasService.obtenerComentariosReceta(this.receta.idMeal);
          this.esFavorito = this.localStorageService.get('esFavorito') || false;
          this.esFavorito = this.esRecetaFavorita(this.receta);
          
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
  esRecetaFavorita(receta: Receta): boolean {
    const favoritosPorUsuario = this.localStorageService.get(this.username + '_favoritos') || [];
    return favoritosPorUsuario.some((recetaFavorita: Receta) => recetaFavorita.idMeal === receta.idMeal);
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
        const index = favoritosPorUsuario.findIndex((receta: Receta) => receta.idMeal === this.receta.idMeal);
        favoritosPorUsuario.splice(index, 1);
        this.localStorageService.set(this.username + '_favoritos', favoritosPorUsuario);
        this.mostrarMensaje('Receta eliminada de favoritos', 'warning');
      }
      this.esFavorito = !existeReceta;
    } else {
      this.router.navigate(['/login']);
    }
  }
  


  agregarComentario() {
    if (this.newComment) {
      if (this.isLoggedIn) {
        const comentario = {
          username: this.username,
          comment: this.newComment
        };
  
        const comentariosReceta = this.recetasService.obtenerComentariosReceta(this.receta.idMeal);
        comentariosReceta.push(comentario);
  
        this.recetasService.guardarComentarioReceta(this.receta.idMeal, comentariosReceta);
        this.comentariosReceta = comentariosReceta;
        console.log('Comentario acipal:', this.comentariosReceta);

        this.newComment = '';
  
        this.mostrarMensaje('Comentario agregado', 'success');
      } else {
        this.mostrarMensaje('Debes iniciar sesión para agregar un comentario', 'danger');
      }
    }
  }

  async abrirModal() {
    const modal = await this.modalController.create({
      component: EditarComentarioModal,
      componentProps: {
        comentario: this.comentarioEditado,
      },
    });
  
    modal.onDidDismiss().then((data) => {
      if (data.role === 'guardar') {
        this.guardarComentarioEditado(data.data);
      }
    });
  
    await modal.present();
  }
  
  async editarComentario(comentario: { username: string; comment: string }) {
    const modal = await this.modalController.create({
      component: EditarComentarioModal,
      componentProps: {
        comentario: comentario
      }
    });
  
    modal.onDidDismiss().then((data) => {
      if (data && data.data) {
        const comentarioActualizado = data.data;
        console.log('Comentario actualizado en el componente principal:', comentarioActualizado);
        this.guardarComentarioEditado(comentarioActualizado);
        this.msgeditar('Comentario editado correctamente','success');
      }
    });
  
    return await modal.present();
  }
  
async guardarComentarioEditado(comentarioEditado: { username: string; comment: string }) {
  if (!Array.isArray(this.comentariosReceta)) {
    this.comentariosReceta = [];
  }

  const index = this.comentariosReceta.findIndex((com) => com.username === comentarioEditado.username && com.comment === comentarioEditado.comment);
  if (index > -1) {
    this.comentariosReceta[index] = comentarioEditado; 
  } else {
    this.comentariosReceta.push(comentarioEditado);
  }

  try {
    await this.recetasService.guardarComentarioReceta(this.receta.idMeal, this.comentariosReceta);
    console.log('Comentario guardado correctamente');
    // Realizar la redirección o actualizar los datos aquí después de que el comentario se haya guardado correctamente
  } catch (error) {
    console.error('Error al guardar el comentario', error);
    // Manejar el error aquí si ocurre algún problema al guardar el comentario
  }
} 
  
  async eliminarComentario(comentario: { username: string; comment: string }) {
    if (comentario.username === this.username) {
      const alert = await this.alertController.create({
        header: 'Confirmar eliminación',
        message: '¿Estás seguro de que deseas eliminar este comentario?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              // Acción al cancelar la eliminación
            }
          },
          {
            text: 'Eliminar',
            cssClass: 'danger',
            handler: () => {
              const index = this.comentariosReceta.findIndex((com) => com.username === comentario.username && com.comment === comentario.comment);
              if (index > -1) {
                this.comentariosReceta.splice(index, 1);
                this.recetasService.guardarComentarioReceta(this.receta.idMeal, this.comentariosReceta);
                this.mostrarMensaje('Comentario eliminado', 'success');
              }
            }
          }
        ]
      });
  
      await alert.present();
    }
  }

   
  async msgeditar(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      color: color,
      duration: 2000
    });
    toast.present();
  }

  async mostrarMensaje(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      color: color,
      duration: 2000 
    });
    toast.present();
  }
    
}
