import { EventEmitter, Injectable } from '@angular/core';
import { Document } from './document.model';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
      .get('http://localhost:3000/documents')
      .subscribe((documents: Document[]) => {
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
      });
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

    this.http
      .delete('http://localhost:3000/documents/' + document.id)
      .subscribe((response) => {
        this.documents.splice(pos, 1);
        let documentsListClone = this.documents.slice();
        // this.documentListChangedEvent.next(documentsListClone);
        this.storeDocuments(documentsListClone);
      });
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
    newDocument.id = '';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http
      .post<{ message: string; document: Document }>(
        'http://localhost:3000/documents',
        newDocument,
        { headers: headers }
      )
      .subscribe((responseData) => {
        this.documents.push(responseData.document);
        let documentsListClone = this.documents.slice();
        // this.documentListChangedEvent.next(documentsListClone);
        this.storeDocuments(documentsListClone);
      });
    // this.maxDocumentId++;
    // newDocument.id = this.maxDocumentId.toString();
    // this.documents.push(newDocument);
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) return;
    let pos = this.documents.indexOf(originalDocument);
    if (pos < 0) return;
    newDocument.id = originalDocument.id;
    // newDocument._id = originalDocument._id
    const headers = new HttpHeaders({ 'Content-Type': 'application.json' });
    this.http
      .put(
        'http://localhost:3000/documents/' + originalDocument.id,
        newDocument,
        { headers: headers }
      )
      .subscribe((response) => {
        this.documents[pos] = newDocument;
        let documentsListClone = this.documents.slice();
        // this.documentListChangedEvent.next(documentsListClone);
        this.storeDocuments(documentsListClone);
      });
  }
}
