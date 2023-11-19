import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-selected-indicator',
  templateUrl: './selected-indicator.component.html'
})
export class SelectedIndicatorComponent implements OnInit, OnChanges {

  @Input() selectedLength: number;

  @Output() clearSelectedItems = new EventEmitter();

  selectedMap: {[k: string]: string};

  constructor() { 
    
  }

  ngOnChanges(changes) {
    this.selectedLength = changes['selectedLength'].currentValue;
    this.selectedMap = {'=0': this.selectedLength + ' Shifts', '=1': this.selectedLength + ' Shift', 'other': this.selectedLength + ' Shifts'};
  }

  ngOnInit() {
  }

  clear() {
    this.clearSelectedItems.emit();
  }
}
