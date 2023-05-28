export class Receta {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strIngredients: string[];
  strYoutube: string;
  strComments: string[];

  constructor(idMeal: string, strMeal: string, strCategory: string, strArea: string, strInstructions: string, strMealThumb: string, strIngredients: string[], strYoutube: string) {
    this.idMeal = idMeal;
    this.strMeal = strMeal;
    this.strCategory = strCategory;
    this.strArea = strArea;
    this.strInstructions = strInstructions;
    this.strMealThumb = strMealThumb;
    this.strIngredients = strIngredients;
    this.strYoutube = strYoutube;
    this.strComments = [];
  }

}

