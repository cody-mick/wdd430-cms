import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css'],
})
export class MessageEditComponent implements OnInit {
  currentSender: string = 'Cody Mickelsen';
  @ViewChild('subject', { static: false }) subjectRef: ElementRef;
  @ViewChild('msgText', { static: false }) msgTextRef: ElementRef;
  @Output() addMessageEvent = new EventEmitter<Message>();

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {}

  onSendMessage() {
    const msgSubject = this.subjectRef.nativeElement.value;
    const msgText = this.msgTextRef.nativeElement.value;
    const newMessage = new Message(
      '1',
      msgSubject,
      msgText,
      this.currentSender
    );
    this.messageService.addMessage(newMessage);
  }

  onClear() {
    this.subjectRef.nativeElement.value = '';
    this.msgTextRef.nativeElement.value = '';
  }
}
