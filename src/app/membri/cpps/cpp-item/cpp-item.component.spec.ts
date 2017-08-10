import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CppItemComponent } from './cpp-item.component';

describe('CppItemComponent', () => {
  let component: CppItemComponent;
  let fixture: ComponentFixture<CppItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CppItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CppItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
