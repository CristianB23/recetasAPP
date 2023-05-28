import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-editar-comentario-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Editar Comentario</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="cerrarModal()">Cerrar</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-item>
        <ion-label position="stacked">Comentario</ion-label>
        <ion-textarea [(ngModel)]="comentario.comment" rows="5"></ion-textarea>
      </ion-item>
      <ion-button expand="block" (click)="guardarCambios()">Guardar Cambios</ion-button>
    </ion-content>
  `,
 styleUrls: ['../editar-comentario-modal/editar-comentario-modal.component.scss']
  
})
export class EditarComentarioModal {
  @Input() comentario!: { username: string; comment: string };

  constructor(private modalController: ModalController) {}

  cerrarModal() {
    this.modalController.dismiss();
  }

  guardarCambios() {
    console.log('Comentario antes de guardar:', this.comentario.comment);
      
    this.modalController.dismiss(this.comentario);
    console.log('Comentario después de guardar:', this.comentario.comment);
  }
}
