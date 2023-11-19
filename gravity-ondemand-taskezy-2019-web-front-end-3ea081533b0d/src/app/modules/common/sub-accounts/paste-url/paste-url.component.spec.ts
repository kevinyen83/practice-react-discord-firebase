import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from 'app/shared/shared.module';

import { PasteUrlComponent } from './paste-url.component';

describe('PasteUrlComponent', () => {
  let component: PasteUrlComponent;
  let fixture: ComponentFixture<PasteUrlComponent>;

    beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports:[SharedModule, BrowserAnimationsModule],
      declarations: [ PasteUrlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasteUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
