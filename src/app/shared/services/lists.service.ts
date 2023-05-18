import { Injectable } from '@angular/core';
import { Picks } from '../interfaces/picks.interface';

@Injectable({
  providedIn: 'root'
})
export class ListsService {


  private numbers: Picks = {}
  constructor() { }




  formatMessage() {

    const regex: RegExp = /^(((\d{2},)*\d{2}|(\d{3},)*\d{3}|[(](\d{2},){2}\d{2}[)]|\d{2}con\d{2}|\d{2}al?\d{2})-\d+,|\d{2}-\d+-\d+c,)*(((\d{2},)*\d{2}|(\d{3},)*\d{3}|[(](\d{2},){2}\d{2}[)]|\d{2}con\d{2}|\d{2}al?\d{2})-\d+|\d{2}-\d+-\d+c)$/

    const message: string = '123a423-23,23al73-34,01-34,173-25,21-30,27-34-100c,772-100,72,38,83,82,21,22,60,06,23-20,(23,34,12)-45,23con45-64234,00a99-16,70a79-100,08-100,00a99-50,01-300,01a91-50,77-100,62-30,60a69-5,00a99-5,33-10,66-5,16-5,10,19,07,72,37,70,69,71,17,06,65-10,89,62,34,33-5,98-20,60a69-6,33,82-50,00a99-20,62,08-20'
    const bets: string[] = []
    console.log(message.match(regex))
    let currentBet: string = ''
    let dashFound: boolean = false
    for (let index = 0; index < message.length; index++) {
      const element = message[index];
      if (!dashFound && element === '-') {
        dashFound = true;
      }
      else if (dashFound && element === ',') {
        bets.push(currentBet);
        currentBet = '';
        dashFound = false;
        continue;
      }
      currentBet += element;
    }

    console.log(bets);

    let currentPrice: string = ''
    bets.forEach((bet) => {

      const splitted = bet.split('-')
      const picks: string = splitted.shift() as string
      const prices = splitted



      this.addToNumbers(picks, prices)



    })
    console.log(this.numbers);

    console.log('Message formated')
  }

  addToNumbers(picks: string, prices: string[]) {

    if (prices[1] && prices[1].includes('c')) {

      this.numbers[picks] = {
        price: +prices[0],
        corrido: +prices[1].replace('c', '')
      }
    }
    else if (picks.includes('(') || picks.includes('con')) {
      if (this.numbers[picks])
        this.numbers[picks].price += +prices[0]
      else {
        this.numbers[picks] = { price: +prices[0] }
      }
    }
    else if (picks.includes('a')) {
      picks = picks.replace('l', '')
      const serie: string[] = picks.split('a')
      const serieNumbers: string[] = []
      const start = serie[0]
      const end = serie[1]
      const startN = +start
      const endN = +end
      let step = 1
      if (start.length === 2) {
        if (start[0] === end[0]) {
          step = 1
        }
        else if (start[1] === end[1]) {
          step = 10
        }
        else if (start[0] === start[1] && end[0] === end[1]) {
          step = 11
        }
      }
      else {
        if (start[0] === end[0]) {
          step = 10
        }
        else if (start[1] === end[1]) {
          step = 100
        }
        else if (start[0] === start[1] && start[1] === start[2] && end[0] === end[1] && end[1] === end[2]) {
          step = 111
        }
      }
      for (let index = 0; index < endN - startN + 1; index += step) {
        let newNumber = startN + index
        let stringedNumber=newNumber.toString()
        if (stringedNumber.length===1) {
          stringedNumber='0'+stringedNumber
        }
        serieNumbers.push(stringedNumber)
      }

      //console.log('serie: ', serieNumbers)
      serieNumbers.forEach(pick => {
        if (this.numbers[pick])
          this.numbers[pick].price += +prices[0]
        else {
          this.numbers[pick] = { price: +prices[0] }
        }
      })


    }
    else {
      const separatedPicks: string[] = picks.split(',')
      separatedPicks.forEach(pick => {
        if (pick.length === 2 || pick.length === 3) {

          if (this.numbers[pick])
            this.numbers[pick].price += +prices[0]
          else {
            this.numbers[pick] = { price: +prices[0] }
          }

        }
      })
    }

  }
}
