import { TestBed } from '@angular/core/testing';

import { RdbCasosService } from './rdb-casos.service';

describe('RdbCasosService', () => {
  let service: RdbCasosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RdbCasosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
