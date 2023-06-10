import { Injectable } from '@angular/core';
import { Bet, Pick } from '../interfaces/picks.interface';
import { BetError, ListException } from '../classes/list-exception.class';
import { ListElementsService } from 'src/app/services/list-elements.service';
import { ListElement } from 'src/app/models/list-element.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ListsService {
  private list_elements: ListElement[] = [];
  // private listRegExp: listRegExpp=/(((\d{2},)*\d{2}|(\d{3},)*\d{3}|[(](\d{2},){2}\d{2}[)]|\d{2}con\d{2}|\d{2}al?\d{2}|\d{3}al?\d{3})-\d+,|\d{2}-\d+-\d+c,)*(((\d{2},)*\d{2}|(\d{3},)*\d{3}|[(](\d{2},){2}\d{2}[)]|\d{2}con\d{2}|\d{2}al?\d{2}|\d{3}al?\d{3})-\d+|\d{2}-\d+-\d+c)/g
  private listRegExp: RegExp =
    /(pa(s|c)e )?(((\d{2},)*\d{2}|(\d{3},)*\d{3}|[(](\d{2},){2}\d{2}[)]|\d{2}con\d{2}|\d{1,2}al?\d{1,2}|\d{3}al?\d{3})-\d+,|\d{2}-\d+-\d+c,)*/gi;
  private betRegExp: RegExp =
    /^(pa(s|c)e )?(((\d{2},)*\d{2}|(\d{3},)*\d{3}|[(](\d{2},){2}\d{2}[)]|\d{2}con\d{2}|\d{1,2}al?\d{1,2}|\d{3}al?\d{3})-\d+|\d{2}-\d+-\d+c)$/gi;
  private allowedChars: RegExp = /^[0123456789(),alcon\-pasce ]+$/i;

  constructor(private listElementsService: ListElementsService) {}

  validateMessage(message: any): void {
    const badBets: BetError[] = [];

    const matches = message.match(this.listRegExp);
    if (!matches) {
      throw new ListException('Lista Invalida');
    } else {
      const bets = this.tansformMessage(message);
      for (const betObj of bets) {
        const bet = betObj.bet;
        const [first, ...rest]: string[] = bet.split('-');
        const picks = first.match(/^pa(s|c)e /i)
          ? first.replace(/^pa(s|c)e /i, '')
          : first;
        if (!bet.match(this.betRegExp)) {
          if (!bet.match(this.allowedChars)) {
            badBets.push(
              this.handleErrors(
                'Error: Caracter extraño',
                betObj.start,
                betObj.end
              )
            );
          } else {
            let pickList: string[] = [];
            if (picks.match(/(al?)|con/)) {
              let pickss = picks.replace('con', ',');
              pickss = pickss.replace('al', ',');
              pickss = pickss.replace('a', ',');
              pickList = pickss.split(',');
              if (pickList.length !== 2) {
                badBets.push(
                  this.handleErrors(
                    'Error: Revise la apuesta',
                    betObj.start,
                    betObj.end
                  )
                );
                continue;
              }
            } else if (picks.match(/^\(.*\)$/)) {
              let pickss = picks.replace('(', '').replace(')', '');
              pickList = pickss.split(',');
              if (pickList.length !== 3) {
                badBets.push(
                  this.handleErrors(
                    'Error: Revise la apuesta',
                    betObj.start,
                    betObj.end
                  )
                );
                continue;
              }
            } else {
              pickList = picks.split(',');
            }
            let pickError = false;
            let currentSize: number = pickList[0].length;
            for (let pick of pickList) {
              if (pick.match(/[con]|[al]/) || pick.length === 0) {
                break;
              } else if (!pick.match(/^\d{1,3}$/)) {
                badBets.push(
                  this.handleErrors(
                    'Error: Número invalido encontrado',
                    betObj.start,
                    betObj.end
                  )
                );
                pickError = true;
                break;
              } else if (pick.length !== currentSize) {
                badBets.push(
                  this.handleErrors(
                    'Error: Números con cantidad de cifras diferentes',
                    betObj.start,
                    betObj.end
                  )
                );
                pickError = true;
                break;
              }
            }
            if (!pickError) {
              badBets.push(
                this.handleErrors(
                  'Error: Revise la apuesta',
                  betObj.start,
                  betObj.end
                )
              );
            }
          }
        } else {
          const pickList: string[] = picks.split(',');
          const existing: string[] = [];
          for (let pick of pickList) {
            if (pick.match(/al?/)) {
              const [startN, endN, ...resto]: string[] = pick.split(/al?/);
              const asd: string[] = pick.split(/al?/);

              const start = '0'.repeat(3 - startN.length) + startN;
              const end = '0'.repeat(3 - endN.length) + endN;
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
              badBets.push(
                this.handleErrors(
                  'Error: Serie invalida',
                  betObj.start,
                  betObj.end
                )
              );
            }
            if (existing.includes(pick)) {
              badBets.push(
                this.handleErrors(
                  'Error: Números repetidos',
                  betObj.start,
                  betObj.end
                )
              );
            }

            existing.push(pick);
          }
        }
      }
      if (badBets.length !== 0) {
        throw new ListException('Se encontraron errores', badBets);
      }
    }
  }

  processMessage(messages: string[],grupo:number): void {
    let list: ListElement[] = [];
    let allMessages: string = messages
      .map((message) => {
        if (message[message.length - 1] !== ',') return message + ',';
        return message;
      })
      .join();

    const bets = this.tansformMessage(allMessages);

    this.addList(bets,grupo).subscribe();
  }
  private addList(bets: Bet[],grupo:number): Observable<void> {
    let currentPrice: string = '';
    bets.forEach((betObj) => {
      const bet = betObj.bet;
      const [first, ...prices]: string[] = bet.split('-');
      let pase = false
      let picks=''
      if (first.match(/^pa(s|c)e /i)) {
        picks = first.replace(/^pa(s|c)e /i, '');
        pase = true;
      } else {
         picks = first;
      }
      // if is corrido
      if (prices[1] && prices[1].includes('c')) {
        this.addToNumbers(picks, prices[0],pase, prices[1].replace('c', ''));
      }
      // if is candado || con
      else if (picks.includes('(') || picks.includes('con')) {
        this.addToNumbers(picks, prices[0],pase);
      } else if (picks.includes('a')) {
        const [start, end]: string[] = picks.replace('l', '').split('a');
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
          this.addToNumbers(pick, prices[0],pase);
        });
      } else {
        const separatedPicks: string[] = picks.split(',');
        separatedPicks.forEach((pick) => {
          this.addToNumbers(pick, prices[0],pase);
        });
      }
    });
    of(this.listElementsService.createMany(this.list_elements, grupo)).subscribe();
    return of();
  }

  private addToNumbers(pick: string, prices: string,pase:boolean, corrido?: string): void {
    const exists = this.list_elements.filter(
      (element) => element.pick === pick
    );
    if (exists.length > 0) {
      const index = this.list_elements.indexOf(exists[0]);
      if (pase) {
        this.list_elements[index].price += 0;
        if (this.list_elements[index].pase) {
          this.list_elements[index].pase! += +prices;
        } else {
          this.list_elements[index].pase = +prices;
        }
      }else{
        this.list_elements[index].price += +prices;
      }
      this.list_elements[index].amount += 1;
      if (corrido) {
        if (this.list_elements[index].corrido) {
          this.list_elements[index].corrido! += +corrido;
        } else {
          this.list_elements[index].corrido = +corrido;
        }
      }
      
    } else {
      const element: ListElement = {
        pick,
        price: pase? 0:+prices,
        amount: 1,
      };
      if (corrido) {
        element.corrido = +corrido;
      }if (pase) {
        element.pase = +prices;
      }
      this.list_elements.push(element);
    }
  }

  private tansformMessage(message: string): Bet[] {
    const bets: Bet[] = [];
    let currentBet: string = '';
    let dashFound: boolean = false;
    let start = 0;
    let end = 0;
    for (let index = 0; index < message.length; index++) {
      const char = message[index];
      if (!dashFound && char === '-') {
        dashFound = true;
      } else if (dashFound && char === ',') {
        bets.push({ bet: currentBet, start, end: index });
        start = index + 1;
        currentBet = '';
        dashFound = false;
        continue;
      }
      currentBet += char;
    }
    if (currentBet !== '')
      bets.push({ bet: currentBet, start, end: message.length });
    return bets;
  }

  private handleErrors(message: string, start: number, end: number): BetError {
    return {
      message,
      start,
      end,
    };
  }
}
