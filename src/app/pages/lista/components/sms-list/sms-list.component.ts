import { Component, OnInit, ViewChild, inject, OnDestroy } from '@angular/core';
import { IonModal, IonicModule, ToastController } from '@ionic/angular';
import { SmsService } from '../../services/sms.service';
import { AsyncPipe, JsonPipe, NgFor, NgIf } from '@angular/common';
import { SMSObject } from 'capacitor-sms-inbox';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription, map, switchMap, tap } from 'rxjs';
import { OverlayEventDetail } from '@ionic/core/components';
import { ModalSmsDataDismiss } from '../../models/modal-sms-data-dismiss.model';
import { FormsModule } from '@angular/forms';
import { SmsComponent } from '../sms/sms.component';
import { BolistaDbService } from 'src/app/services/bolista-db.service';
import { ListsService } from '../../../../shared/services/lists.service';
import { ListCardService } from '../../services/list-card.service';

@Component({
  selector: 'app-sms-list',
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Mensajes</ion-title>
        
      </ion-toolbar>
      <ion-segment style=""
        [swipeGesture]="true"
        value="received"
        (ionChange)="segmentChanged($event)"
      >
        <ion-segment-button value="received">
          <ion-label>Recibidos</ion-label>
          <ion-icon name="mail-unread"></ion-icon>
        </ion-segment-button>
        <ion-segment-button value="sent">
          <ion-label>Enviados</ion-label>
          <ion-icon name="paper-plane"></ion-icon>
        </ion-segment-button>
      </ion-segment>
      
    </ion-header>

    <ion-content [fullscreen]="true">
     
      <ng-container *ngIf="selectedSegment === 'received'">
        <ng-container *ngIf="receivedSMS$ | async as receivedSMS">
        <ion-button slot="fixed"
            *ngIf="receivedSMS.smsList.length !== 0"
            class="ion-margin-top importar-button"
            expand="block"
            [disabled]="smsToImport.length === 0"
            (click)="importSmsList()"
          >
            Importar
          </ion-button>
          
          <ng-container *ngIf="receivedSMS.smsList.length !== 0; else noSms">
            <ion-list style="background:var(--ion-color-light);">
              <app-sms
                (modalOpen)="openEditModal(sms, i)"
                (checkedSms)="onCheckedSms($event)"
                (uncheckedSms)="onUnCheckedSms($event)"
                *ngFor="let sms of receivedSMS.smsList; index as i"
                [sms]="sms"
              ></app-sms>
            </ion-list>
          </ng-container>
        </ng-container>
      </ng-container>

      <ng-container *ngIf="selectedSegment === 'sent'">
        <ng-container *ngIf="sentSMS$ | async as sentSMS">
          <ion-button slot="fixed"
            *ngIf="sentSMS.smsList.length !== 0"
            class="ion-margin-top importar-button"
            expand="block"
            [disabled]="smsToImport.length === 0"
            (click)="importSmsList()"
          >
            Importar
          </ion-button>
          <ng-container *ngIf="sentSMS.smsList.length !== 0; else noSms">
            <ion-list style="background:var(--ion-color-light);">
              <ng-container *ngIf="sentSMS$ | async as sentSMS">
                <app-sms
                  (modalOpen)="openEditModal(sms, i)"
                  (checkedSms)="onCheckedSms($event)"
                  (uncheckedSms)="onUnCheckedSms($event)"
                  *ngFor="let sms of sentSMS.smsList; index as i"
                  [sms]="sms"
                ></app-sms>
              </ng-container>
            </ion-list>
          </ng-container>
        </ng-container>
      </ng-container>

      <ion-modal
        [isOpen]="isModalOpen"
        (willDismiss)="onWillDismiss($event)"
        class="auto-height"
      >
        <ng-template>
          <ion-header>
            <ion-toolbar>
              <ion-title class="modal-title">Editar</ion-title>
            </ion-toolbar>
          </ion-header>
          <div class="ion-padding">
            <ion-item>
              <ion-textarea
                type="text"
                [(ngModel)]="currentEditingSms.body"
                rows="10"
              >
              </ion-textarea>
            </ion-item>

            <div class="modal-buttons">
              <ion-button
                fill="clear"
                color="danger"
                slot="start"
                (click)="cancel()"
                >Cancelar</ion-button
              >
              <ion-button
                fill="clear"
                color="success"
                slot="end"
                (click)="confirm()"
                >Aceptar</ion-button
              >
            </div>
          </div>
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
export class SmsListComponent implements OnInit, OnDestroy {
  dbService = inject(BolistaDbService);
  smsService = inject(SmsService);
  route = inject(ActivatedRoute);
  listService = inject(ListsService);
  listCardService = inject(ListCardService);
  router = inject(Router);
  toastController = inject(ToastController);

  selectedSegment: string = 'received';
  receivedSMS$!: Observable<{ smsList: SMSObject[] }>;
  sentSMS$!: Observable<{ smsList: SMSObject[] }>;
  currentEditingIndex!: number;
  currentEditingSms!: SMSObject; // Current sms in editing input and value saved after done edit
  oldSms!: SMSObject; // Old sms before editing in case user cancel edit
  isModalOpen: boolean = false;
  smsReceivedSubscription!: Subscription;
  smsSentSubscription!: Subscription;
  smsToImport: SMSObject[] = [];
  group!: number;
  groupSuscription!: Subscription;
  @ViewChild(IonModal) modal!: IonModal;

  ngOnInit(): void {
    // Received SMS
    this.receivedSMS$ = this.route.paramMap.pipe(
      switchMap((params) => {
        const contactPhone = this.smsService.checkCountryCode(
          params.get('phone')!
        );
        return Promise.all([
          this.smsService.getReceivedSMS(contactPhone),
          this.smsService.getAllSmsFromDB(),
        ]);
      }),
      map(([smsPhoneList, smsDbList]) => {
        if (smsDbList) {
          smsDbList.values!.forEach((smsDb) => {
            const index = smsPhoneList.smsList.findIndex(
              (smsPhone) => smsPhone.id === smsDb.sms_id
            );
            if (index !== -1) {
              smsPhoneList.smsList[index].body = smsDb.body;
            }
          });
        }
        return smsPhoneList;
      }),
      map((smsPhoneList) => {
        const smsListWithoutSpaces = smsPhoneList.smsList.map((sms) =>{
          const smsWithoutSpaces = this.listService.removeSpaces(sms.body)
          return {...sms, body: smsWithoutSpaces}
        });
        return {smsList: smsListWithoutSpaces};
      })
    );

    // Sent SMS
    this.sentSMS$ = this.route.paramMap.pipe(
      switchMap((params) => {
        const contactPhone = params.get('phone')!;
        return Promise.all([
          this.smsService.getSentSMS(contactPhone),
          this.smsService.getAllSmsFromDB(),
        ]);
      }),
      map(([smsPhoneList, smsDbList]) => {
        if (smsDbList) {
          smsDbList.values!.forEach((smsDb) => {
            const index = smsPhoneList.smsList.findIndex(
              (smsPhone) => smsPhone.id === smsDb.sms_id
            );
            if (index !== -1) {
              smsPhoneList.smsList[index].body = smsDb.body;
            }
          });
        }
        return smsPhoneList;
      }),
      map((smsPhoneList) => {
        const smsListWithoutSpaces = smsPhoneList.smsList.map((sms) =>{
          const smsWithoutSpaces = this.listService.removeSpaces(sms.body)
          return {...sms, body: smsWithoutSpaces}
        });
        return {smsList: smsListWithoutSpaces};
      })
    );

    this.groupSuscription = this.route.queryParams.subscribe((params) => {
      this.group = Number(params['group']);
    });

    this.smsToImport = []; // Reset sms checkboxes on component start
  }

  segmentChanged(event: any) {
    this.smsToImport = []; // Resetting smsToimport list in changing segments 
    this.selectedSegment = event.target.value;
  }

  openEditModal(sms: SMSObject, smsIndex: number) {
    this.isModalOpen = true;
    this.currentEditingIndex = smsIndex; //Index for edit smsList array with change from editInputModal
    this.oldSms = { ...sms }; //Old sms in case user press Cancel button on modal
    this.currentEditingSms = { ...sms }; //sms to populate modal input value
  }

  cancel() {
    this.isModalOpen = false;
  }

  confirm() {
    if (this.currentEditingSms.body.trim() !== '') {
      const dismissData: ModalSmsDataDismiss = {
        sms: this.currentEditingSms,
        smsIndex: this.currentEditingIndex,
      };
      this.modal.dismiss(dismissData, 'confirm');
    }
    else{
      this.presentToast();
    }
  }

  async onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<ModalSmsDataDismiss>>;
    if (ev.detail.role === 'confirm') {
      const smsBodyWithoutSpaces = this.listService.removeSpaces(ev.detail.data!.sms.body);
      const noSpacesSms: SMSObject = {...ev.detail.data!.sms, body: smsBodyWithoutSpaces}

      await this.smsService.saveOrUpdate(noSpacesSms);

      if (this.selectedSegment === 'received') {
        this.receivedSMS$ = this.receivedSMS$.pipe(
          tap((ret) => {
            ret.smsList[ev.detail.data!.smsIndex] = noSpacesSms;
            this.oldSms = noSpacesSms; // Update oldText with new text
          })
        );
      } else if (this.selectedSegment === 'sent') {
        this.sentSMS$ = this.sentSMS$.pipe(
          tap((ret) => {
            ret.smsList[ev.detail.data!.smsIndex] = noSpacesSms;
            this.oldSms = noSpacesSms; // Update oldText with new text
          })
        );
      }
    }
    this.isModalOpen = false;
  }

  onCheckedSms(sms: SMSObject) {
    this.smsToImport = [...this.smsToImport, sms];
  }

  onUnCheckedSms(sms: SMSObject) {
    const newSmsList = this.smsToImport.filter(
      (element) => sms.id != element.id
    );
    this.smsToImport = [...newSmsList];
  }

  async importSmsList() {
    const smsBodys: string[] = this.smsToImport.map((sms) => sms.body);
    await this.listService.processMessage(smsBodys, this.group);
    if (this.group === 1) {
      this.listCardService.updateListDayTotal(this.group);
    } else if (this.group === 2) {
      this.listCardService.updateListNightTotal(this.group);
    }

    this.router.navigate(['lista']);
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'El mensaje no puede estar vacío',
      duration: 2000,
      position: 'top',
      cssClass: 'error-toast',
      icon: 'warning-outline',
    });

    await toast.present();
  }

  ngOnDestroy(): void {
    this.groupSuscription.unsubscribe();
  }
}
