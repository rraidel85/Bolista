export interface Details{
    original:Detail[]
    details:Detail[]
    pase:Detail[]
    pasePlus:Detail[]
}
export interface Detail{
    pick:string
    price:number
    amount:number
    corrido?:number
    pase?:boolean
 }