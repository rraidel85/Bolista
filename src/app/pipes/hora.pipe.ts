import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hora',
  standalone: true
})
export class HoraPipe implements PipeTransform {
  transform(value: string | null): string {
    if(value){
    const [date,time]=value.split(',')
    const [horas, minutos,segundos]=time.trim().split(':')
    const amPm = +horas >= 12 ? 'pm' : 'am';
    const hora12h = +horas % 12 || 12;

    return `${hora12h}:${minutos}.${segundos} ${amPm}`;
  }
  return ''
  }
}