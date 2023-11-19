import { Component, Input, OnInit } from '@angular/core';
@Component({
  selector: 'app-file-icon',
  templateUrl: './file-icon.component.html'
})
export class FileIconComponent implements OnInit {
  @Input() type: string;
  @Input() ext: string;
  bgColor;
  constructor() {}

  ngOnInit() {
    if (this.type?.includes('image')) {
      this.bgColor = 'bg-amber-600';
    } else if (this.type?.includes('pdf')) {
      this.bgColor = 'bg-red-600';
    } else if (this.type?.includes('application')) {
      this.bgColor = 'bg-blue-600';
    } else {
      this.bgColor = 'bg-gray-600';
    }
  }
}
