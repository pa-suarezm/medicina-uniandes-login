import { TestBed } from '@angular/core/testing';

import { RdbUsersService } from './rdb-users.service';

describe('RdbUsersService', () => {
  let service: RdbUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RdbUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
