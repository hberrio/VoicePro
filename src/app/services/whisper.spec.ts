import { TestBed } from '@angular/core/testing';

import { Whisper } from './whisper';

describe('Whisper', () => {
  let service: Whisper;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Whisper);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
