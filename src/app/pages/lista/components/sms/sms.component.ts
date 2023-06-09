import { Component, Input, Output, inject } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { CheckboxCustomEvent, IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { SMSObject } from 'capacitor-sms-inbox';
import { EventEmitter } from '@angular/core';
import { ListsService } from 'src/app/shared/services/lists.service';

@Component({
  selector: 'app-sms',
  standalone: true,
  template: `
    <ion-card>
      <ion-card-header>
        <div class="card-header">
          <ion-text color="primary">+5355565758</ion-text>
          <ion-checkbox
            [disabled]="validationError"
            (ionChange)="onCheckboxChange($event)"
          ></ion-checkbox>
        </div>
      </ion-card-header>
      <ion-card-content (click)="openModal()">
        <ion-text class="sms-body">
          {{ sms }}
        </ion-text>
        <div class="ion-card-content-footer">
          <ion-label class="sms-date"> 14/04/2023 13:49 </ion-label>
          <ion-icon *ngIf="validationError" name="warning-outline"></ion-icon>
        </div>
      </ion-card-content>
    </ion-card>
  `,
  styleUrls: ['./sms.component.scss'],
  imports: [IonicModule, AsyncPipe, NgIf, FormsModule],
})
export class SmsComponent {
  listService = inject(ListsService);

  @Input() sms!: { smsList: SMSObject[] };
  @Output() modalOpen = new EventEmitter<undefined>();

  validationError: boolean = false;

  testSms =
    '17-25,21-30,27-100,77-100,72,38,83,82,21,22,60,06,23-20,00a99-16,70a79-100,08-100,00a99-50,01-300,01a91-50,77-100,62-30,60a69-5,00a99-5,33-10,66-5,16-5,10,19,07,72,37,70,69,71,17,06,65-10,89,62,34,33-5,98-20,60a69-6,33,82-50,00a99-20,62,08-';

  openModal() {
    this.modalOpen.emit();
  }

  onCheckboxChange(event: any) {
    if (event.target.checked) {
      try {
        console.log(this.listService.validateList(this.testSms));
      } catch (error) {
        console.log(error)
      }
    }
  }
}
