import {
  Component,
  OnInit,
} from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { FormControl } from "@angular/forms";

@Component({
  selector: "app-shift-description",
  templateUrl: "./shift-description.component.html",
  animations: fuseAnimations
})
export class ShiftDescriptionComponent implements OnInit {
  header = "Shift Description";

  shiftChecked: FormControl;

  constructor() {
    this.shiftChecked = new FormControl(false);
  }

  ngOnInit() {}

}
