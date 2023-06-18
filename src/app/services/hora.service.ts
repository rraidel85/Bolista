import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HoraService {
  horaActual!: string;

  constructor(private http: HttpClient) {}

  obtenerHoraActual(): Observable<string> {
    return interval(1000) // Intervalo de 1 segundo (puedes ajustarlo según tus necesidades)
      .pipe(
        switchMap(() =>
          of(
            new Date().toLocaleString('es-ES', {
              timeZone: 'America/Havana',
            })
          )
        )
      );
  }

  establecerHoraActual(hora: string) {
    this.horaActual = hora;
  }
}
