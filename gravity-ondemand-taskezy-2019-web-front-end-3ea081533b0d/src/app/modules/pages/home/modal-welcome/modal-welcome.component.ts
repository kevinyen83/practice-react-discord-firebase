import { Component, OnInit } from '@angular/core';

import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-modal-welcome',
  templateUrl: './modal-welcome.component.html'
})
export class ModalWelcomeComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ModalWelcomeComponent>) { }

  ngOnInit(): void {
  }

  closeModal() {
    this.dialogRef.close();
  }

}
