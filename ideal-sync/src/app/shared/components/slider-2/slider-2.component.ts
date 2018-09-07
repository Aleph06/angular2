import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'i-sync-slider-2',
  templateUrl: './slider-2.component.html',
  styles: [`
    :host {
      display: block;
      overflow: hidden; /* Hide everything that doesn't fit compoennt */
    }
    .parent {
      height: 100%;
      width: 200%;      /* Make the parent element to take up twice
                          of the component's width */
      display: flex;    /* Align all children in a row */
    }
    .parent div { flex: 1; }  /* Evenly divide width between children */
  `],
  animations: [
    trigger('slide', [
      state('left', style({ transform: 'translateX(0)' })),
      state('right', style({ transform: 'translateX(-50%)' })),
      transition('* => *', animate(300))
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Slider2Component implements OnInit {

  @Input() activePane: PaneType2 = 'left';

  constructor() { }

  ngOnInit() {
  }

}
type PaneType2 = 'left' | 'right';
