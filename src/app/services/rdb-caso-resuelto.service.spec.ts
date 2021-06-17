import { TestBed } from '@angular/core/testing';

import { RdbCasoResueltoService } from './rdb-caso-resuelto.service';

describe('RdbCasoResueltoService', () => {
  let service: RdbCasoResueltoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RdbCasoResueltoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
