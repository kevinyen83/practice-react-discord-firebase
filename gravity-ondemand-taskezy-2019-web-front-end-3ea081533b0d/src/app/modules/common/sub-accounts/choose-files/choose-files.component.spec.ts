import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SharedModule } from 'app/shared/shared.module';
import { HttpClientTestingModule } from "@angular/common/http/testing";

import { ChooseFilesComponent } from './choose-files.component';

describe('ChooseFilesComponent', () => {
  let component: ChooseFilesComponent;
  let fixture: ComponentFixture<ChooseFilesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        HttpClientTestingModule
      ],
      declarations: [ChooseFilesComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
