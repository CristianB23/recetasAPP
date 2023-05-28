import { Component, ChangeDetectorRef } from '@angular/core';
import { LocalStorageService } from './services/local-storage.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public pages = [
    { title: 'Inicio', url: '/inicio' },
    { title: 'Búsqueda', url: '/busqueda' }
  ];
  public isLoggedIn: boolean = false;
  public pageTitle: string = 'Inicio';

  constructor(
    private localStorageService: LocalStorageService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.isLoggedIn = this.localStorageService.get('isLoggedIn') === 'true';
    this.changeDetectorRef.detectChanges(); // Detectar cambios manualmente

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.setPageTitle(event.urlAfterRedirects);
      }
    });
  }

  setPageTitle(url: string) {
    if (url.includes('/home')) {
      this.pageTitle = 'Inicio';
    } else if (url.includes('/busqueda')) {
      this.pageTitle = 'Búsqueda';
    } else if (url.includes('/favoritos')) {
      this.pageTitle = 'Favoritos';
    } else {
      this.pageTitle = 'RecetasAPP';
    }
  }
  

  logout() {
    this.isLoggedIn = false;
    this.localStorageService.set('isLoggedIn', 'false');
  }
}

