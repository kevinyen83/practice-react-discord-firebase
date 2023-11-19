import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';

import { VenuesService } from "../../../core/services/venues/venues.service";

@Component({
  selector: 'app-accreditations-content',
  templateUrl: './accreditations-content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccreditationsContentComponent implements OnInit {
  selectedLicences = [];
  _listAccreditations = [];
  @Input() set listAccreditations(value) {
    if (value) {
      this._listAccreditations = value;
    }
  };
  @Input() type;
  @Input() set currentAccreditations(value) {
    if (value) {
      this.selectedLicences = [];
      value.forEach(ac => {
        this.selectedLicences.push({
          type: ac.type,
          names: JSON.parse(ac.data)
        });
      });
      this.venuesService.selectedLicences = this.selectedLicences;
    }
  };
  @Output() sendAccreditations = new EventEmitter<any>();

  constructor(private venuesService: VenuesService) { }

  ngOnInit(): void {
  }

  // changeSelected(type, name) {
  //   this.selectedLicences.forEach((licence, index) => {
  //     if (licence.type === type) {
  //       if (!licence.names.length || licence.names.length === 1) {
  //         this.selectedLicences.splice(index, 1);
  //       }
  //       if (licence.names.length > 1) {
  //         licence.names = licence.names.filter(n => n !== name);
  //       }
  //     }
  //   });
  //   // this.rosterService.selectedLicences.next(this.selectedLicences);
  //
  // }

  removeLicence(type, name) {
    this.selectedLicences.forEach((licence, index) => {
      if (licence.type === type) {
        let foundedName = licence.names.find(n => n.label === name.label);
        if (foundedName) {
          licence.names = licence.names.filter(n => n.label !== name.label);
          this.selectedLicences.splice(index, 1);
        }
      }
    });
    this.venuesService.updateLicences.next({type, name});
  }

  sendAccreditation(event) {
    this.selectedLicences = event;
  }

  confirmAccreditations() {
    this.sendAccreditations.emit(this.selectedLicences);
    // this.rosterService.confirmedLicences = this.selectedLicences;
  }

}
