import { Component, OnInit } from '@angular/core';
import { RecetasService } from '../services/recetas.service';
import { Receta } from '../models/receta.model';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.page.html',
  styleUrls: ['./busqueda.page.scss'],
})
export class BusquedaPage implements OnInit {
  recetas: Receta[] = [];
  categoriaSeleccionada: string = '';

  constructor(private recetasService: RecetasService) { }

  ngOnInit() {
    // Obtener recetas aleatorias al cargar la página
  }

  buscarRecetas(nombre: string, categoria: string) {
    if (nombre.trim() !== '' || categoria.trim() !== '') {
      this.recetasService.buscarRecetasPorNombreYCategoria(nombre, categoria).subscribe((data: any) => {
        if (data && data.meals && Array.isArray(data.meals)) {
          this.recetas = data.meals;
        } else {
          this.recetas = [];
        }
      });
    } else {
      this.recetas = [];
    }
  }
  

  verDetalles(idReceta: string) {
    // Implementa la lógica para mostrar los detalles de la receta con el ID proporcionado
    console.log('Detalles de la receta:', idReceta);
  }
}
