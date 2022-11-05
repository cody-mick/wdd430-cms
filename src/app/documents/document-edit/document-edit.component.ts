import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';

@Component({
  selector: 'cms-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.css'],
})
export class DocumentEditComponent implements OnInit {
  id: number;
  originalDocument: Document;
  document: Document;
  editMode: boolean = false;

  constructor(
    private documentService: DocumentService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      if (!this.id) {
        this.editMode = false;
        return;
      }
      this.originalDocument = this.documentService.getDocument(
        this.id.toString()
      );
      if (!this.originalDocument) return;
      this.editMode = true;
      this.document = { ...this.originalDocument };
    });
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    console.log(value);
    const newDocument = new Document(
      '55',
      value.name,
      value.description,
      value.url,
      []
    );

    if (this.editMode) {
      this.documentService.updateDocument(this.originalDocument, newDocument);
    } else {
      this.documentService.addDocument(newDocument);
    }
    this.router.navigate(['/documents']);
  }

  onCancel() {
    this.router.navigate(['/documents']);
  }
}
