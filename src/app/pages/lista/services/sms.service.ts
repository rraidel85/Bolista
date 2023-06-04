import { Injectable } from '@angular/core';
import {
  MessageType,
  Projection,
  SMSFilter,
  SMSInboxReader,
  SMSObject,
} from 'capacitor-sms-inbox';

export interface SmsOptions {
  projection?: Projection;
  filter?: SMSFilter;
}

@Injectable({
  providedIn: 'root',
})
export class SmsService {

  private smsProjection: Projection = {
    id: false,
    threadId: false,
  };

  private smsFilters: SMSFilter = {
    maxCount: 10,
  }

  constructor() {}

  getReceivedSMS(contactPhone: string): Promise<{ smsList: SMSObject[] }> {
    const smsOptions: SmsOptions = {
      projection: this.smsProjection,
      filter: {
        ...this.smsFilters,
        type: MessageType.INBOX,
        address: contactPhone
      },
    };
    return SMSInboxReader.getSMSList(smsOptions);
  }

  getSentSMS(contactPhone: string): Promise<{ smsList: SMSObject[] }> {
    const smsOptions: SmsOptions = {
      projection: this.smsProjection,
      filter: {
        ...this.smsFilters,
        type: MessageType.SENT,
        address: contactPhone
      },
    };
    return SMSInboxReader.getSMSList(smsOptions);
  }

  getAllSMS(contactPhone: string): Promise<{ smsList: SMSObject[] }> {
    const smsOptions: SmsOptions = {
      projection: this.smsProjection,
      filter: {
        ...this.smsFilters,
        type: MessageType.ALL,
        address: contactPhone
      },
    };
    return SMSInboxReader.getSMSList(smsOptions);
  }

  checkCountryCode(phoneNumber: string): string{
    if (phoneNumber.startsWith('+')) {
      return phoneNumber;
    } else {
      return '+53' + phoneNumber;
    }
  }
}
