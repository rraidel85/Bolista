import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { HoraPipe } from 'src/app/pipes/hora.pipe';
import { HoraService } from 'src/app/services/hora.service';

@Component({
  selector: 'app-detail-option',
  templateUrl: './detail-option.component.html',
  styleUrls: ['./detail-option.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, HoraPipe]
})
export class DetailOptionComponent  implements OnInit {

  horaActual!: string;
  tabSeleccionado: string = 'Detalles';
  numberList: any[] = [];
 
  constructor(private horaService: HoraService) {
    for (let i = 0; i < 100; i++) {
      const randomNumber = Math.floor(Math.random() * 400) + 1;
      const index = i.toString().padStart(2, '0');
      const bet = { index, randomNumber };
      this.numberList.push(bet);
    }
  }
  

  ngOnInit() {
    this.horaService.obtenerHoraActual().subscribe(
      hora => this.horaActual = hora
    );
  }

  segmentChanged(event: any){
    this.tabSeleccionado = event.target.value;
  }
}
