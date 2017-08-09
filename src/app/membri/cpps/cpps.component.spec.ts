import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CppsComponent } from './cpps.component';

describe('CppsComponent', () => {
  let component: CppsComponent;
  let fixture: ComponentFixture<CppsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CppsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CppsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
