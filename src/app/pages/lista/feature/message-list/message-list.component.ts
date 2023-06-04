import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MessagesService } from '../../services/messages.service';
import { AsyncPipe, JsonPipe, NgFor, NgIf } from '@angular/common';
import { SMSObject } from 'capacitor-sms-inbox';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-message-list',
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Mensaje</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true">
      <ion-segment value="received" (ionChange)="segmentChanged($event)">
        <ion-segment-button value="received">
          <ion-label>Recibidos</ion-label>
        </ion-segment-button>
        <ion-segment-button value="sent">
          <ion-label>Enviados</ion-label>
        </ion-segment-button>
      </ion-segment>

      <ng-container *ngIf="selectedSegment === 'received'">
        <ion-button class="ion-margin-top importar-button" expand="block"
          >Importar</ion-button
        >
        <ion-list>
          <ion-card *ngFor="let item of smsPruebaR">
            <ion-card-header>
              <div class="card-header">
                <ion-text color="primary">+5355565758</ion-text>
                <ion-checkbox></ion-checkbox>
              </div>
            </ion-card-header>
            <ion-card-content>
              <ion-text class="sms-body">
                {{ item }}
              </ion-text>
              <ion-label class="sms-date">
                14/04/2023 13:49
              </ion-label>
            </ion-card-content>
          </ion-card>
        </ion-list>
      </ng-container>

      <ng-container *ngIf="selectedSegment === 'sent'">
      <ion-button class="ion-margin-top importar-button" expand="block"
          >Importar</ion-button
        >
        <ion-list>
          <ion-card *ngFor="let item of smsPruebaE">
            <ion-card-header>
              <div class="card-header">
                <ion-text color="primary">+5355565758</ion-text>
                <ion-checkbox></ion-checkbox>
              </div>
            </ion-card-header>
            <ion-card-content>
              <ion-text class="sms-body">
                {{ item }}
              </ion-text>
              <ion-label class="sms-date">
                14/04/2023 13:49
              </ion-label>
            </ion-card-content>
          </ion-card>
        </ion-list>
      </ng-container>

      <ion-card> </ion-card>

      <!-- <h1>Recibidos</h1>
      {{ receivedSMS$ | async | json }}
      <hr />
      <h1>Enviados</h1>
      {{ sentSMS$ | async | json }} -->
    </ion-content>
  `,
  styleUrls: ['./message-list.component.scss'],
  standalone: true,
  imports: [IonicModule, NgFor, JsonPipe, AsyncPipe, NgIf],
})
export class MessageListComponent implements OnInit {
  selectedSegment: string = 'received';
  receivedSMS$!: Observable<{ smsList: SMSObject[] }>;
  sentSMS$!: Observable<{ smsList: SMSObject[] }>;
  smsPruebaR: any[] = [];
  smsPruebaE: any[] = [];

  constructor(
    private messagesService: MessagesService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.smsPruebaR = ['45', '89', '97'];
    this.smsPruebaE = [
      'Esto es un mensaje de prueba',
      'Este es otro',
      'y este es otro',
    ];

    this.receivedSMS$ = this.route.paramMap.pipe(
      switchMap((params) => {
        const contactPhone = this.messagesService.checkCountryCode(
          params.get('phone')!
        );
        const sms = this.messagesService.getReceivedSMS(contactPhone);
        sms.then((s) => console.log(s));
        return this.messagesService.getReceivedSMS(contactPhone);
      })
    );

    this.sentSMS$ = this.route.paramMap.pipe(
      switchMap((params) => {
        const contactPhone = params.get('phone')!;
        return this.messagesService.getSentSMS(contactPhone);
      })
    );
  }

  segmentChanged(event: any) {
    this.selectedSegment = event.target.value;
  }
}
