import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

import { tap } from 'rxjs/operators';
import { Subject, takeUntil } from 'rxjs';

import { DocumentsService } from '../../../../core/services/documents/documents.service';

export const FILE_ACCESS_READ = 0;
export const FILE_ACCESS_WRITE = 1;
export const FILE_ACCESS_DELETE = 2;

@Component({
  selector: 'app-choose-files',
  templateUrl: './choose-files.component.html'
})
export class ChooseFilesComponent implements OnInit {
  @Output() saveFiles = new EventEmitter<any>();
  @Input() accept;
  @Input() isDisable;
  @Input() currentAccount;
  @Input() subAccountUUID;

  private unsubscribeAll = new Subject();

  constructor(private documentsService: DocumentsService) {}

  ngOnInit(): void {}

  onFileChange(event: any) {
    let files: FileList = event.target.files;
    if(files?.length > 0) {
      this.uploadFile(files);
    }
  }

  onFileDrop(event: any) {
    let dataItems = Array.from(event);
    let sendable = []; 

    if(this.accept) {
      const accepts = this.accept
      .toLowerCase()
      .split(',')
      .map((accept) => {
        return accept.split('/').map((part) => part.trim());
      })
      .filter((acceptParts) => acceptParts.length === 2);
      const predicate = (item: DataTransferItem) => {
        const [
          typeMain,
          typeSub
        ] = item.type
          .toLowerCase()
          .split('/')
          .map((s) => s.trim());
  
        for (const [
          acceptMain,
          acceptSub
        ] of accepts) {
          // Look for an exact match, or a partial match if * is accepted, eg image/*.
          if (typeMain === acceptMain && (acceptSub === '*' || typeSub === acceptSub)) {
            return true;
          }
        }
        return false;
      };
  
      sendable = dataItems.filter(predicate);
    } else {
      sendable = dataItems
    }


    if(sendable?.length > 0) {
      this.uploadFile(sendable);
    }
  }

  uploadFile(files) {
    if(this.isDisable) {
      this.saveFiles.emit({ files })
    } else {
      const data = new FormData();
      data.append('file', files[0]);
      this.documentsService
        .getFilesUpload(data)
        .pipe(
          tap(async (res: any) => {
          const accountList = [
            {
              access: FILE_ACCESS_WRITE,
              uuid: this.currentAccount?.uuid 
            }
          ]
          if(this.subAccountUUID) {
            accountList.push({
              access: FILE_ACCESS_WRITE,
              uuid: this.subAccountUUID
            })
          }
        
           await this.documentsService.handleAccessDocument(res.filename, {
              accounts: accountList
            }).toPromise()
    
            this.saveFiles.emit({files, res});
          })
          // takeUntil(this.unsubscribeAll)
        )
        .subscribe();
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }
}
