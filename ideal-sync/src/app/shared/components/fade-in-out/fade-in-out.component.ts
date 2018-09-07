import { Component, Input } from '@angular/core';
import { trigger, state, animate, transition, style } from '@angular/animations';

@Component({
  selector: 'i-sync-fade-in-out',
  animations: [
    trigger('visibilityChanged', [
      state('true', style({ opacity: 1, transform: 'scale(1.0)' })),
      state('false', style({ opacity: 0, transform: 'scale(0.3)' })),
      transition('1 => 0', animate('300ms')),
      transition('0 => 1', animate('200ms'))
    ])
  ],
  template: `
    <div [@visibilityChanged]="isVisible" style="height: 100%;">
      <ng-content></ng-content>
    </div>
  `,
  styles: []
})
export class FadeInOutComponent {

  @Input() isVisible = true;

}
