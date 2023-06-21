import { Injectable, inject } from '@angular/core';
import { DBSQLiteValues } from '@capacitor-community/sqlite';
import {
  MessageType,
  Projection,
  SMSFilter,
  SMSInboxReader,
  SMSObject,
} from 'capacitor-sms-inbox';
import { BolistaDbService } from 'src/app/services/bolista-db.service';

export interface SmsOptions {
  projection?: Projection;
  filter?: SMSFilter;
}

@Injectable({
  providedIn: 'root',
})
export class SmsService {
  dbService = inject(BolistaDbService);

  tableName = 'sms';

  private smsProjection: Projection = {
    threadId: false,
  };

  private smsFilters: SMSFilter = {
    // maxCount: 10,
  };

  getReceivedSMS(contactPhone: string): Promise<{ smsList: SMSObject[] }> {
    const smsOptions: SmsOptions = {
      projection: this.smsProjection,
      filter: {
        ...this.smsFilters,
        type: MessageType.INBOX,
        address: contactPhone,
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
        address: contactPhone,
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
        address: contactPhone,
      },
    };
    return SMSInboxReader.getSMSList(smsOptions);
  }

  checkCountryCode(phoneNumber: string): string {
    if (phoneNumber.startsWith('+')) {
      return phoneNumber;
    } else {
      return '+53' + phoneNumber;
    }
  }

  async hasSms(contactPhone: string): Promise<boolean>{
    const smsOptions: SmsOptions = {
      projection: this.smsProjection,
      filter: {
        type: MessageType.ALL,
        address: contactPhone,
        maxCount: 1,
      },
    };
    const sms = await SMSInboxReader.getSMSList(smsOptions);
    return sms.smsList.length !== 0;
  }

  async getSmsCount(contactPhone: string): Promise<number>{
    const smsOptions: SmsOptions = {
      filter: {
        type: MessageType.INBOX,
        address: contactPhone,
      },
    };
    const smsCount = await SMSInboxReader.getCount(smsOptions);
    return smsCount.count
  }
  
  // Database Operations -------------------------

  async getAllSmsFromDB(): Promise<DBSQLiteValues | null> {
    try {
      const smsList = await this.dbService.mDb.query(
        `select * from ${this.tableName}`
      );
      return smsList;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async saveOrUpdate(sms: SMSObject) {
    try {
      const smsId = await this.dbService.mDb.query(
        `select * from ${this.tableName} WHERE sms_id=${sms.id}`
      );

      if (smsId.values?.length === 0) {
        // CREATE
        await this.dbService.mDb.execute(
          `INSERT INTO ${this.tableName} (sms_id,body,timestamp ) VALUES (${sms.id}, '${sms.body}', ${sms.date})`
        );
      } else {
        // UPDATE
        await this.dbService.mDb.query(
          `UPDATE sms SET body = '${sms.body}' WHERE ID = ${
            smsId.values![0].id
          };`
        );
      }
    } catch (error) {
      console.log(error);
    }
  }
}
