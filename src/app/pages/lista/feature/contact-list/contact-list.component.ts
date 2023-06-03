import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ContactsService } from '../../services/contacts.service';
import { ContactPayload } from '@capacitor-community/contacts';
import { JsonPipe, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-contact-list',
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Contactos</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true">
      <ion-list>
        <ion-item
          *ngFor="let contact of contacts"
          [routerLink]="[contact.phones![0].number]"
        >
          <ion-label>
            <h4>Nombre: {{ contact.name?.display }}</h4>
            <h4>Teléfono: {{ contact.phones![0].number }}</h4>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  `,
  styleUrls: ['./contact-list.component.scss'],
  standalone: true,
  imports: [IonicModule, JsonPipe, NgFor, NgIf, RouterLink],
})
export class ContactListComponent implements OnInit {
  contacts!: ContactPayload[];

  constructor(private contactsService: ContactsService) {}

  ngOnInit() {
    this.contactsService
      .getAllContacts()
      .then((contacts) => (this.contacts = contacts))
      .catch((error) => console.error(error));
  }
}
