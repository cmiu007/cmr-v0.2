import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePersonaleComponent } from './date-personale.component';

describe('DatePersonaleComponent', () => {
  let component: DatePersonaleComponent;
  let fixture: ComponentFixture<DatePersonaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatePersonaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatePersonaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
