import { Injectable } from '@angular/core';
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
  private contactOptions: GetContactsOptions = {
    projection: {
      name: true,
      phones: true,
    },
  };

  constructor() {}

  async getAllContacts(): Promise<ContactPayload[]> {
    const returnedContacts = await Contacts.getContacts(this.contactOptions);
    
    return (
      returnedContacts.contacts
        // .slice(0, 10)
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
    );
  }
}
