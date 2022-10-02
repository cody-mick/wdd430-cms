import { Component, OnInit } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css'],
})
export class MessageListComponent implements OnInit {
  messages: Message[] = [
    new Message('2', 'Hello There', 'Hello World', 'Angular'),
    new Message('3', 'Hello There', 'Hello World', 'Angular'),
    new Message('4', 'Hello There', 'Hello World', 'Angular'),
    new Message('5', 'Hello There', 'Hello World', 'Angular'),
  ];

  constructor() {}

  ngOnInit(): void {}

  onAddMessage(message: Message) {
    this.messages.push(message);
  }
}
