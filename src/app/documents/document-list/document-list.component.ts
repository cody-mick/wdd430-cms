import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css'],
})
export class DocumentListComponent implements OnInit, OnDestroy {
  documents: Document[];
  selectedDocument: Document;
  subscription: Subscription;

  constructor(private documentsService: DocumentService) {}

  ngOnInit() {
    this.documentsService.getDocuments();
    this.subscription =
      this.documentsService.documentListChangedEvent.subscribe(
        (documents: Document[]) => (this.documents = documents)
      );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
