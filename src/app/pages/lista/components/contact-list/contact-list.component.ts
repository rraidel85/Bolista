import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ContactsService } from '../../services/contacts.service';
import { ContactPayload } from '@capacitor-community/contacts';
import { JsonPipe, NgFor, NgIf, AsyncPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { HoraService } from 'src/app/services/hora.service';
import { HoraPipe } from 'src/app/pipes/hora.pipe';
import { Subscription, Observable, tap, catchError, of } from 'rxjs';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-contact-list',
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Contactos</ion-title>
        <ion-text class="hour" slot="end">{{
          horaActual$ | async | hora
        }}</ion-text>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true" [scrollY]="false">
        <cdk-virtual-scroll-viewport
          class="ion-content-scroll-host"
          itemSize="85"
          minBufferPx="900"
          maxBufferPx="1350"
        >
          <ion-list>
            <!-- <ng-container
          > -->
            <ion-item
              class="contact"
              [routerLink]="[contact.phones[0]]"
              [queryParams]="{ group }"
              *cdkVirtualFor="let contact of contacts$ | async"
            >
              <ion-thumbnail>
                <ion-icon
                  class="contact-icon"
                  name="person-circle-outline"
                  color="primary"
                ></ion-icon>
              </ion-thumbnail>
              <ion-label class="contact-info">
                <h4 class="contact-info-name">{{ contact.name?.display }}</h4>
                <h4>{{ contact.phones[0] }}</h4>
              </ion-label>
            </ion-item>
          </ion-list>
        </cdk-virtual-scroll-viewport>
    </ion-content>
  `,
  styleUrls: ['./contact-list.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    JsonPipe,
    NgFor,
    NgIf,
    RouterLink,
    ScrollingModule,
    HoraPipe,
    AsyncPipe,
  ],
})
export class ContactListComponent implements OnInit, OnDestroy {
  contacts$!: Observable<ContactPayload[]>;
  horaActual$!: Observable<string>;
  group!: string | null;
  suscription!: Subscription;
  loading!: HTMLIonLoadingElement;

  constructor(
    private contactsService: ContactsService,
    private horaService: HoraService,
    private route: ActivatedRoute,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.loadData()
  }

  async loadData(){
    this.horaActual$ = this.horaService.obtenerHoraActual();

    await this.presentLoading(); // Show loading spinner

    this.contacts$ = this.contactsService
      .contacts$.pipe(
        tap((contacts)=> console.log('Desde el contact-list',contacts)),
        tap(()=> this.dismissLoading()),
        catchError(err => {
          console.log(err);
          this.dismissLoading()
          return of([]);
        })
      )

    this.suscription = this.route.queryParams.subscribe((params) => {
      this.group = params['group'];
    });
  }

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando contactos...',
      spinner: 'circular', // Choose a spinner type
      cssClass: 'loading-spinner',
    });
    await loading.present();
  }

  async dismissLoading() {
    await this.loadingCtrl.dismiss();
  }

  
  ionViewWillLeave() {
    this.contactsService.cancelSignal.abort();
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
    this.contactsService.cancelSignal.abort();
  }
}
