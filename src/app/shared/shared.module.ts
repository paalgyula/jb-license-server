import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../components/footer/footer.component';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [
      FooterComponent,
      NavbarComponent,
      SidebarComponent
  ],
  exports: [
      SidebarComponent,
      NavbarComponent,
      FooterComponent
  ]
})
export class SharedModule { }
