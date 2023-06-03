import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HoraService {
  horaActual!: string;

  constructor(private http: HttpClient) { }

  obtenerHoraActual(): Observable<string> {
    return interval(1000) // Intervalo de 1 segundo (puedes ajustarlo según tus necesidades)
      .pipe(
        switchMap(() => this.http.get('http://worldtimeapi.org/api/timezone/Cuba', {
          headers: {
            'accept': 'application/json'
          }
        })),
        map((respuesta: any) => respuesta.datetime)
      );
  }

  establecerHoraActual(hora: string) {
    this.horaActual = hora;
  }
}