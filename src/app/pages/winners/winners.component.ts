import { Component, OnInit } from '@angular/core';
import { HoraService } from 'src/app/services/hora.service';

@Component({
  selector: 'app-winners',
  templateUrl: './winners.component.html',
  styleUrls: ['./winners.component.scss'],
})
export class WinnersComponent  implements OnInit {
  horaActual!: string;

  constructor(private horaService: HoraService) { }

  ngOnInit() { this.horaService.obtenerHoraActual().subscribe(
    hora => this.horaActual = hora
  );}
}
