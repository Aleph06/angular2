import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { InputTextModule } from 'primeng/primeng';
import {ButtonModule} from 'primeng/primeng';


import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule.forRoot(),
    InputTextModule, ButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
