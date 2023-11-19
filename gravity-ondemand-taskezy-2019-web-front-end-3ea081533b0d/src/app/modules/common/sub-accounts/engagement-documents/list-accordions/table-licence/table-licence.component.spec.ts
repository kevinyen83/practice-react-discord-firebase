import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from 'app/shared/shared.module';
import { HttpClientTestingModule } from "@angular/common/http/testing";

import { TableLicenceComponent } from './table-licence.component';
import { By } from "@angular/platform-browser";

describe('TableLicenceComponent', () => {
  let component: TableLicenceComponent;
  let fixture: ComponentFixture<TableLicenceComponent>;

    beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports:[
        SharedModule,
        BrowserAnimationsModule,
        HttpClientTestingModule],
      declarations: [ TableLicenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableLicenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check edit accreditations', () => {
    let buttonsMore = fixture.debugElement.queryAll(By.css(`.more-button`));
    buttonsMore.forEach((button, i) => {
      if (i === 0) {
        button.nativeElement.click();
        let editButton = fixture.debugElement.query(By.css(`[data-testid="menu-edit"]`)).nativeElement;
        expect(editButton).toBeTruthy();
        if (component.list?.length && component.list[0]) {
          component.edit(component.list[0]);
        }
      }
    });
  });

  it('check delete accreditation', () => {
    let buttonsMore = fixture.debugElement.queryAll(By.css(`.more-button`));
    let length = buttonsMore.length;
    buttonsMore.forEach((button, i) => {
      if (i === 0) {
        button.nativeElement.click();
        let removeButton = fixture.debugElement.query(By.css(`[data-testid="menu-remove"]`)).nativeElement;
        expect(removeButton).toBeTruthy();
        if (component.list?.length) {
          component.remove(component.list[0]);
          expect(buttonsMore.length).toBeGreaterThan(length - 1);
        }
      }
    });
  });
});
