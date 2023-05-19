import { Injectable } from '@angular/core';
import { Picks } from '../interfaces/picks.interface';
import { BetError, ListException } from '../classes/list-exception.class';

@Injectable({
  providedIn: 'root'
})
export class ListsService {


  private numbers: Picks = {}
  // private regex: RegExp=/(((\d{2},)*\d{2}|(\d{3},)*\d{3}|[(](\d{2},){2}\d{2}[)]|\d{2}con\d{2}|\d{2}al?\d{2}|\d{3}al?\d{3})-\d+,|\d{2}-\d+-\d+c,)*(((\d{2},)*\d{2}|(\d{3},)*\d{3}|[(](\d{2},){2}\d{2}[)]|\d{2}con\d{2}|\d{2}al?\d{2}|\d{3}al?\d{3})-\d+|\d{2}-\d+-\d+c)/g
  private regex: RegExp = /(((\d{2},)*\d{2}|(\d{3},)*\d{3}|[(](\d{2},){2}\d{2}[)]|\d{2}con\d{2}|\d{2}al?\d{2}|\d{3}al?\d{3})-\d+,|\d{2}-\d+-\d+c,)*/g
  private regex2: RegExp = /^(((\d{2},)*\d{2}|(\d{3},)*\d{3}|[(](\d{2},){2}\d{2}[)]|\d{2}con\d{2}|\d{2}al?\d{2}|\d{3}al?\d{3})-\d+|\d{2}-\d+-\d+c)$/g
  private allowedChars = '0123456789(),alcon-'

  constructor() { }




  formatMessage(): ListException | boolean {


    const message: string = '22-3,123a423-2334,23al73-34,0r1-34,173-25,21-30,27-34-100c,772-1040,72,3a8,83,82,21,22,60,06,23-20,(23,34,12)-45,23con45-64234,00a99-16,70a79-100,08-100,00a99-50,01-300,01a91-50,77-100,62-30,60a69-5,00a99-5,33-10,66-5,16-5,10,19,07,72,37,70,69,71,17,06,65-10,89,62,34,33-5,98-20,60a69-6,33,82-50,00a99-20,62,08-20,'
    // const message: string = '22'
    const validated = this.validateList(message)
    if (validated.error) {
      return validated.error
    }
    const bets = validated.bets

    //console.log(bets);

    let currentPrice: string = ''
    bets.forEach((bet) => {

      const splitted = bet.split('-')
      const picks: string = splitted.shift() as string
      const prices = splitted



      this.addToNumbers(picks, prices)



    })
    console.log(this.numbers);

    console.log('Message formated')
    return true
  }

  addToNumbers(picks: string, prices: string[]) {

    if (prices[1] && prices[1].includes('c')) {

      this.numbers[picks] = {
        price: +prices[0],
        corrido: +prices[1].replace('c', ''),
        count: 1
      }
    }
    else if (picks.includes('(') || picks.includes('con')) {
      if (this.numbers[picks]) {
        this.numbers[picks].price += +prices[0]
        this.numbers[picks].count += 1
      }
      else {
        this.numbers[picks] = { price: +prices[0], count: 1 }
      }
    }
    else if (picks.includes('a')) {
      picks = picks.replace('l', '')
      const serie: string[] = picks.split('a')
      const serieNumbers: string[] = []
      let start = serie[0]
      let end = serie[1]
      if (start.length === 2) {
        start = '0' + start
        end = '0' + end
      }
      const startN = +start
      const endN = +end
      const firstS = start[0]
      const secondS = start[1]
      const thirdS = start[2]
      const firstE = end[0]
      const secondE = end[1]
      const thirdE = end[2]
      let step = 1
      if (firstS === firstE && secondS === secondE) step = 1
      else if (firstS === firstE && thirdS === thirdE) step = 10
      else if (firstS === firstE && secondS === thirdS && secondE === thirdE) step = 11
      else if (secondS === secondE && thirdS === thirdE) step = 100
      else if (firstS === secondS && secondS === thirdS && firstE === secondE && secondE === thirdE) step = 111

      for (let index = 0; index < endN - startN + 1; index += step) {
        let newNumber = startN + index
        let stringedNumber = newNumber.toString()
        if (stringedNumber.length === 1) {
          stringedNumber = '0' + stringedNumber
        }
        serieNumbers.push(stringedNumber)
      }

      serieNumbers.forEach(pick => {
        if (this.numbers[pick]) {
          this.numbers[pick].price += +prices[0]
          this.numbers[pick].count += 1
        }
        else {
          this.numbers[pick] = { price: +prices[0], count: 1 }
        }
      })


    }
    else {
      const separatedPicks: string[] = picks.split(',')
      separatedPicks.forEach(pick => {
        if (pick.length === 2 || pick.length === 3) {

          if (this.numbers[pick]) {
            this.numbers[pick].price += +prices[0]
            this.numbers[pick].count += 1
          }
          else {
            this.numbers[pick] = { price: +prices[0], count: 1 }
          }

        }
      })
    }

  }


  validateList(message: string): { bets: string[], error?: ListException } {
    const error: ListException = {}
    const badBets: BetError[] = []
    let bets: string[] = []
    //console.log(message.match(this.regex))
    const matches = message.match(this.regex)
    if (!matches) {
      return { bets }
    }
    else if (matches[0] !== message) {
      const difference = message.replace(matches[0], '')
      bets = this.tansformMessaje(difference)
      //console.log(bets);
      
      for (let index = 0; index < bets.length; index++) {
        //let asd=false
        const bet = bets[index];
        let asd:boolean = this.regex2.test(bet)
        
        let pickError: boolean = false
        let strangeChar: boolean = false
        if (!asd) {

          console.log('a');
          console.log(bet);
          console.log(this.regex2.test(bet));
          /* const splitted = bet.split('-')
          let picks: string = splitted.shift() as string
          picks = picks.replace('con', ',').replace(/al?/, ',')

          const separatedPicks: string[] = picks.split(',')
          const prices = splitted

          let currentSize: number = 0
          for (let i = 0; i < bet.length; i++) {
            if (!this.allowedChars.includes(bet[i])) {
              badBets.push({
                message: "Error: Caracter extraño",
                bet
              })
              strangeChar = true
              break;
            }
          }

          if (strangeChar) continue;

          for (let pick of separatedPicks) {
            currentSize = pick.length
            if (currentSize > 3) {
              //numero de cuatro cifras
              badBets.push({
                message: "Error: Número invalido encontrado",
                bet
              })
              pickError = true
              break;
            }
            else if (pick.length !== currentSize) {
              //numeros disparejos
              badBets.push({
                message: "Error: Números con cantidad de cifras diferentes",
                bet
              })
              pickError = true
              break;
            }
          }
          if (pickError) {
            continue;
          }

          badBets.push({
            message: "Error: Revise la apuesta",
            bet
          }) */

        }

      }


    }
    else {
      bets = this.tansformMessaje(message)
    }
    console.log(badBets);

    /* bets.forEach(bet => {
      const splitted = bet.split('-')

      const picks: string[] = splitted.shift()?.split(',') as string[]
      const existing: string[] = []
      picks.forEach(pick => {
        if (existing.includes(pick)) {
          repeatedPicks.push(bet)
        }
        existing.push(pick)
      })
    })
    if (repeatedPicks.length !== 0) {
      error.repeatedPicks = repeatedPicks
    }
    if (badBets.length !== 0) {
      error.badBets = badBets
    } */

    return { bets, error }
  }
  tansformMessaje(message: string): string[] {
    const bets: string[] = []
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

    return bets
  }
}
