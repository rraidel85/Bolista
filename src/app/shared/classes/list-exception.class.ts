export interface ListException {
    badBets?:BetError[]
    /*constructor(
        //public message: string,
         public repeatedPicks?: {
            message:string
            values:string[]
        },
        public badBets?: {
            message:string
            values:string[]
        }
        public repeatedPicks?:string[],
        public badBets?:string[]
    ) {

    } */
}

export interface BetError{
    message:string
    bet:string
}