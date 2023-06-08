import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, PopoverController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-porcent-popover',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  template: `
    <button ion-button fill="clear" class="porcent-button" [id]="buttonId">
      {{ porcentajeSeleccionado || 0 }}%
    </button>
    <ion-popover [trigger]="buttonId">
      <ng-template>
        <ion-content class="ion-padding">
          <ion-item fill="outline">
            <ion-label position="floating">Porcentaje</ion-label>
            <ion-input
              type="number"
              min="0"
              max="100"
              inputmode="numeric"
              [(ngModel)]="porcentajeSeleccionado"
              placeholder="Ingrese el %"
            ></ion-input>
          </ion-item>
          <div class="button-group">
            <ion-button fill="clear" color="danger" (click)="cancelPopover()"
              >Cancelar</ion-button
            >
            <ion-button fill="clear" color="success" (click)="acceptPopover()"
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
  porcentajeSeleccionado: number = 0;

  constructor(private popoverController: PopoverController) {}

  async cancelPopover() {
    await this.popoverController.dismiss();
  }

  acceptPopover() {
    const porcentButton = document.getElementById('porcent-button');
    if (porcentButton) {
      porcentButton.textContent = `${this.porcentajeSeleccionado}%`;
    }
    this.popoverController.dismiss();
  }
}
