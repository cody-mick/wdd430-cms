import { Injectable } from '@angular/core';
import { Contact } from './contact.model';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  contacts: Contact[] = [];

  constructor() {}

  getContacts() {
    return this.contacts.slice();
  }

  getContact(id: string) {
    this.contacts.filter((c) => c.id === id);
  }
}
