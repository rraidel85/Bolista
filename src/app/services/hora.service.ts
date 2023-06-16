import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HoraService {
  horaActual!: string;

  constructor(private http: HttpClient) { }

  obtenerHoraActual(): Observable<string> {
    /* const a=new Date()
    const value=a.toLocaleString('es-ES',{
      timeZone:'America/Havana'
    })
    console.log(value);
    const [date,time]=value.split(',')
    const [horas, minutos,segundos]=time.trim().split(':')
    const amPm = +horas >= 12 ? 'pm' : 'am';
    const hora12h = +horas % 12 || 12;
    console.log(time.replace(' ',''));
    console.log(`${hora12h}:${+minutos < 10 ? '0' : ''}${minutos}:${+segundos < 10 ? '0' : ''}${segundos} ${amPm}`); */
    
    
    /* return interval(1000) // Intervalo de 1 segundo (puedes ajustarlo según tus necesidades)
      .pipe(
        switchMap(() => this.http.get('http://worldtimeapi.org/api/timezone/Cuba', {
          headers: {
            'accept': 'application/json'
          }
        })),
        map((respuesta: any) => respuesta.datetime)
      ); */
      return interval(1000) // Intervalo de 1 segundo (puedes ajustarlo según tus necesidades)
      .pipe(
        switchMap(() => of(new Date().toLocaleString('es-ES',{
          timeZone:'America/Havana'
        })))
      )
      
  }

  establecerHoraActual(hora: string) {
    this.horaActual = hora;
  }
}