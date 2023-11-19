import { SharedModule } from 'app/shared/shared.module';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ResourcesComplianceComponent } from './resources-compliance.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('ResourcesComplianceComponent', () => {
  let component: ResourcesComplianceComponent;
  let fixture: ComponentFixture<ResourcesComplianceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        SharedModule
      ],
      declarations: [ ResourcesComplianceComponent ],
      providers: [{provide: RouterTestingModule, useClass: ''}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourcesComplianceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
