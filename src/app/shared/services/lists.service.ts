import { Injectable } from '@angular/core';
import { Bet, Pick } from '../interfaces/picks.interface';
import { BetError, ListException } from '../classes/list-exception.class';
import { ListElementsService } from 'src/app/services/list-elements.service';
import { ListElement } from 'src/app/models/list-element.model';
import { Observable, of } from 'rxjs';
import { Detail } from 'src/app/pages/lista/interfaces/details.interface';

@Injectable({
  providedIn: 'root',
})
export class ListsService {
  private list_elements: ListElement[] = [];
  // private listRegExp: listRegExpp=/(((\d{2},)*\d{2}|(\d{3},)*\d{3}|[(](\d{2},){2}\d{2}[)]|\d{2}con\d{2}|\d{2}al?\d{2}|\d{3}al?\d{3})-\d+,|\d{2}-\d+-\d+c,)*(((\d{2},)*\d{2}|(\d{3},)*\d{3}|[(](\d{2},){2}\d{2}[)]|\d{2}con\d{2}|\d{2}al?\d{2}|\d{3}al?\d{3})-\d+|\d{2}-\d+-\d+c)/g
  // private listRegExp: RegExp =
  //   /(pa(s|c)e )?(((\d{2},)*\d{2}|(\d{3},)*\d{3}|[(](\d{2},){2}\d{2}[)]|\d{2}con\d{2}|\d{1,2}al?\d{1,2}|\d{3}al?\d{3})-\d+,|\d{2}-\d+-\d+c,)*/gi;
  // private listRegExp: RegExp =
  //   /(pa(s|c)e )?(((\d{1,2},)*\d{1,2}|(\d{3},)*\d{3}|\(\d{1,2},\d{1,2},\d{1,2}\)|\d{1,2}con\d{1,2}|\d{1,2}al?\d{1,2}|\d{3}al?\d{3})-\d+,|\d{1,2}-\d+-\d+c,)*/gi;
  private listRegExp: RegExp =
    /(pa(s|c)e )?(((((\d{1,2})(al?\d{1,2})?),)*((\d{1,2})(al?\d{1,2})?)|(((\d{3})(al?\d{3})?),)*((\d{3})(al?\d{3})?)|\(\d{1,2},\d{1,2},\d{1,2}\)|\d{1,2}con\d{1,2})-\d+,|\d{1,2}-\d+-\d+c,)*/gi; // private betRegExp: RegExp =
  //   /^(pa(s|c)e )?(((\d{2},)*\d{2}|(\d{3},)*\d{3}|[(](\d{2},){2}\d{2}[)]|\d{2}con\d{2}|\d{1,2}al?\d{1,2}|\d{3}al?\d{3})-\d+|\d{2}-\d+-\d+c)$/gi;
  // private betRegExp: RegExp =
  //   /^(pa(s|c)e )?(((\d{1,2},)*\d{1,2}|(\d{3},)*\d{3}|\(\d{1,2},\d{1,2},\d{1,2}\)|\d{1,2}con\d{1,2}|\d{1,2}al?\d{1,2}|\d{3}al?\d{3})-\d+|\d{1,2}-\d+-\d+c)$/gi;
  private betRegExp: RegExp =
    /^(pa(s|c)e )?(((((\d{1,2})(al?\d{1,2})?),)*((\d{1,2})(al?\d{1,2})?)|(((\d{3})(al?\d{3})?),)*((\d{3})(al?\d{3})?)|\(\d{1,2},\d{1,2},\d{1,2}\)|\d{1,2}con\d{1,2})-\d+|\d{1,2}-\d+-\d+c)$/gi;
  private allowedChars: RegExp = /^[0123456789(),alcon\-pasce ]+$/i;

  constructor(private listElementsService: ListElementsService) {}

  validateMessage(message: string): Promise<any> {
    const badBets: BetError[] = [];
    /*  console.log('asd');
    const noSpaces = this.removeSpaces(message);
    console.log(noSpaces); */

    const matches = message.match(this.listRegExp);
    // console.log(matches);

    if (!matches) {
      throw new ListException('Lista Invalida');
    } else {
      const bets = this.tansformMessage(message);
      // console.log(bets);

      for (const betObj of bets) {
        const bet = betObj.bet;
        const [first, ...rest]: string[] = bet.split('-');
        let picks= first;
        if(first.match(/^pa(s|c)e /i)){
          picks = first.replace(/^pa(s|c)e /i, '')
          if(+rest[0]>99999||(rest[1]&&+rest[1]>99999)){
            badBets.push(
              this.handleErrors(
                'Error: Cantidad de dinero invalida',
                betObj.start,
                betObj.end
              )
            );
          }
        }else if(+rest[0]>999||(rest[1]&&+rest[1]>999)){
          badBets.push(
            this.handleErrors(
              'Error: Cantidad de dinero invalida',
              betObj.start,
              betObj.end
            )
          );
        }else if (!bet.match(this.betRegExp)) {
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
            if (picks.match(/^\(.*\)$/)) {
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
            let currentSize: number =
              pickList[0].length === 1 ? 2 : pickList[0].length;
            for (let elem of pickList) {
              const pick = elem.length === 1 ? '0' + elem : elem;
              if (pick.length === 0) {
                break;
              } else if (pick.match(/(al?)|con/)) {
                let pickss = pick.replace('con', ',');
                pickss = pickss.replace('al', ',');
                pickss = pickss.replace('a', ',');
                const size = pickss.split(',').length;
                if (size !== 2) {
                  badBets.push(
                    this.handleErrors(
                      'Error: Revise la apuesta',
                      betObj.start,
                      betObj.end
                    )
                  );
                }
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

              const start = '0'.repeat(3 - startN.length) + startN;
              const end = '0'.repeat(3 - endN.length) + endN;
              const diff = +end - +start;
              console.log(diff);
              
              if (diff > 0) {
                if (
                  (diff % 100 === 0 &&
                    diff !== 100 &&
                    start.slice(1) === end.slice(1)) ||
                  
                  (diff % 10 === 0 &&
                    diff !== 10 &&
                    start.slice(2) === end.slice(2) &&
                    start.slice(0, 1) === end.slice(0, 1)) ||
                  (diff % 11 === 0 &&
                    diff !== 11 &&
                    start[0] === end[0] &&
                    start[1] === start[2] &&
                    end[1] === end[2])||
                    (diff < 99)
                  // (start[0] === '0' && end[0] === '0')
                ) {
                  continue;
                }
              }
              badBets.push(
                this.handleErrors(
                  'Error: Serie invalida',
                  betObj.start,
                  betObj.end
                )
              );
            }
            /* if (existing.includes(pick)) {
              badBets.push(
                this.handleErrors(
                  'Error: Números repetidos',
                  betObj.start,
                  betObj.end
                )
              );
            }

            existing.push(pick); */
          }
        }
      }
      if (badBets.length !== 0) {
        console.log(badBets);

        throw new ListException('Se encontraron errores', badBets);
      }
    }
    return new Promise((resolve, reject) => resolve(null));
  }

  async processMessage(messages: string[], grupo: number): Promise<void> {
    let list: ListElement[] = [];
    let allMessages: string = messages
      .map((message) => {
        if (message[message.length - 1] !== ',') return message + ',';
        return message;
      })
      .join('');

    const bets = this.tansformMessage(allMessages);

    return await this.addList(bets, grupo);
  }

  listToText(pases: Detail[], numbers: Detail[]): string {
    let message = '';
    pases.forEach((element) => {
      message += `Pase ${element.pick}-${element.price}`;
      if (element.corrido) {
        message += `-${element.corrido}c`;
      }
      message += ',';
    });
    numbers.forEach((element) => {
      message += `${element.pick}-${element.price}`;
      if (element.corrido) {
        message += `-${element.corrido}c`;
      }
      message += ',';
    });

    return message;
  }
  private addList(bets: Bet[], grupo: number): Promise<void> {
    let currentPrice: string = '';
    bets.forEach((betObj) => {
      const bet = betObj.bet;
      const [first, ...prices]: string[] = bet.split('-');
      let pase = false;
      let picks = '';
      if (first.match(/^pa(s|c)e /i)) {
        picks = first.replace(/^pa(s|c)e /i, '');
        pase = true;
      } else {
        picks = first;
      }
      // if is corrido
      if (prices[1] && prices[1].includes('c')) {
        this.addToNumbers(
          picks.length == 1 ? '0' + picks : picks,
          prices[0],
          pase,
          prices[1].replace('c', '')
        );
      }
      // if is candado || con
      else if (picks.includes('(') || picks.includes('con')) {
        this.addToNumbers(
          picks.length == 1 ? '0' + picks : picks,
          prices[0],
          pase
        );
        /* } else 

        serieNumbers.forEach((pick) => {
          this.addToNumbers(pick, prices[0], pase);
        }); */
      } else {
        const separatedPicks: string[] = picks.split(',');

        separatedPicks.forEach((pick) => {
          if (pick.includes('a')) {
            const [start, end]: string[] = pick.replace('l', '').split('a');
            const serieNumbers: string[] = [];
            const diff = +end - +start;
            console.log(start);
            
            let step = 1;
            if (diff % 100 === 0&&diff!==100) step = 100;
            else if (diff % 11 === 0&&diff!==11) step = 11;
            else if (diff % 10 === 0&&diff!==10) step = 10;
            for (let i = 0; i < diff + 1; i += step) {
              let nextNumber = +start + i;
              let stringedNumber = '0'.repeat(start.length-nextNumber.toString().length)+ nextNumber.toString();
              console.log(start.length);
              console.log('0'.repeat(3 - start.length));
              console.log(stringedNumber);
              if (stringedNumber.length === 1) {
                stringedNumber = '0' + stringedNumber;
              }
              serieNumbers.push(stringedNumber);
            }
            serieNumbers.forEach((pick) => {
              this.addToNumbers(
                pick.length == 1 ? '0' + pick : pick,
                prices[0],
                pase
              );
            });
          } else {
            this.addToNumbers(
              pick.length == 1 ? '0' + pick : pick,
              prices[0],
              pase
            );
          }
        });
      }
    });
    return this.listElementsService
      .createMany(this.list_elements, grupo)
      .then(() => {
        this.list_elements = [];
      });
  }

  private addToNumbers(
    pick: string,
    prices: string,
    pase: boolean,
    corrido?: string
  ): void {
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
      } else {
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
        price: pase ? 0 : +prices,
        amount: 1,
      };
      if (corrido) {
        element.corrido = +corrido;
      }
      if (pase) {
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

  removeSpaces(message: string): string {
    let trimedString = '';
    let newString = '';
    const messg = message.trim();

    for (let i = 0; i < messg.length; i++) {
      const char = messg[i];
      if (char === ' ') {
        const after = message[i + 1];
        if (after !== ' ') {
          trimedString += char;
        }
      } else {
        trimedString += char;
      }
    }
    for (let i = 0; i < trimedString.length; i++) {
      const char = trimedString[i];
      if (char === ' ') {
        const before = trimedString[i - 1];
        const after = trimedString[i + 1];
        if (after && before) {
          if (before.match(/^\d|c$/) && after.match(/^p$/i)) {
            newString += ',';
          } else if (before.match(/^e$/i) && after.match(/^\d$/)) {
            newString += char;
          }
        }
      } else {
        newString += char;
      }
    }

    return newString;
  }
}
