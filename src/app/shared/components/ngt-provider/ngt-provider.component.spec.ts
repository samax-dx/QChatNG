import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgtProviderComponent } from './ngt-provider.component';

describe('NgtProviderComponent', () => {
  let component: NgtProviderComponent;
  let fixture: ComponentFixture<NgtProviderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgtProviderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgtProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
