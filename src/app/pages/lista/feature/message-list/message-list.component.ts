import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MessagesService } from '../../services/messages.service';
import { AsyncPipe, JsonPipe, NgFor } from '@angular/common';
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
      <!-- <ion-list>
        <ion-item *ngFor="let message of messages">
          <ion-label>{{ message }}</ion-label>
        </ion-item>
      </ion-list> -->
      <h1>Recibidos</h1>
      {{ (receivedSMS$ | async) | json }}
      <hr/>
      <h1>Enviados</h1>
      {{ (sentSMS$ | async) | json }}
    </ion-content>
  `,
  styleUrls: ['./message-list.component.scss'],
  standalone: true,
  imports: [IonicModule, NgFor, JsonPipe, AsyncPipe],
})
export class MessageListComponent implements OnInit {

  constructor(private messagesService: MessagesService,
    private route: ActivatedRoute) {}

  receivedSMS$!: Observable<{ smsList: SMSObject[] }>;
  sentSMS$!: Observable<{ smsList: SMSObject[] }>;

  ngOnInit(): void {
    this.receivedSMS$ = this.route.paramMap.pipe(
      switchMap(params => {
        const contactPhone= '+5355768570';//params.get('phone')!;
        const sms = this.messagesService.getReceivedSMS(contactPhone);
        sms.then(s => console.log(s))
        return this.messagesService.getReceivedSMS(contactPhone);
      })
    );

    this.sentSMS$ = this.route.paramMap.pipe(
      switchMap(params => {
        const contactPhone= params.get('phone')!;
        return this.messagesService.getSentSMS(contactPhone);
      })
    );

  }
}
