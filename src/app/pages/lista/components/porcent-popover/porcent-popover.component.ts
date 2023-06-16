import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, PopoverController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-porcent-popover',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  template: `
    <button ion-button fill="clear" class="porcent-button" [id]="buttonId">
      {{ selectedPercent || 0 }}%
    </button>
    <ion-popover [trigger]="buttonId">
      <ng-template>
        <ion-content class="ion-padding" scrolleable="false">
          <ion-item fill="outline">
            <ion-label position="stacked">Porcentaje</ion-label>
            <ion-input
              type="number"
              min="0"
              max="100"
              inputmode="numeric"
              placeholder="Ingrese el %"
              #percentInput
            ></ion-input>
          </ion-item>
          <div class="button-group">
            <ion-button fill="clear" color="danger" (click)="cancelPopover()"
              >Cancelar</ion-button
            >
            <ion-button
              fill="clear"
              color="success"
              (click)="acceptPopover(percentInput.value)"
              >Aceptar</ion-button
            >
          </div>
        </ion-content>
      </ng-template>
    </ion-popover>
  `,
  styleUrls: ['./porcent-popover.component.scss'],
})
export class PorcentPopoverComponent {
  @Input() buttonId!: string;
  @Output() emitPercent = new EventEmitter<number>();

  selectedPercent: number = 0;

  constructor(private popoverController: PopoverController) {}

  async cancelPopover() {
    await this.popoverController.dismiss();
  }

  acceptPopover(percent: any) {
    if (percent) {
      this.selectedPercent = percent;  
    } else {
      this.selectedPercent = 0;
    }
    this.emitPercent.emit(this.selectedPercent);
    this.popoverController.dismiss();
  }
}
