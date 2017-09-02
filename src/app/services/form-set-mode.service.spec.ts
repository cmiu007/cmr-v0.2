import { TestBed, inject } from '@angular/core/testing';

import { FormSetModeService } from './form-set-mode.service';

describe('FormSetModeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormSetModeService]
    });
  });

  it('should be created', inject([FormSetModeService], (service: FormSetModeService) => {
    expect(service).toBeTruthy();
  }));
});
