import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UtilService } from 'app/core/services/utils/util.service';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.component.html'
})
export class TermsConditionsComponent  {
  
  innerHtml = '';
  constructor(public dialogRef: MatDialogRef<TermsConditionsComponent>,
    public utils: UtilService) {}
  
  ngOnInit() {
    this.utils.termsInnerHtml
    .pipe(
      tap((res) => this.innerHtml = res)
    )
    .subscribe()
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
