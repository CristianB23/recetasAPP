import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  constructor() {}

  get(key: string): any {
    const item = localStorage.getItem(key);
    return item !== null ? JSON.parse(item) : null;
  }  

  set(key: string, value: any): void {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  }
  // Obtener las recetas favoritas por usuario
getFavoritosPorUsuario(username: string): any {
  return this.get(username + '_favoritos') || [];
}

// Establecer las recetas favoritas por usuario
setFavoritosPorUsuario(username: string, favoritos: any): void {
  this.set(username + '_favoritos', favoritos);
}


  remove(key: string): void {
    localStorage.removeItem(key);
  }
}
