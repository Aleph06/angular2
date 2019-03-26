import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from './shared/material.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListComponent } from './components/list/list.component';
import { CreateComponent } from './components/create/create.component';
import { EditComponent } from './components/edit/edit.component';


import { IssuesService } from './services';

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    CreateComponent,
    EditComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MaterialModule
  ],
  providers: [IssuesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
