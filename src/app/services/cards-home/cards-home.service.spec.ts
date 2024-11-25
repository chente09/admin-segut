import { TestBed } from '@angular/core/testing';

import { CardsHomeService } from './cards-home.service';

describe('CardsHomeService', () => {
  let service: CardsHomeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardsHomeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
