export interface Receta {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strIngredients: [];
  strYoutube: '',
}
export class Receta {
  id: string;
  nombre: string;
  // otras propiedades de la receta

  constructor(id: string, nombre: string) {
    this.id = id;
    this.nombre = nombre;
    // inicializa otras propiedades si es necesario
  }
}
