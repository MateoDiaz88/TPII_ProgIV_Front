import { TestBed } from '@angular/core/testing';

import { ConfirmExitGuard } from './confirm-exit-guard';

describe('ConfirmExitGuard', () => {
  let service: ConfirmExitGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfirmExitGuard);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
