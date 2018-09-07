import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'i-sync-slider-3',
  templateUrl: './slider-3.component.html',
  styles: [`
    :host {
      display: block;
      overflow: hidden; /* Hide everything that doesn't fit compoennt */
    }
    .parent {
      height: 100%;
      width: 300%;      /* Make the parent element to take up twice
                          of the component's width */
      display: flex;    /* Align all children in a row */
    }
    .parent div { flex: 1; }  /* Evenly divide width between children */
  `],
  animations: [
    trigger('slide', [
      state('left', style({ transform: 'translateX(0)' })),
      state('center', style({ transform: 'translateX(-33.33%)' })),
      state('right', style({ transform: 'translateX(-66.66%)' })),
      transition('* => *', animate(300))
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Slider3Component implements OnInit {

  @Input() activePane: PaneType3 = 'left';

  constructor() { }

  ngOnInit() {
  }

}
type PaneType3 = 'left' | 'center' | 'right';
