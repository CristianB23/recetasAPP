import { TestBed } from '@angular/core/testing';

import { RecetasServiceTsService } from './recetas.service.ts.service';

describe('RecetasServiceTsService', () => {
  let service: RecetasServiceTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecetasServiceTsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
