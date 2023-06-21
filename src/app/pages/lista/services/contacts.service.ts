import { Injectable, inject } from '@angular/core';
import { SmsService } from './sms.service';
import {
  GetContactsOptions,
  Contacts,
  ContactPayload,
  PhonePayload,
} from '@capacitor-community/contacts';

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  smsService = inject(SmsService);
  private contactOptions: GetContactsOptions = {
    projection: {
      name: true,
      phones: true,
    },
  };

  constructor() {}

  async getAllContacts(): Promise<ContactPayload[]> {
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
        const uniqueContactPhones: PhonePayload[] = contact.phones!.filter(
          (phone) => {
            if (filteredPhonesPayload.has(phone.number)) {
              return false;
            } else {
              filteredPhonesPayload.add(phone.number);
              return true;
            }
          }
        );
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

    for (const contact of filteredContacts) {
      const phoneForReceivingSms = this.smsService.checkCountryCode(
        contact.phones[0].number!
      );
      const phoneForSentSms = contact.phones[0].number!;


      const hasSmsForReceiving = await this.smsService.hasSms(
        phoneForReceivingSms
      );
      const hasSmsForSent = await this.smsService.getSmsCount(phoneForSentSms);

      if (hasSmsForReceiving || hasSmsForSent) {
        contactsWithSms.push(contact);
      }
    }
    return contactsWithSms;
  }
}
