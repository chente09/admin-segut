import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPathsComponent } from './admin-paths.component';

describe('AdminPathsComponent', () => {
  let component: AdminPathsComponent;
  let fixture: ComponentFixture<AdminPathsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPathsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPathsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
