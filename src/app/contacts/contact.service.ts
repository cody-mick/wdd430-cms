import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  contactSelectedEvent = new EventEmitter<Contact>();
  // contactChangedEvent = new EventEmitter<Contact[]>();

  contactListChangedEvent = new Subject<Contact[]>();

  contacts: Contact[] = [];

  maxContactId: number;

  constructor(private http: HttpClient) {
    // this.contacts = MOCKCONTACTS;
    this.maxContactId = this.getMaxId();
  }

  getContacts() {
    // return this.contacts.slice();
    return this.http
      .get('https://wdd430-cms-5ecaa-default-rtdb.firebaseio.com/contacts.json')
      .subscribe(
        (contacts: Contact[]) => {
          this.contacts = [...contacts];
          this.maxContactId = this.getMaxId();
          this.contacts.sort((curr, next) => {
            if (curr < next) return -1;
            if (curr > next) return 1;
            return 0;
          });
          let contactsClone = this.contacts.slice();
          this.contactListChangedEvent.next(contactsClone);
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  storeContacts(contacts: Contact[]) {
    const stringifiedContacts = JSON.stringify(this.contacts);
    return this.http
      .put(
        'https://wdd430-cms-5ecaa-default-rtdb.firebaseio.com/contacts.json',
        stringifiedContacts,
        {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        }
      )
      .subscribe(() => {
        let contactsClone = this.contacts.slice();
        this.contactListChangedEvent.next(contactsClone);
      });
  }

  getContact(id: string) {
    for (let i = 0; i < this.contacts.length; i++) {
      // if (this.contacts[i].id === id) return this.contacts[i];
      const element = this.contacts[i];
      if (element.id === id) {
        return element;
      }
    }
    return null;
  }

  deleteContact(contact: Contact) {
    if (!contact) {
      return;
    }
    const pos = this.contacts.indexOf(contact);
    if (pos < 0) {
      return;
    }
    this.contacts.splice(pos, 1);
    let contactsListClone = this.contacts.slice();
    // this.contactListChangedEvent.next(contactsListClone);
    this.storeContacts(contactsListClone);
  }

  getMaxId(): number {
    let maxId = 0;

    for (let i = 0; i < this.contacts.length; i++) {
      let currentId = parseInt(this.contacts[i].id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  addContact(newContact: Contact) {
    if (!newContact) return;
    this.maxContactId++;
    newContact.id = this.maxContactId.toString();
    this.contacts.push(newContact);
    let contactsListClone = this.contacts.slice();
    // this.contactListChangedEvent.next(contactsListClone);
    this.storeContacts(contactsListClone);
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) return;
    let pos = this.contacts.indexOf(originalContact);
    if (pos < 0) return;
    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;
    let contactsListClone = this.contacts.slice();
    // this.contactListChangedEvent.next(contactsListClone);
    this.storeContacts(contactsListClone);
  }
}
