import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal, IonicModule } from '@ionic/angular';
import { SmsService } from '../../services/sms.service';
import { AsyncPipe, JsonPipe, NgFor, NgIf } from '@angular/common';
import { SMSObject } from 'capacitor-sms-inbox';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { OverlayEventDetail } from '@ionic/core/components';
import { ModalSmsDataDismiss } from '../../models/modal-sms-data-dismiss.model';
import { FormsModule } from '@angular/forms';
import { SmsComponent } from '../sms/sms.component';

@Component({
  selector: 'app-sms-list',
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
        <ng-container *ngIf="receivedSMS$ | async as receivedSMS">
          <ion-button
            *ngIf="receivedSMS.smsList.length !== 0"
            class="ion-margin-top importar-button"
            expand="block"
          >
            Importar
          </ion-button>
          <ng-container *ngIf="receivedSMS.smsList.length !== 0; else noSms">
            <ion-list>
              <app-sms
                (modalOpen)="openEditModal(sms.body, i)"
                *ngFor="let sms of receivedSMS.smsList; index as i"
                [sms]="sms"
              ></app-sms>
            </ion-list>
          </ng-container>
        </ng-container>
      </ng-container>

      <ng-container *ngIf="selectedSegment === 'sent'">
        <ion-button class="ion-margin-top importar-button" expand="block">
          Importar
        </ion-button>
        <ion-list>
          <ng-container *ngIf="sentSMS$ | async as sentSMS">
            <app-sms
              (modalOpen)="openEditModal(sms.body, i)"
              *ngFor="let sms of sentSMS.smsList; index as i"
              [sms]="sms"
            ></app-sms>
          </ng-container>
        </ion-list>
      </ng-container>

      <ion-modal [isOpen]="isModalOpen" (willDismiss)="onWillDismiss($event)">
        <ng-template>
          <ion-header>
            <ion-toolbar>
              <ion-buttons slot="start">
                <ion-button class="modal-button" (click)="cancel()"
                  >Cancelar</ion-button
                >
              </ion-buttons>
              <ion-title class="modal-title">Editar</ion-title>
              <ion-buttons slot="end">
                <ion-button
                  class="modal-button"
                  (click)="confirm()"
                  [strong]="true"
                  >Aceptar</ion-button
                >
              </ion-buttons>
            </ion-toolbar>
          </ion-header>
          <ion-content class="ion-padding">
            <ion-item>
              <ion-input type="text" [(ngModel)]="currentEditingText">
              </ion-input>
            </ion-item>
          </ion-content>
        </ng-template>
      </ion-modal>

      <ng-template #noSms>
        <div class="no-sms">
          <ion-text>No tienes mensajes de este contacto</ion-text>
        </div>
      </ng-template>
    </ion-content>
  `,
  styleUrls: ['./sms-list.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    NgFor,
    JsonPipe,
    AsyncPipe,
    NgIf,
    FormsModule,
    SmsComponent,
  ],
})
export class SmsListComponent implements OnInit {
  selectedSegment: string = 'received';
  receivedSMS$!: Observable<{ smsList: SMSObject[] }>;
  sentSMS$!: Observable<{ smsList: SMSObject[] }>;
  smsPruebaR: any[] = [];
  smsPruebaE: any[] = [];
  currentEditingIndex!: number;
  currentEditingText!: string; // Current sms text in editing input and value saved after done edit
  oldSmsText!: string; // Old sms text before editing in case user cancel edit
  isModalOpen: boolean = false;
  @ViewChild(IonModal) modal!: IonModal;

  constructor(private smsService: SmsService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    /* this.smsPruebaR = [
      '45',
      '89',
      '17-25,21-30,27-,77-100,72,38,83,82,21,22,60,06,23-20,00a99-16,70a79-100,08-100,00a99-50,01-300,01a91-50,77-100,62-30,60a69-5,00a99-5,33-10,66-5,16-5,10,19,07,72,37,70,69,71,17,06,65-10,89,62,34,33-5,98-20,60a69-6,33,82-50,00a99-20,62,08-',
    ];
    this.smsPruebaE = [
      'Esto es un mensaje de prueba',
      'Este es otro',
      'y este es otro',
    ]; */

    // Received SMS
    this.receivedSMS$ = this.route.paramMap.pipe(
      switchMap((params) => {
        const contactPhone = this.smsService.checkCountryCode(
          params.get('phone')!
        );
        const sms = this.smsService.getReceivedSMS(contactPhone);
        sms.then((s) => console.log(s));
        return this.smsService.getReceivedSMS(contactPhone);
      })
    );

    // Sent SMS
    this.sentSMS$ = this.route.paramMap.pipe(
      switchMap((params) => {
        const contactPhone = params.get('phone')!;
        return this.smsService.getSentSMS(contactPhone);
      })
    );
  }

  segmentChanged(event: any) {
    this.selectedSegment = event.target.value;
  }

  openEditModal(smsText: string, smsIndex: number) {
    this.isModalOpen = true;
    this.currentEditingIndex = smsIndex; //Index for edit smsList array with change from editInputModal
    this.oldSmsText = smsText; //Old text in case user press Cancel button on modal
    this.currentEditingText = smsText; //Text to populate modal input value
  }

  cancel() {
    this.isModalOpen = false;
  }

  confirm() {
    const dismissData: ModalSmsDataDismiss = {
      smsText: this.currentEditingText,
      smsIndex: this.currentEditingIndex,
    };
    this.modal.dismiss(dismissData, 'confirm');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<ModalSmsDataDismiss>>;
    if (ev.detail.role === 'confirm') {
      // If press Confirm button on modal change the text of the corresponding sms
      // if (this.selectedSegment === 'recived') {
      this.receivedSMS$.subscribe((ret) => {
        ret.smsList[ev.detail.data!.smsIndex].body = ev.detail.data!.smsText;
        this.oldSmsText = ev.detail.data!.smsText; // Update oldText with new text
        this.receivedSMS$ = of(ret); // Update oldText with new text
      });
      // }else if (this.selectedSegment === 'sent') {
      //   this.sentSMS$.subscribe((ret) => {
      //     ret.smsList[ev.detail.data!.smsIndex].body = ev.detail.data!.smsText;
      //     this.oldSmsText = ev.detail.data!.smsText; // Update oldText with new text
      //     this.sentSMS$ = of(ret); // Update oldText with new text
      //   });
      // }
    }
    this.isModalOpen = false;
  }
}
