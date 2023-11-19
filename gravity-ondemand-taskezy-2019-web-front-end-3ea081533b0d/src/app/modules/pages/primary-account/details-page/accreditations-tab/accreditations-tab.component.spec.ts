import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from "@angular/common/http/testing";

import { AccreditationsTabComponent } from './accreditations-tab.component';
import { SharedModule } from "../../../../../shared/shared.module";

describe('AccreditationsTabComponent', () => {
  let component: AccreditationsTabComponent;
  let fixture: ComponentFixture<AccreditationsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccreditationsTabComponent ],
      imports: [
        SharedModule,
        HttpClientTestingModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccreditationsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
