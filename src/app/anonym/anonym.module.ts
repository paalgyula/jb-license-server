import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  imports: [
      BrowserModule,
    CommonModule
  ],
  declarations: [LoginComponent, RegisterComponent]
})
export class AnonymModule { }
