import { EventEmitter, Injectable } from '@angular/core';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { catchError, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DecimalPipe } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  documentSelectedEvent = new EventEmitter<Document>();
  // documentChangedEvent = new EventEmitter<Document[]>();

  documentListChangedEvent = new Subject<Document[]>();

  documents: Document[] = [];

  maxDocumentId: number;

  constructor(private http: HttpClient) {
    // this.documents = this.getDocuments()
    this.maxDocumentId = this.getMaxId();
  }

  getDocuments() {
    return this.http
      .get(
        'https://wdd430-cms-5ecaa-default-rtdb.firebaseio.com/documents.json'
      )
      .subscribe(
        (documents: Document[]) => {
          console.log(documents);
          this.documents = [...documents];
          this.maxDocumentId = this.getMaxId();
          this.documents.sort((curr, next) => {
            if (curr < next) return -1;
            if (curr > next) return 1;
            return 0;
          });
          let documentsClone = this.documents.slice();
          this.documentListChangedEvent.next(documentsClone);
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  storeDocuments(documents: Document[]) {
    const stringifiedDocuments = JSON.stringify(this.documents);
    return this.http
      .put(
        'https://wdd430-cms-5ecaa-default-rtdb.firebaseio.com/documents.json',
        stringifiedDocuments,
        {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        }
      )
      .subscribe(() => {
        let documentsClone = this.documents.slice();
        this.documentListChangedEvent.next(documentsClone);
      });
  }

  getDocument(id: string) {
    for (let i = 0; i < this.documents.length; i++) {
      if (this.documents[i].id === id) return this.documents[i];
    }
    return null;
  }

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }
    const pos = this.documents.indexOf(document);
    if (pos < 0) {
      return;
    }
    this.documents.splice(pos, 1);
    let documentsListClone = this.documents.slice();
    // this.documentListChangedEvent.next(documentsListClone);
    this.storeDocuments(documentsListClone);
  }

  getMaxId(): number {
    let maxId = 0;

    for (let i = 0; i < this.documents.length; i++) {
      let currentId = parseInt(this.documents[i].id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  addDocument(newDocument: Document) {
    if (!newDocument) return;
    this.maxDocumentId++;
    newDocument.id = this.maxDocumentId.toString();
    this.documents.push(newDocument);
    let documentsListClone = this.documents.slice();
    // this.documentListChangedEvent.next(documentsListClone);
    this.storeDocuments(documentsListClone);
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) return;
    let pos = this.documents.indexOf(originalDocument);
    if (pos < 0) return;
    newDocument.id = originalDocument.id;
    this.documents[pos] = newDocument;
    let documentsListClone = this.documents.slice();
    // this.documentListChangedEvent.next(documentsListClone);
    this.storeDocuments(documentsListClone);
  }
}
