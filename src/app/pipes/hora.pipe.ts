import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hora'
})
export class HoraPipe implements PipeTransform {
  transform(value: string): string {
    const date = new Date(value);
    const horas = date.getHours();
    const minutos = date.getMinutes();
    const segundos = date.getSeconds();

    const amPm = horas >= 12 ? 'pm' : 'am';
    const hora12h = horas % 12 || 12;

    return `${hora12h}:${minutos < 10 ? '0' : ''}${minutos}.${segundos < 10 ? '0' : ''}${segundos} ${amPm}`;
  }
}