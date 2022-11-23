import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messageChangedEvent = new EventEmitter<Message[]>();

  messages: Message[] = [];

  maxMessageId: number;

  constructor(private http: HttpClient) {
    // this.messages = MOCKMESSAGES;
  }

  getMessages() {
    // return this.messages.slice();
    return this.http
      .get<{ message: string; messages: Message[] }>(
        'http://localhost:3000/messages'
      )
      .subscribe(
        (response) => {
          this.messages = response.messages;
          this.maxMessageId = this.getMaxId();
          this.messages.sort((curr, next) => {
            if (curr < next) return -1;
            if (curr > next) return 1;
            return 0;
          });
          let messagesClone = this.messages.slice();
          this.messageChangedEvent.next(messagesClone);
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  storeMessages(messages: Message[]) {
    const stringifiedMessages = JSON.stringify(this.messages);
    return this.http
      .put(
        'https://wdd430-cms-5ecaa-default-rtdb.firebaseio.com/messages.json',
        stringifiedMessages,
        {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        }
      )
      .subscribe(() => {
        let documentsClone = this.messages.slice();
        this.messageChangedEvent.next(documentsClone);
      });
  }

  getMessage(id: string) {
    for (let i = 0; i < this.messages.length; i++) {
      // if (this.messages[i].id === id) return this.messages[i];
      const element = this.messages[i];
      if (element.id === id) {
        return element;
      }
    }
    return null;
  }

  addMessage(message: Message) {
    if (!message) return;
    message.id = '';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http
      .post('http://localhost:3000/messages', message, { headers: headers })
      .subscribe((responseData) => {
        this.messages.push(message);
        // this.messageChangedEvent.emit(this.messages.slice());
        this.storeMessages(this.messages.slice());
      });
  }

  getMaxId(): number {
    let maxId = 0;
    for (let i = 0; i < this.messages.length; i++) {
      let currentId = parseInt(this.messages[i].id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }
}
