import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CppListComponent } from './cpp-list.component';

describe('CppListComponent', () => {
  let component: CppListComponent;
  let fixture: ComponentFixture<CppListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CppListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CppListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
