import { Injectable } from '@angular/core';
import { Pick } from '../interfaces/picks.interface';
import { BetError, ListException } from '../classes/list-exception.class';
import { ListElementsService } from 'src/app/services/list-elements.service';
import { ListElement } from 'src/app/models/list-element.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ListsService {
  private numbers: Pick[] = [];
  // private listRegExp: listRegExpp=/(((\d{2},)*\d{2}|(\d{3},)*\d{3}|[(](\d{2},){2}\d{2}[)]|\d{2}con\d{2}|\d{2}al?\d{2}|\d{3}al?\d{3})-\d+,|\d{2}-\d+-\d+c,)*(((\d{2},)*\d{2}|(\d{3},)*\d{3}|[(](\d{2},){2}\d{2}[)]|\d{2}con\d{2}|\d{2}al?\d{2}|\d{3}al?\d{3})-\d+|\d{2}-\d+-\d+c)/g
  private listRegExp: RegExp =
    /(((\d{2},)*\d{2}|(\d{3},)*\d{3}|[(](\d{2},){2}\d{2}[)]|\d{2}con\d{2}|\d{1,2}al?\d{1,2}|\d{3}al?\d{3})-\d+,|\d{2}-\d+-\d+c,)*/g;
  private betRegExp: RegExp =
    /^(((\d{2},)*\d{2}|(\d{3},)*\d{3}|[(](\d{2},){2}\d{2}[)]|\d{2}con\d{2}|\d{1,2}al?\d{1,2}|\d{3}al?\d{3})-\d+|\d{2}-\d+-\d+c)$/g;
  private allowedChars: RegExp = /^[0123456789(),alcon-]+$/;

  constructor(private listElementsService: ListElementsService) {}

  processMessage(message: string): Observable<ListElement[]>;
  processMessage(messages: string[]): Observable<ListElement[]>;
  processMessage(input: string | string[]): Observable<ListElement[]> {
    let list: ListElement[] = [];
    if (Array.isArray(input)) {
      input.forEach((message) => {
        this.processMessage(message);
      });
    } else if (typeof input === 'string') {
      input = input.trim();
      if (input[input.length - 1] !== ',') input = input + ',';
      //if no errors
      const bets = this.validateList(input);

      //TODO add to database

      this.addToNumbers(bets).then((asd) => {
        this.listElementsService.getAll().then((ret) => {
          list = ret;
          console.log('lista', list.length);
          console.log('lista', list.length);
        });
      });

      //get total income
      // const totalIncome = this.getTotalIncome();
    }

    return of(list);
  }
  async addToNumbers(bets: string[]): Promise<void> {
    let currentPrice: string = '';
    bets.forEach((bet) => {
      const splitted = bet.split('-');
      let picks: string = splitted.shift() as string;
      const prices = splitted;

      // if is corrido
      if (prices[1] && prices[1].includes('c')) {
        const exists = this.numbers.filter((element) => element.pick === picks);
        if (exists.length > 0) {
          const index = this.numbers.indexOf(exists[0]);
          this.numbers[index].price += +prices[0];
          if (this.numbers[index].corrido) {
            this.numbers[index].corrido! += +prices[1].replace('c', '');
          } else {
            this.numbers[index].corrido = +prices[1].replace('c', '');
          }

          this.numbers[index].amount += 1;
        } else {
          this.numbers.push({
            pick: picks,
            price: +prices[0],
            corrido: +prices[1].replace('c', ''),
            amount: 1,
          });
        }
      }
      // if is candado || con
      else if (picks.includes('(') || picks.includes('con')) {
        const exists = this.numbers.filter((pick) => pick.pick === picks);
        if (exists.length > 0) {
          const index = this.numbers.indexOf(exists[0]);
          this.numbers[index].price += +prices[0];
          this.numbers[index].amount += 1;
        } else {
          this.numbers.push({ pick: picks, price: +prices[0], amount: 1 });
        }
      } else if (picks.includes('a')) {
        picks = picks.replace('l', '');
        const [start, end]: string[] = picks.split('a');
        const serieNumbers: string[] = [];
        const diff = +end - +start;
        let step = 1;
        if (diff % 100 === 0) step = 100;
        else if (diff % 11 === 0) step = 11;
        else if (diff % 10 === 0) step = 10;
        for (let i = 0; i < diff + 1; i += step) {
          let nextNumber = +start + i;
          let stringedNumber = nextNumber.toString();
          if (stringedNumber.length === 1) {
            stringedNumber = '0' + stringedNumber;
          }
          serieNumbers.push(stringedNumber);
        }

        serieNumbers.forEach((pick) => {
          const exists = this.numbers.filter(
            (element) => element.pick === pick
          );
          if (exists.length > 0) {
            const index = this.numbers.indexOf(exists[0]);
            this.numbers[index].price += +prices[0];
            this.numbers[index].amount += 1;
          } else {
            this.numbers.push({ pick, price: +prices[0], amount: 1 });
          }
        });
      } else {
        const separatedPicks: string[] = picks.split(',');
        separatedPicks.forEach((pick) => {
          const exists = this.numbers.filter(
            (element) => element.pick === pick
          );
          if (exists.length > 0) {
            const index = this.numbers.indexOf(exists[0]);
            this.numbers[index].price += +prices[0];
            this.numbers[index].amount += 1;
          } else {
            this.numbers.push({ pick, price: +prices[0], amount: 1 });
          }
        });
      }
    });
    // console.log(JSON.stringify(this.numbers));
    await this.listElementsService.createMany(this.numbers);
  }

  private validateList(message: string): string[] {
    const badBets: BetError[] = [];
    let unprocessedBets: string[] = [];
    let bets: string[] = [];

    const matches = message.match(this.listRegExp);
    if (!matches) {
      throw new ListException('Lista Invalida');
    } else if (matches[0] !== message) {
      const difference = message.replace(matches[0], '');
      unprocessedBets = this.tansformMessage(matches[0]);
      bets = this.tansformMessage(difference);
      for (let bet of bets) {
        const betMatches = bet.match(this.betRegExp);

        if (!betMatches) {
          let pickError: boolean = false;
          const splitted = bet.split('-');
          let picks: string = splitted.shift() as string;
          picks = picks.replace('con', ',').replace(/al?/, ',');
          const separatedPicks: string[] = picks.split(',');

          if (!bet.match(this.allowedChars)) {
            badBets.push({
              message: 'Error: Caracter extraño',
              bet,
            });
            continue;
          } else {
            let currentSize: number = separatedPicks[0].length;
            for (let pick of separatedPicks) {
              if (pick.match(/[con]|[al]/) || pick.length === 0) {
                break;
              } else if (!pick.match(/^\d{1,3}$/)) {
                badBets.push({
                  message: 'Error: Número invalido encontrado',
                  bet,
                });
                pickError = true;
                break;
              } else if (pick.length !== currentSize) {
                badBets.push({
                  message: 'Error: Números con cantidad de cifras diferentes',
                  bet,
                });
                pickError = true;
                break;
              }
            }
            if (!pickError) {
              badBets.push({
                message: 'Error: Revise la apuesta',
                bet,
              });
            }
          }
        } else {
          unprocessedBets.push(bet);
        }
      }
    } else {
      unprocessedBets = this.tansformMessage(message);
    }

    unprocessedBets.forEach((bet) => {
      const splitted: string[] = bet.split('-');

      const picks: string[] = splitted.shift()?.split(',') as string[];
      const existing: string[] = [];
      for (let pick of picks) {
        if (pick.match(/al?/)) {
          pick = pick.replace(/al?/, ',');
          const picks = pick.split(',');
          const start = '0'.repeat(3 - picks[0].length) + picks[0];
          const end = '0'.repeat(3 - picks[1].length) + picks[1];
          const diff = +end - +start;

          if (
            (diff % 100 === 0 &&
              diff !== 100 &&
              start.slice(1) === end.slice(1)) ||
            (diff > 1 &&
              diff < 10 &&
              start.slice(0, -1) === end.slice(0, -1)) ||
            (diff % 10 === 0 &&
              diff !== 10 &&
              start.slice(0, 1) + start.slice(2) ===
                end.slice(0, 1) + end.slice(2)) ||
            (diff % 11 === 0 &&
              diff !== 11 &&
              start[0] === end[0] &&
              start[1] === start[2] &&
              end[1] === end[2]) ||
            (start[0] === '0' && end[0] === '0')
          ) {
            continue;
          }

          badBets.push({
            message: 'Error: Serie invalida',
            bet,
          });
        }
        if (existing.includes(pick)) {
          badBets.push({
            message: 'Error: Números repetidos',
            bet,
          });
        }

        existing.push(pick);
      }
    });

    if (badBets.length !== 0) {
      throw new ListException('Se encontraron errores', badBets);
    } else {
      bets = unprocessedBets;
    }

    return bets;
  }

  private tansformMessage(message: string): string[] {
    const bets: string[] = [];
    let currentBet: string = '';
    let dashFound: boolean = false;
    for (let index = 0; index < message.length; index++) {
      const element = message[index];
      if (!dashFound && element === '-') {
        dashFound = true;
      } else if (dashFound && element === ',') {
        bets.push(currentBet);
        currentBet = '';
        dashFound = false;
        continue;
      }
      currentBet += element;
    }

    return bets;
  }

  /*  getTotalIncome(): number {
    let total: number = 0;
    const keys = Object.keys(this.numbers);
    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];
      total += this.numbers[key].price;
      if (this.numbers[key].corrido)
        total += this.numbers[key].corrido as number;
    }
    return total;
  } */
}
