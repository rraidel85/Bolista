import { Component, Input, Output } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import {  IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { SMSObject } from 'capacitor-sms-inbox';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sms',
  standalone: true,
  template: `
    <ion-card>
      <ion-card-header>
        <div class="card-header">
          <ion-text color="primary">+5355565758</ion-text>
          <ion-checkbox></ion-checkbox>
        </div>
      </ion-card-header>
      <ion-card-content (click)="openModal()">
        <ion-text class="sms-body">
          {{ sms }}
        </ion-text>
        <div class="ion-card-content-footer">
          <ion-label class="sms-date"> 14/04/2023 13:49 </ion-label>
          <ion-icon name="warning-outline"></ion-icon>
        </div>
      </ion-card-content>
    </ion-card>
  `,
  styleUrls: ['./sms.component.scss'],
  imports: [IonicModule, AsyncPipe, NgIf, FormsModule],
})
export class SmsComponent {
  @Input() sms!: { smsList: SMSObject[] };

  @Output() modalOpen = new EventEmitter<undefined>();

  openModal() {
    this.modalOpen.emit();
  }
}
