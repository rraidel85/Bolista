import { Component, OnInit } from '@angular/core';
import { HoraService } from 'src/app/services/hora.service';

@Component({
  selector: 'app-detail-option',
  templateUrl: './detail-option.component.html',
  styleUrls: ['./detail-option.component.scss'],
})
export class DetailOptionComponent  implements OnInit {

  horaActual!: string;
 
  constructor(private horaService: HoraService) {}
  

  ngOnInit() {
    this.horaService.obtenerHoraActual().subscribe(
      hora => this.horaActual = hora
    );
  }

}
