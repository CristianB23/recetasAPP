import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecetaDetallePageRoutingModule } from './receta-detalle-routing.module';
import { RecetaDetallePage } from './receta-detalle.page';
import { EditarComentarioModal } from '../editar-comentario-modal/editar-comentario-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecetaDetallePageRoutingModule
  ],
  declarations: [RecetaDetallePage,
    EditarComentarioModal],
  exports: [RecetaDetallePage],
  providers: [RecetaDetallePage]
})
export class RecetaDetallePageModule {}

