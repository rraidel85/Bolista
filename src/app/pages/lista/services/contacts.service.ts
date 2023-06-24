import { Injectable, inject } from '@angular/core';
import { SmsService } from './sms.service';
import {
  GetContactsOptions,
  Contacts,
  ContactPayload,
  PhonePayload,
} from '@capacitor-community/contacts';
import { BolistaDbService } from 'src/app/services/bolista-db.service';
import { BehaviorSubject, Observable, from, map, switchMap, tap } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  smsService = inject(SmsService);
  dbService = inject(BolistaDbService);

  cancelSignal!: AbortController;

  private contactOptions: GetContactsOptions = {
    projection: {
      name: true,
      phones: true,
    },
  };

  private contactsSubject = new BehaviorSubject<boolean>(true);

  contacts$: Observable<ContactPayload[]> = this.contactsSubject
    .asObservable()
    .pipe(
      switchMap((fromDb: boolean) => {
        if (fromDb) {
          return from(this.getContactsFromDb()).pipe(
            tap((contacts) => {
              console.log('desde el pipeline', contacts)
              if (contacts.length === 0) {
                this.contactsSubject.next(false);
              }
            }),
            map((contacts) => {
              const newContacts = contacts.map((contact: any) => {
                console.log('desde el map del pipeline', contact)
                const newContact: ContactPayload = {
                  contactId: contact.contactId,
                  name: {
                    display: contact.name,
                    given: null,
                    middle: null,
                    family: null,
                    prefix: null,
                    suffix: null,
                  },
                  phones: [contact.phones],
                };
                return newContact;
              });
              return newContacts;
            })
          );
        } else {
          return from(this.getContactsWithSms()).pipe(
            tap(() => {
              this.contactsSubject.next(true);
            })
          );
        }
      })
    );

  async getContactsWithSms(): Promise<ContactPayload[]> {
    console.log('Ejecutando getContactsWithSms');
    const returnedContacts = await Contacts.getContacts(this.contactOptions);
    const contactsWithSms: ContactPayload[] = [];

    const filteredContacts = returnedContacts.contacts
      // .slice(10, 50)
      .filter((contact) => !!contact.phones) // Exclude contacts with no phone number
      .map((contact) => {
        // Remove dashes and remove white spaces from phone numbers
        const contactPhonesWithCleanFormat: PhonePayload[] =
          contact.phones!.map((phone) => {
            const phonesWithCleanFormat = phone.number
              ?.replace(/-/g, '')
              .replace(/\s/g, '')
              .trim();
            return { ...phone, number: phonesWithCleanFormat! };
          });
        return { ...contact, phones: contactPhonesWithCleanFormat };
      })
      .map((contact) => {
        // Remove duplicated phone numbers
        const filteredPhonesPayload = new Set();
        const uniqueContactPhones: PhonePayload[] =
          contact.phones!.filter((phone) => {
            if (filteredPhonesPayload.has(phone.number)) {
              return false;
            } else {
              filteredPhonesPayload.add(phone.number);
              return true;
            }
          });
        return { ...contact, phones: uniqueContactPhones };
      })
      .filter((contact) => {
        // Remove not valid contact that has only phone numbers with less than 8 digits
        const validPhones: PhonePayload[] = contact.phones!.filter(
          (phone) => phone.number?.length! >= 8
        );
        if (validPhones.length > 0) {
          return true;
        } else {
          return false;
        }
      })
      .map((contact) => {
        // Remove not valid phone numbers from contacts with vali phones
        const validPhones: PhonePayload[] = contact.phones!.filter(
          (phone) => phone.number?.length! >= 8
        );
        return { ...contact, phones: validPhones };
      })
      .sort(
        (a, b) => a.name?.display?.localeCompare(b.name?.display || '') || 0
      ); // Order contacs alphabetically

    this.cancelSignal = new AbortController();

    for (const contact of filteredContacts) {
      if (this.cancelSignal.signal.aborted) {
        throw new Error('Operación cancelada');
      }

      const phoneForReceivingSms = this.smsService.checkCountryCode(
        contact.phones[0].number!
      );
      const phoneForSentSms = contact.phones[0].number!;

      const hasSmsForReceiving = await this.smsService.hasSms(
        phoneForReceivingSms
      );
      const hasSmsForSent = await this.smsService.hasSms(phoneForSentSms);

      if (hasSmsForReceiving || hasSmsForSent) {
        contactsWithSms.push(contact);
      }
    }

    await this.saveContactsInDb(contactsWithSms);

    return contactsWithSms;
  }

  async getContactsFromDb(): Promise<any> {
    console.log('Ejecutando getContactsFromDb');
    this.cancelSignal = new AbortController();
    const contacts = await this.dbService.mDb.query(`select * from contactos`);
    console.log('Desde el getContactsfromDb',contacts)
    return contacts.values;
  }

  async saveContactsInDb(contacts: ContactPayload[]) {
    console.log(contacts![0]);
    await this.dbService.mDb.execute(`DELETE FROM contactos`);

    for (const contact of contacts) {
      await this.dbService.mDb.execute(
        `INSERT INTO contactos (contactId,name,phones) VALUES ('${
          contact.contactId
        }','${contact.name!.display}','${contact.phones![0].number}')`
      );
    }
  }
}
