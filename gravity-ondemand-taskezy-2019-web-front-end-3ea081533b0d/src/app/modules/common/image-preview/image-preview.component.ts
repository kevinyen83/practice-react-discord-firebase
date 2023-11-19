import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UtilService } from 'app/core/services/utils/util.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-image-preview',
  templateUrl: './image-preview.component.html'
})
export class ImagePreviewComponent {

  constructor(public dialogRef: MatDialogRef<ImagePreviewComponent>,
    public utils: UtilService, @Inject(MAT_DIALOG_DATA) public data: any) {

    }

  ngOnInit() { }

  closeDialog() {
    this.dialogRef.close();
  }
}
