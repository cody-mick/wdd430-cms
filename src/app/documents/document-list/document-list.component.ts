import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css'],
})
export class DocumentListComponent implements OnInit {
  @Output() selectedDocumentEvent = new EventEmitter<Document>();
  documents: Document[] = [
    new Document(
      '1',
      'Test Doc 1',
      'The first test document',
      'www.google.com',
      null
    ),
    new Document(
      '2',
      'Test Doc 2',
      'The second test document',
      'www.byui.edu',
      null
    ),
    new Document(
      '3',
      'Test Doc 3',
      'The third test document',
      'www.walmart.com',
      null
    ),
    new Document(
      '4',
      'Test Doc 4',
      'The fourth test document',
      'www.target.com',
      null
    ),
  ];

  constructor() {}

  ngOnInit(): void {}

  onSelectedDocument(document: Document) {
    this.selectedDocumentEvent.emit(document);
  }
}
