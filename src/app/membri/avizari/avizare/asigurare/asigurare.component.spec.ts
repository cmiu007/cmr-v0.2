import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsigurareComponent } from './asigurare.component';

describe('AsigurareComponent', () => {
  let component: AsigurareComponent;
  let fixture: ComponentFixture<AsigurareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsigurareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsigurareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
