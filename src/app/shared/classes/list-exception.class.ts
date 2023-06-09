export class ListException extends Error {
    constructor(
        message:string,
        public badBets?:BetError[]
    ) {
        super(message)
    }   
}

export interface BetError{
    message:string
    start:number
    end:number
}