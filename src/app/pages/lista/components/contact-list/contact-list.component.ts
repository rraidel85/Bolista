import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ContactsService } from '../../services/contacts.service';
import { ContactPayload } from '@capacitor-community/contacts';
import { JsonPipe, NgFor, NgIf, AsyncPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { HoraService } from 'src/app/services/hora.service';
import { HoraPipe } from 'src/app/pipes/hora.pipe';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-contact-list',
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Contactos</ion-title>
        <ion-text class="hour" slot="end">{{ (horaActual$ | async) | hora }}</ion-text>
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
            [routerLink]="[contact.phones![0].number]"
            [queryParams]="{ group }"
            *cdkVirtualFor="let contact of contacts; trackBy: trackByFn"
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
              <h4>{{ contact.phones![0].number }}</h4>
            </ion-label>
          </ion-item>

          <!-- <ng-template #contactAccordion>
              <ion-accordion-group>
                <ion-accordion value="contact.phones![0].number">
                  <ion-item
                    class="contact"
                    [routerLink]="[contact.phones![0].number]"
                  >
                    <ion-thumbnail>
                      <ion-icon
                        class="contact-icon"
                        name="person-circle-outline"
                        color="primary"
                      ></ion-icon>
                    </ion-thumbnail>
                    <ion-label class="contact-info">
                      <h4 class="contact-info-name">
                        {{ contact.name?.display }}
                      </h4>
                      <h4>{{ contact.phones![0].number }}</h4>
                    </ion-label>
                  </ion-item>
                  <div
                    class="ion-padding"
                    slot="content"
                    *ngFor="let phone of contact.phones.slice(1)"
                    [routerLink]="[phone.number]"
                  >
                    {{ phone.number }}
                  </div>
                </ion-accordion>
              </ion-accordion-group>
            </ng-template> -->
          <!-- </ng-container> -->
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
    AsyncPipe
  ],
})
export class ContactListComponent implements OnInit, OnDestroy {
  contacts!: ContactPayload[];
  horaActual$!: Observable<string>;
  group!: string | null;
  suscription!: Subscription;

  constructor(
    private contactsService: ContactsService,
    private horaService: HoraService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.horaActual$ = this.horaService.obtenerHoraActual();

    this.contactsService
      .getAllContacts()
      .then((contacts) => (this.contacts = contacts))
      .catch((error) => console.error(error));

    this.suscription = this.route.queryParams.subscribe((params) => {
      this.group = params['group'];
    });
  }

  trackByFn(index: number, item: ContactPayload): string {
    return item.contactId;
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }
}
