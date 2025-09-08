import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Voiceapp } from './voiceapp';

describe('Voiceapp', () => {
  let component: Voiceapp;
  let fixture: ComponentFixture<Voiceapp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Voiceapp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Voiceapp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
