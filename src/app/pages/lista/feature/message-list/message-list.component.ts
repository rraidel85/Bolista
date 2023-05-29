import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MessagesService } from '../../services/messages.service';
import { NgFor } from '@angular/common';

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
      <ion-list>
        <ion-item *ngFor="let message of messages">
          <ion-label>{{ message }}</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  `,
  styleUrls: ['./message-list.component.scss'],
  standalone: true,
  imports: [IonicModule, NgFor],
})
export class MessageListComponent implements OnInit {

  messages = ["un mensaje", "otro mensaje"]

  constructor(private messagesService: MessagesService) {}

  ngOnInit() {}
}
