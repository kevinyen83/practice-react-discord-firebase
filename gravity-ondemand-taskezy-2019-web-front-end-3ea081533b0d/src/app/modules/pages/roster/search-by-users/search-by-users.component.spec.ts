import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from "@angular/common/http/testing";

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";

import { SearchByUsersComponent } from './search-by-users.component';
import { SharedModule } from 'app/shared/shared.module';

describe('SearchByUsersComponent', () => {
  let component: SearchByUsersComponent;
  let fixture: ComponentFixture<SearchByUsersComponent>;

    beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        SharedModule
      ],
      declarations: [ SearchByUsersComponent ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        {
          provide: MatDialogRef,
          useValue: {}
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchByUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('check search resources(suppliers)', () => {
    let value = component.searchUsers.value.toLowerCase();
    component.onSearch();

    component.suppliersDisplayed = component.onFilterSuppliers();
    component.resourcesDisplayed = component.onFilterResources();

    component.suppliersDisplayed.forEach(s => {
      expect(s.detail.name.toLowerCase.includes(value)).toBeTruthy();
    });
    component.resourcesDisplayed.forEach(r => {
      expect(r.resource.name.toLowerCase().includes(value) || r.supplier.detail.name.toLowerCase().includes(value)).toBeTruthy();
    })
  });
});
