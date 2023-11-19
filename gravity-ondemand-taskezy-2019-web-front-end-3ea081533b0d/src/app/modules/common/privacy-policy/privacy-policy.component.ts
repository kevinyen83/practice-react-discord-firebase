import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UtilService } from 'app/core/services/utils/util.service';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html'
})
export class PrivacyPolicyComponent {

  innerHtml = '';
  constructor(public dialogRef: MatDialogRef<PrivacyPolicyComponent>,
    public utils: UtilService) {}
  
  ngOnInit() {
    this.utils.privacyInnerHtml
    .pipe(
      tap((res) => this.innerHtml = res)
    )
    .subscribe()
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
