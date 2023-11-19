import { AfterViewInit, Component, EventEmitter, forwardRef, OnInit, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

// import { SignaturePad } from 'angular2-signaturepad/signature-pad';

@Component({
  selector: 'app-signature-field',
  templateUrl: './signature-field.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SignatureFieldComponent),
      multi: true,
    },
  ],
})
export class SignatureFieldComponent implements OnInit, ControlValueAccessor, AfterViewInit {

  @Output() dataSignature = new EventEmitter<any>();

  startDrawing = false;
  // @ViewChild(SignaturePad, { read: true, static: false }) public signaturePad: SignaturePad;

  public options = {
    minWidth: 1,
    maxWidth: 3,
    canvasWidth: 1600,
    canvasHeight: 300,
    dotSize: 1.5
  };

  // public _signature: any = null;

  public propagateChange = null;

  constructor() { }

  ngOnInit() {
  }

  // get signature(): any {
  //   // return this._signature;
  // }

  // set signature(value: any) {
  //   // this._signature = value;
  //   this.propagateChange(this.signature);
  // }

  public writeValue(value: any): void {
    if (!value) {
      return;
    }
    // this._signature = value;
    // this.signaturePad.fromDataURL(this.signature);
  }

  public registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  public registerOnTouched(): void {
    // no-op
  }

  public ngAfterViewInit(): void {
    // this.signaturePad.clear();
  }

  public drawBegin(): void {
    this.startDrawing = true;
  }

  public drawComplete(): void {
    // this.signature = this.signaturePad.toDataURL('image/png', 100);
    // console.log(this.signature);
    // this.dataSignature.emit(this.signature);
  }

  public clear(): void {
    // this.signaturePad.clear();
    // this.signature = '';
  }
}
