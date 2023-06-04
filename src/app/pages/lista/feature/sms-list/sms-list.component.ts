import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal, IonicModule } from '@ionic/angular';
import { SmsService } from '../../services/sms.service';
import { AsyncPipe, JsonPipe, NgFor, NgIf } from '@angular/common';
import { SMSObject } from 'capacitor-sms-inbox';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { OverlayEventDetail } from '@ionic/core/components';
import { ModalSmsDataDismiss } from '../../models/modal-sms-data-dismiss.model';
import { FormsModule } from '@angular/forms';

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
        <ion-button class="ion-margin-top importar-button" expand="block"
          >Importar</ion-button
        >
        <ion-list>
          <ion-card *ngFor="let item of smsPruebaR; index as i">
            <ion-card-header>
              <div class="card-header">
                <ion-text color="primary">+5355565758</ion-text>
                <ion-checkbox></ion-checkbox>
              </div>
            </ion-card-header>
            <ion-card-content (click)="openEditModal(item, i)">
              <ion-text class="sms-body">
                {{ item }}
              </ion-text>
              <ion-label class="sms-date"> 14/04/2023 13:49 </ion-label>
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
              <ion-label class="sms-date"> 14/04/2023 13:49 </ion-label>
            </ion-card-content>
          </ion-card>
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
              <ion-input
                type="text"
                [value]="currentEditingText"
                [(ngModel)]="currentEditingText"
              ></ion-input>
            </ion-item>
          </ion-content>
        </ng-template>
      </ion-modal>
      <!-- <h1>Recibidos</h1>
      {{ receivedSMS$ | async | json }}
      <hr />
      <h1>Enviados</h1>
      {{ sentSMS$ | async | json }} -->
    </ion-content>
  `,
  styleUrls: ['./sms-list.component.scss'],
  standalone: true,
  imports: [IonicModule, NgFor, JsonPipe, AsyncPipe, NgIf, FormsModule],
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

  constructor(
    private smsService: SmsService,
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
        const contactPhone = this.smsService.checkCountryCode(
          params.get('phone')!
        );
        const sms = this.smsService.getReceivedSMS(contactPhone);
        sms.then((s) => console.log(s));
        return this.smsService.getReceivedSMS(contactPhone);
      })
    );

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

  openEditModal(smsText: any, smsIndex: any) {
    this.isModalOpen = true;
    this.currentEditingIndex = smsIndex;
    this.oldSmsText = smsText;
    this.currentEditingText = smsText;
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
      console.log('entroo');
      this.smsPruebaR[ev.detail.data!.smsIndex] = ev.detail.data!.smsText;
      this.oldSmsText = ev.detail.data!.smsText;
    }
    this.isModalOpen = false;
  }
}
