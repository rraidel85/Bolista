import { Component, OnInit } from '@angular/core';
import { HoraService } from 'src/app/services/hora.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent  implements OnInit {

  horaActual!: string;
 
  constructor(private horaService: HoraService) {}
  

  ngOnInit() {
    this.horaService.obtenerHoraActual().subscribe(
      hora => this.horaActual = hora
    );
  }

}
