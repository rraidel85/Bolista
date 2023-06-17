import { Component, Input, Output, inject } from '@angular/core';
import { AsyncPipe, DatePipe, NgFor, NgIf, NgStyle } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { SMSObject } from 'capacitor-sms-inbox';
import { EventEmitter } from '@angular/core';
import { ListsService } from 'src/app/shared/services/lists.service';
import { ErrorDirective } from '../../directives/sms-error.directive';
import { BetError } from 'src/app/shared/classes/list-exception.class';
import { ToastController } from '@ionic/angular';
import { BolistaDbService } from 'src/app/services/bolista-db.service';

@Component({
  selector: 'app-sms',
  standalone: true,
  template: `
    <ion-card [ngStyle]="{ border: validationError ? '1px solid red' : '' }">
      <ion-card-header>
        <div class="card-header">
          <ion-text style="font-weight: bold;" color="primary">{{ sms.address }}</ion-text>
          <ion-checkbox
            [checked]="isChecked"
            [disabled]="validationError"
            (ionChange)="onCheckboxChange($event)"
          ></ion-checkbox>
        </div>
      </ion-card-header>
      <ion-card-content (click)="openModal()">
        <ion-text class="sms-body" appError [badBets]="this.smsErrors">
          {{ sms.body }}
        </ion-text>
        <div class="ion-card-content-footer">
          <ion-label class="sms-date">
            {{ sms.date | date : "d 'de' MMMM, y h:mm a" }}</ion-label
          >
          <ion-icon *ngIf="validationError" name="warning-outline"></ion-icon>
        </div>
      </ion-card-content>
    </ion-card>
  `,
  styleUrls: ['./sms.component.scss'],
  imports: [
    IonicModule,
    AsyncPipe,
    NgIf,
    FormsModule,
    NgFor,
    NgStyle,
    ErrorDirective,
    DatePipe,
  ],
})
export class SmsComponent {
  listService = inject(ListsService);
  toastController = inject(ToastController);
  dbService = inject(BolistaDbService);

  @Input() sms!: SMSObject;
  @Output() modalOpen = new EventEmitter<undefined>();
  @Output() checkedSms = new EventEmitter<SMSObject>();
  @Output() uncheckedSms = new EventEmitter<SMSObject>();

  isChecked!: boolean;
  validationError: boolean = false;
  smsErrors: BetError[] = [];

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Error: Revise la apuesta',
      duration: 2000,
      position: 'top',
      cssClass: 'error-toast',
      icon: 'warning-outline',
    });

    await toast.present();
  }

  openModal() {
    this.modalOpen.emit();
  }

  async onCheckboxChange(event: any) {
    if (event.target.checked) {
      try {
        await this.listService.validateMessage(this.sms.body);
        // There is no error in message validation
        this.checkedSms.emit(this.sms);
      } catch (error: any) {
        // If there is error on the sms disable checkbox and add error styles
        this.isChecked = false;
        this.validationError = true;
        this.smsErrors = error.badBets;
        this.presentToast();
      }
    } else {
      this.uncheckedSms.emit(this.sms);
    }
  }
}
