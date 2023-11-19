import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-star-rating-control',
  templateUrl: './star-rating-control.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StarRatingControlComponent),
      multi: true
    }
  ]
})
export class StarRatingControlComponent implements OnInit {

  @Output() changeMark = new EventEmitter<any>();

  val = '';
  read = false;
  rating;
  constructor() { }

  ngOnInit() {
  }

  onChange: any = () => {};

  onTouch: any = () => {};

  set value(val) {
    // this.val = val;
    this.onChange(val);
    this.onTouch(val);
  }

  writeValue(value: any) {
      this.rating = value;
      if (value) {
        this.read = true;
      }
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouch = fn;
  }

  onRatingChange(event) {
    this.changeMark.emit(event);
  }
}
