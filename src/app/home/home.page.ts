import { Component, OnInit, OnDestroy } from '@angular/core';
import { RecetasService } from '../services/recetas.service';
import { Receta } from '../models/receta.model';
import { Subscription, interval } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  categorias: string[] = ['Desayuno', 'Almuerzo', 'Cena', 'Postre'];
  recetas: Receta[] = [];
  private recetasSubscription: Subscription = new Subscription();

  constructor(private recetasService: RecetasService) { }

  ngOnInit() {
    const cantidadRecetas = 6; 

    this.recetasService.getMultipleRandomRecetas(cantidadRecetas).pipe(
      map((data: any[]) => {
        return data.reduce((acumulador, respuesta) => acumulador.concat(this.formatearInstrucciones(respuesta?.meals || [])), []);
      })
    ).subscribe((data: Receta[]) => {
      this.recetas = data;
    });
    
    this.recetasSubscription = interval(15000).pipe(
      switchMap(() => this.recetasService.getMultipleRandomRecetas(cantidadRecetas)),
      map((data: any[]) => {
        return data.reduce((acumulador, respuesta) => acumulador.concat(this.formatearInstrucciones(respuesta?.meals || [])), []);
      })
    ).subscribe((data: Receta[]) => {
      this.recetas = data;
    });
  }
    

  ngOnDestroy() {
    this.recetasSubscription.unsubscribe();
  }

  formatearInstrucciones(recetas: Receta[]): Receta[] {
    return recetas.map(receta => {
      const palabras = receta.strInstructions.split(' ');
      const instruccionesTruncadas = palabras.slice(0, 30).join(' ');
      return { ...receta, strInstructions: instruccionesTruncadas };
    });
  }
}
