import { SharedModule } from "app/shared/shared.module";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterTestingModule } from "@angular/router/testing";

import { ShiftFilterComponent } from "./shift-filter.component";

describe("ShiftDescriptionComponent", () => {
  let component: ShiftFilterComponent;
  let fixture: ComponentFixture<ShiftFilterComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          BrowserAnimationsModule,
          RouterTestingModule,
          HttpClientTestingModule,
          SharedModule,    ],
        declarations: [ShiftFilterComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftFilterComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
