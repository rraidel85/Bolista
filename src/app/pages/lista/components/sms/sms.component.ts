import { Component, Input, Output, inject } from '@angular/core';
import { AsyncPipe, NgFor, NgIf, NgStyle } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { SMSObject } from 'capacitor-sms-inbox';
import { EventEmitter } from '@angular/core';
import { ListsService } from 'src/app/shared/services/lists.service';
import { ErrorDirective } from '../../directives/sms-error.directive';
import { BetError } from 'src/app/shared/classes/list-exception.class';

@Component({
  selector: 'app-sms',
  standalone: true,
  template: `
    <ion-card [ngStyle]="{'border': validationError ? '1px solid red' : ''}">
      <ion-card-header>
        <div class="card-header">
          <ion-text color="primary">+5355565758</ion-text>
          <ion-checkbox
            [checked]="isChecked"
            [disabled]="validationError"
            (ionChange)="onCheckboxChange($event)"
          ></ion-checkbox>
        </div>
      </ion-card-header>
      <ion-card-content (click)="openModal()">
        <p class="sms-body" appError [badBets]="this.smsErrors">
          {{ sms }}
        </p>
        <div class="ion-card-content-footer">
          <ion-label class="sms-date"> 14/04/2023 13:49 </ion-label>
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
  ],
})
export class SmsComponent {
  listService = inject(ListsService);

  @Input() sms!: { smsList: SMSObject[] };
  @Output() modalOpen = new EventEmitter<undefined>();

  isChecked!: boolean;
  validationError: boolean = false;
  smsErrors: BetError[] = [];

  openModal() {
    this.modalOpen.emit();
  }

  onCheckboxChange(event: any) {
    if (event.target.checked) {
      try {
        this.listService.validateMessage(this.sms);
      } catch (error: any) {
        this.isChecked = false;
        this.validationError = true;
        this.smsErrors = error.badBets;
        console.log(this.smsErrors);

      }
    }
  }
}
