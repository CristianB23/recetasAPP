import { Component, OnInit } from '@angular/core';
import { RecetasService } from '../services/recetas.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  recetas: any[];

  constructor(private recetasService: RecetasService) { }

  ngOnInit() {
    this.recetasService.getRandomRecetas().subscribe(data => {
      this.recetas = data['meals'];
    });
  }
}
