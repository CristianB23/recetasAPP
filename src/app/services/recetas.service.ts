import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecetasService {
  private baseUrl = 'https://www.themealdb.com/api/json/v1/1';

  constructor(private http: HttpClient) { }

  // Obtener recetas aleatorias
  getRandomRecetas(cantidad: number) {
    return this.http.get(`${this.baseUrl}/random.php?amount=${cantidad}`);
  }

  getMultipleRandomRecetas(cantidad: number) {
    const peticiones = [];
    for (let i = 0; i < cantidad; i++) {
      peticiones.push(this.getRandomRecetas(cantidad)); 
    }
    return forkJoin(peticiones);
  }

  // Buscar recetas por categoría
  buscarRecetasPorCategoria(categoria: string) {
    return this.http.get(`${this.baseUrl}/filter.php?c=${categoria}`);
  }

  buscarRecetasPorNombreYCategoria(nombre: string, categoria: string) {
    const url = `${this.baseUrl}/search.php?s=${nombre}`;
    if (categoria.trim() !== '') {
      return this.http.get(`${url}&c=${categoria}`);
    } else {
      return this.http.get(url);
    }
  }
  
  // Obtener detalles de una receta
  obtenerDetallesReceta(id: string) {
    return this.http.get(`${this.baseUrl}/lookup.php?i=${id}`);
  }
}
