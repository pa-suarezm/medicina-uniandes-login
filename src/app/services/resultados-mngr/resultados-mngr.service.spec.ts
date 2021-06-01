import { TestBed } from '@angular/core/testing';

import { ResultadosMngrService } from './resultados-mngr.service';

describe('ResultadosMngrService', () => {
  let service: ResultadosMngrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResultadosMngrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
