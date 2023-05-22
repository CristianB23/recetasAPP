import { Component, ChangeDetectorRef } from '@angular/core';
import { LocalStorageService } from './services/local-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public pages = [
    { title: 'Home', url: '/inicio' },
    { title: 'Búsqueda', url: '/busqueda' }
  ];
  public isLoggedIn: boolean = false;

  constructor(private localStorageService: LocalStorageService, private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.isLoggedIn = this.localStorageService.get('isLoggedIn') === 'true';
    this.changeDetectorRef.detectChanges(); // Detectar cambios manualmente
  }

  logout() {
    this.isLoggedIn = false;
    this.localStorageService.set('isLoggedIn', 'false');
  }
}
