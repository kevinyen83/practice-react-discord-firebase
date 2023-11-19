import {
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { IncidentReportingService } from "app/core/services/incidents/incident-reporting.service";

import { catchError, EMPTY, Subject } from "rxjs";

@Component({
  selector: "app-locations",
  templateUrl: "./locations.component.html",
})
export class LocationsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("img") item: ElementRef;

  viewCircle = false;
  unsubscribeAll = new Subject<any>();
  markers = [];
  large = false;
  less = false;
  size = 0;
  plan;
  viewLocations = false;
  coordinates = {
    x: 0,
    y: 0,
  };
  dragPosition = {
    x: 0,
    y: 0,
  };
  markerPosition = {
    x: 50,
    y: 50,
  };

  constructor(
    private incidentReportingService: IncidentReportingService,
    private element: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.drawSchema();
  }

  addLocations() {
    this.viewLocations = true;
  }

  removeLocations() {
    this.viewLocations = false;
  }

  onFileChange(event) {
    const reader = new FileReader();
    const input = event.target;
    reader.onload = () => {
      this.plan = reader.result;
    };
    reader.readAsDataURL(input.files[0]);
    const data = {
      file: this.plan,
    };
  }

  enlarge() {
    // const curTransform = this.item.nativeElement.style.transform.scale = '1.5';
    // const leftChange = parseFloat(curTransform[0]);
    // const topChange = parseFloat(curTransform[1]);
    // console.log(curTransform);
    if (this.less) {
      this.less = false;
      this.large = false;
      this.renderer.setStyle(
        this.item.nativeElement,
        "transform",
        "scale(1.0)"
      );
      this.calculateShift();
    } else {
      this.less = false;
      this.large = true;
      this.renderer.setStyle(
        this.item.nativeElement,
        "transform",
        "scale(1.5)"
      );
      this.calculateShift();
    }
  }

  reduce() {
    if (this.large) {
      this.large = false;
      this.less = false;
      this.renderer.setStyle(
        this.item.nativeElement,
        "transform",
        "scale(1.0)"
      );
    } else {
      this.large = false;
      this.less = true;
      this.renderer.setStyle(
        this.item.nativeElement,
        "transform",
        "scale(0.5)"
      );
    }
  }

  calculateShift() {
    this.markers.forEach((marker, i) => {
      marker.position.x = marker.position.x + 300;
      marker.position.y = marker.position.y + 40;
    });
    console.log(this.markers);
  }

  foundPosition(event, room) {
    this.markers.push({
      position: {
        x: event.offsetX - 10,
        y: event.offsetY + 50,
      },
      name: room.room,
    });
  }

  dragEnd(event) {
    this.markerPosition.x = event.distance.x;
    this.markerPosition.y = event.distance.y;
  }

  drawSchema() {
    const map = document.querySelector(".locations");
  }

  dragend(event, index) {
    this.markers.forEach((marker, i) => {
      if (i === index) {
        marker.position.x = event.distance.x;
        marker.position.y = event.distance.y;
      }
    });
    console.log(this.markers);
  }

  addLocation() {
    const marker = {
      position: {
        x: 150,
        y: 170,
      },
    };
    this.markers.push(marker);
  }

  setName(event, index) {
    this.markers.forEach((marker, i) => {
      if (i === index) {
        marker.name = event;
      }
    });
  }

  removeLocation(index) {
    this.markers = this.markers.filter((loc, i) => i !== index);
  }

  toCurrentLocation(location) {
    const currentLocation = this.markers.find(
      (loc) => loc.name === location.name
    );
    this.dragPosition = {
      x: -currentLocation.position.x,
      y: -currentLocation.position.y,
    };
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }
}
