import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsigurariListComponent } from './asigurari-list.component';

describe('AsigurariListComponent', () => {
  let component: AsigurariListComponent;
  let fixture: ComponentFixture<AsigurariListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsigurariListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsigurariListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
