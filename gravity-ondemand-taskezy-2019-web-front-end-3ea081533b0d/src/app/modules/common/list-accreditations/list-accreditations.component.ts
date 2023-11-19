import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { VenuesService } from "../../../core/services/venues/venues.service";

@Component({
  selector: 'app-list-accreditations',
  templateUrl: './list-accreditations.component.html'
})
export class ListAccreditationsComponent implements OnInit, AfterViewInit {
  checkboxesForm: FormGroup;
  search: FormControl;
  reserveAccreditations = [];
  selectedLicences = [];
  accreditations = [];
  indexExpanded;

  @Input()
  set listAccreditations(value) {
    if (value) {
      this.accreditations = value;
      this.reserveAccreditations = [...this.accreditations];
      this.buildForm(this.accreditations);
    }
  }
  @Input()
  set selectedLicenses(value) {
    if (value) {
      this.selectedLicences = value;
    }
  };
  @Output() sendAccreditations = new EventEmitter<any>();

  constructor(private venuesService: VenuesService) {
    this.search = new FormControl('');
  }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.venuesService.updateLicences.subscribe((res: any) => {
      this.setValues(res);
    })
  }


  selectLicence(event, type, name) {
    if (event.checked) {
      let names = type.inputs.filter(n => n.label === name);
      let findedLicence = this.selectedLicences.find(l => l.type === type.type);
      if (findedLicence && !findedLicence.names.includes(name)) {
        findedLicence.names.push(name);
        let i = this.selectedLicences.findIndex(l => l.type === findedLicence.type);
        this.selectedLicences.splice(i, 1, findedLicence);
      } else {
        this.selectedLicences.push({
          type: type.accreditation,
          names: names
        });
      }
    }
    if (!event.checked) {
      this.selectedLicences.forEach((licence, index) => {
        if (licence.type === type.accreditation) {
          let foundedName = licence.names?.find(n => n.label === name);
          if (foundedName) {
            licence.names = licence.names?.filter(n => n.label !== name);
            this.selectedLicences.splice(index, 1);
          }
        }
      });
      this.sendAccreditations.emit(this.selectedLicences);
    }
  }

  buildForm(accreditations) {
    this.checkboxesForm = new FormGroup({});
    accreditations.forEach(accred => {
      accred.credentials.forEach(cred => {
        cred.inputs.forEach(type => {
          this.checkboxesForm.addControl(type.label, new FormControl(false));
        });
      })
    });
  }

  setValues(licence?) {
    if (this.accreditations.length > 0) {
      for (let control in this.checkboxesForm.controls) {
        if (control === licence.name.label) {
          this.checkboxesForm.controls[control].patchValue(false);
        }
      }
      this.selectedLicences.forEach(l => {
        l.inputs?.forEach(name => {
          this.checkboxesForm.get(name.label).patchValue(true);
        });
      });
    }
  }

  searchAccreditation() {
    let value = this.search.value.toLowerCase();
    let notDublicate = [];
    this.accreditations.forEach((accred, index) => {
      accred['indexExpanded'] = false;
      if (value) {
        accred.credentials.map(t => {
          t.inputs.forEach(name => {
            if (name?.label.toLowerCase().includes(value)) {
              if (!notDublicate.includes(accred.category)) {
                notDublicate.push(accred.category);
                accred['indexExpanded'] = true;
              }
            }
          });
        });
      }
      if (!value) {
        accred['indexExpanded'] = false;
      }
    });
  }
}
