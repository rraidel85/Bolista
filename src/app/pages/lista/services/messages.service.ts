import { Injectable } from '@angular/core';
import { SMS } from '@awesome-cordova-plugins/sms/ngx';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(private sms: SMS) { }

  getAllSMS(){
    console.log(this.sms);
  }
}
