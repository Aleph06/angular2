import { Title } from '@angular/platform-browser';
import {
  Component, OnInit,
  Input, trigger, state, style, transition, animate
} from '@angular/core';
import { MdSnackBar, MdSnackBarRef } from '@angular/material';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [],
  animations: [
    trigger('estado', [
      state('inactivo', style({ transform: 'translateX(0) scale(1)' })),
      state('activo', style({ transform: 'translateX(0) scale(1.1)' })),
      transition('inactivo <=> activo', animate('300ms ease-in'))
    ]),
    trigger('slideInOut', [
      state('in', style({ transform: 'translate3d(0, 0, 0)'})),
      state('out', style({ transform: 'translate3d(0, -100px, 0)'})),
      transition('in <=> out', animate('300ms ease-in-out'))
    ])
  ]
})
export class AppComponent implements OnInit {

  title: string;
  estatus: boolean;
  slide: boolean=false;

  constructor(private titleService: Title) { }

  ngOnInit() {
    this.title = 'ng2 test';
    this.titleService.setTitle(this.title);
  }

  toogleEstado() {
    this.estatus = !this.estatus;
  }

  toogleSlide() {
    this.slide = !this.slide;
  }

}
