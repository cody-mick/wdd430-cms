import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css'],
})
export class DocumentListComponent implements OnInit {
  documents: Document[] = [];
  selectedDocument: Document;

  constructor(private documentsService: DocumentService) {}

  ngOnInit() {
    this.documents = this.documentsService.getDocuments();
    this.documentsService.documentChangedEvent.subscribe(
      (documents: Document[]) => (this.documents = documents)
    );
  }
}
