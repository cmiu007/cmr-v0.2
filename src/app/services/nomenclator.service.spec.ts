import { TestBed, inject } from '@angular/core/testing';

import { NomenclatorService } from './nomenclator.service';

describe('NomenclatorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NomenclatorService]
    });
  });

  it('should be created', inject([NomenclatorService], (service: NomenclatorService) => {
    expect(service).toBeTruthy();
  }));
});
