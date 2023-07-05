import { Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy, OnInit } from '@angular/core';
import { App } from '@capacitor/app';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonicModule, ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { BolistaDbService } from './services/bolista-db.service';
import { TrialService } from './shared/services/trial.service';
import { InfoModalComponent } from './shared/components/info-modal/info-modal.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  template: `
    <ion-app>
      <ion-split-pane contentId="main-content">
        <ion-menu contentId="main-content" type="overlay">
          <ion-content>
            <ion-list id="inbox-list">
              <img id="logo" src="./../assets/bolista.png" />
            </ion-list>

            <ion-list id="labels-list">
              <ion-list-header>Archivos</ion-list-header>

              <ion-menu-toggle auto-hide="false">
                <ion-item
                  lines="none"
                  routerLink="/lista"
                  detail="false"
                  routerLinkActive="selected"
                >
                  <ion-icon
                    slot="start"
                    ios="reader-outline"
                    md="reader-sharp"
                  ></ion-icon>
                  <ion-label>Lista</ion-label>
                </ion-item>

                <ion-item
                  routerLink="/ganadores"
                  detail="false"
                  routerLinkActive="selected"
                  lines="none"
                >
                  <ion-icon
                    slot="start"
                    ios="trophy-outline"
                    md="trophy-sharp"
                  ></ion-icon>
                  <ion-label>Ganadores</ion-label>
                </ion-item>

                <ion-item
                  lines="none"
                  routerLink="/configuracion"
                  detail="false"
                  routerLinkActive="selected"
                >
                  <ion-icon
                    aria-hidden="true"
                    slot="start"
                    ios="settings-outline"
                    md="settings-sharp"
                  ></ion-icon>
                  <ion-label>Configuración</ion-label>
                </ion-item>
              </ion-menu-toggle>
            </ion-list>

            <ion-list id="labels-list">
              <ion-list-header>Ayuda</ion-list-header>
              <ion-menu-toggle auto-hide="false">
                <ion-item
                  routerLink="/acerca de"
                  detail="false"
                  routerLinkActive="selected"
                  lines="none"
                >
                  <ion-icon
                    slot="start"
                    ios="help-circle-outline"
                    md="help-circle-sharp"
                  ></ion-icon>
                  <ion-label>Acerca de ...</ion-label>
                </ion-item>

                <ion-item
                  routerLink="/salir"
                  detail="false"
                  routerLinkActive="selected"
                  lines="none"
                  (click)="close()"
                >
                  <ion-icon
                    slot="start"
                    ios="exit-outline"
                    md="exit-sharp"
                  ></ion-icon>
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
export class AppComponent implements OnInit,OnDestroy {
  public selectedPage!: string;
  public horaActual!: string;
  private sub!:Subscription

  constructor(
    private http: HttpClient,
    private dbService: BolistaDbService,
    private trialService: TrialService,
    private modalCtrl: ModalController
  ) {}
  ngOnInit(): void {
    this.dbService.mDb
      .query(`select tema from config`)
      .then((ret) => {
        const tema = ret.values![0].tema;
        if (tema === 'dark') {
          document.body.classList.add('dark');
        } else {
          document.body.classList.remove('dark');
        }
      })
      .catch((err) => console.log);
        /* if (active===0) {
          this.openInfoModal('Su tiempo de prueba se ha agotado')
        } else { */
        

      // this.activateTrial();
  }

  activateTrial(){
    this.sub=this.trialService.onTrial().subscribe({
      next:({trial,timeout})=>{
        
        if(timeout){
          this.dbService.mDb.query(`select active from trial`).then(ret=>{
            const active= ret.values![0].active
            if (active===0) {
              this.openInfoModal('Su tiempo de prueba se ha agotado')
            }
          })
        }else if (trial===false) {
          this.dbService.mDb.execute(`update trial set active=0`);
          this.openInfoModal('Su tiempo de prueba se ha agotado')
        }
        else if (trial===true) {
          this.dbService.mDb.execute(`update trial set active=1`);
        }
      },
      error:()=>{
        console.log('asd');
        
      }
      /* ,
      complete:()=>{

        console.log('complete');
        
      } */
    });
    
  // }
  }

  ngOnDestroy(): void {
    // this.sub.unsubscribe()
  }
  //Cerrar la aplicación con capacitor
  async openInfoModal(message:string) {
    const modal = await this.modalCtrl.create({
      component: InfoModalComponent,
      cssClass: 'add-modal-css',
      componentProps:{
        message
      }
    });
    modal.onDidDismiss().then((result) => {
      this.close()
      
    });
    return await modal.present();
  }
  close() {
    App.exitApp();
  }

}
