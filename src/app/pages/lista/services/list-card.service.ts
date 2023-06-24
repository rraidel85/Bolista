import { Injectable, inject } from '@angular/core';
import { BolistaDbService } from 'src/app/services/bolista-db.service';
import { BehaviorSubject, switchMap, from } from 'rxjs';
import { ListTotal } from '../interfaces/list-total.interface';

@Injectable({
  providedIn: 'root',
})
export class ListCardService {
  dbService = inject(BolistaDbService);

  private totalDaySubject = new BehaviorSubject<number>(1);
  private totalNightSubject = new BehaviorSubject<number>(2);

  listDayTotal$ = this.totalDaySubject.asObservable().pipe(
    switchMap((group: number) => from(this.getTotalLista(group))),
  );

  listNightTotal$ = this.totalNightSubject.asObservable().pipe(
    switchMap((group: number) => from(this.getTotalLista(group))),
  );

  updateListDayTotal(group: number) {
    this.totalDaySubject.next(group);
  }

  updateListNightTotal(group: number) {
    this.totalNightSubject.next(group);
  }

  private async getTotalLista(group: number): Promise<ListTotal> {
    const list_elements = await this.dbService.mDb.query(
      `select * from list_elements WHERE grupo=${group}`
    );

    const totalMoney = list_elements.values?.reduce((accumulator, obj) => {
      const price = obj?.price || 0;
      const corrido = obj?.corrido || 0;
      const pase = obj?.pase || 0;
      return accumulator + price + corrido + pase;
    }, 0);

    const totalPases = list_elements.values
      ?.filter((list_element) => !!list_element.pase)
      .map((obj) => obj.pase)
      .reduce((accumulator, price) => accumulator + price, 0);

    return { totalMoney, totalPases };
  }
}
