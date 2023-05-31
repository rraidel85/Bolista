import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MessagesService } from '../../services/messages.service';
import { JsonPipe, NgFor } from '@angular/common';
import { SMSInboxReader } from 'capacitor-sms-inbox';

@Component({
  selector: 'app-message-list',
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Mensajes</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true">
      <!-- <ion-list>
        <ion-item *ngFor="let message of messages">
          <ion-label>{{ message }}</ion-label>
        </ion-item>
      </ion-list> -->
      {{ messages | json }}
    </ion-content>
  `,
  styleUrls: ['./message-list.component.scss'],
  standalone: true,
  imports: [IonicModule, NgFor, JsonPipe],
})
export class MessageListComponent implements OnInit {
  constructor(private messagesService: MessagesService) {}

  messages: any = [];

  ngOnInit(): void {
    SMSInboxReader.getSMSList({
      projection: { creator: true, body: true },
      filter: {maxCount: 10}
    }).then((data) => this.messages = data)
    .catch(err => console.log(err));
  }
}
