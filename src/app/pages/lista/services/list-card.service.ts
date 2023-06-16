import { Injectable, inject } from '@angular/core';
import { BolistaDbService } from 'src/app/services/bolista-db.service';
import { BehaviorSubject, switchMap, from, tap } from 'rxjs';
import { ListTotal } from '../interfaces/list-total.interface';

@Injectable({
  providedIn: 'root',
})
export class ListCardService {
  dbService = inject(BolistaDbService);

  private totalSubject = new BehaviorSubject<number>(0);

  listTotal$ = this.totalSubject.asObservable().pipe(
    switchMap((group: number) => from(this.getTotalLista(group))),
    tap((value) => console.log(value))
  );

  updateListTotal(group: number) {
    this.totalSubject.next(group);
  }

  private async getTotalLista(group: number): Promise<ListTotal> {
    const list_elements = await this.dbService.mDb.query(
      `select * from list_elements WHERE grupo=${group}`
    );

    const totalMoney = list_elements.values
      ?.map((obj) => obj.price)
      .reduce((accumulator, price) => accumulator + price, 0);

    const totalPases = list_elements.values
      ?.filter((list_element) => !!list_element.pase)
      .map((obj) => obj.pase)
      .reduce((accumulator, price) => accumulator + price, 0);

    return { totalMoney, totalPases };
  }
}
