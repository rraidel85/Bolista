import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ApplicationRef } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  template: `
 <ion-app>
  <ion-split-pane contentId="main-content">
    <ion-menu contentId="main-content" type="overlay">
      <ion-content>
      
        <ion-list id="inbox-list">
          <img id="logo" src="./../assets/bolista.png">
        </ion-list>
     
        <ion-list id="labels-list">
          <ion-list-header>Archivos</ion-list-header>
          

          <ion-menu-toggle auto-hide="false">

            <ion-item lines="none" routerLink="/lista" detail="false" routerLinkActive="selected">
              <ion-icon slot="start" ios="reader-outline" md="reader-sharp"></ion-icon>
              <ion-label>Lista</ion-label>
            </ion-item>
            
            <ion-item routerLink="/ganadores" detail="false" routerLinkActive="selected" lines="none">
              <ion-icon slot="start" ios="trophy-outline" md="trophy-sharp"></ion-icon>
              <ion-label>Ganadores</ion-label>
            </ion-item>

            <ion-item lines="none" routerLink="/configuracion" detail="false" routerLinkActive="selected">
              <ion-icon aria-hidden="true" slot="start" ios="settings-outline" md="settings-sharp"></ion-icon>
              <ion-label>Configuración</ion-label>
            </ion-item>
           

          </ion-menu-toggle>
        </ion-list>


        <ion-list id="labels-list">
          
          <ion-list-header>Ayuda</ion-list-header>
          <ion-menu-toggle auto-hide="false">
         

          <ion-item routerLink="/about" detail="false" routerLinkActive="selected" lines="none">
            <ion-icon slot="start" ios="help-circle-outline" md="help-circle-sharp"></ion-icon>
            <ion-label>Acerca de ...</ion-label>
          </ion-item>

          <ion-item routerLink="/salir" detail="false" routerLinkActive="selected" lines="none" (click)="close()">
            <ion-icon  slot="start" ios="exit-outline" md="exit-sharp"></ion-icon>
            <ion-label>Salir</ion-label>
          </ion-item>
        </ion-menu-toggle>
        </ion-list>
 
      </ion-content>
    </ion-menu>
    <ion-router-outlet id="main-content"></ion-router-outlet>
  </ion-split-pane>
</ion-app>
  `,
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule, RouterLink, RouterLinkActive],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent {
  public selectedPage!: string;
  public horaActual!: string;
  
  constructor(private appRef: ApplicationRef, private http:HttpClient) {

  }


  close() {
    // Close the application
    this.appRef.destroy();
  }
}
