import { Component } from '@angular/core';
import { ApplicationRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Inicio', url: '/folder/Inicio', icon: 'home' },
    { title: 'Pase', url: '/folder/Pase', icon: 'document' },
    { title: 'Pase +', url: '/folder/Pase +', icon: 'documents' },
    { title: 'Ganadores', url: '/folder/Ganadores', icon: 'calendar' },
    { title: 'Premios', url: '/folder/Premios', icon: 'trophy' },
    { title: 'Configuración', url: '/folder/Configuración', icon: 'settings' },
  ];
  
  constructor(private appRef: ApplicationRef) {
  }

  close() {
    // Close the application
    this.appRef.destroy();
  
  }
}