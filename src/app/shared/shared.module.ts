import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FooterComponent} from '../components/footer/footer.component';
import {NavbarComponent} from '../components/navbar/navbar.component';
import {SidebarComponent} from '../components/sidebar/sidebar.component';
import {BrowserModule, SafeHtml} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {IpfilterPipe} from "../pipes/ipfilter.pipe";
import {BuildfilterPipe} from "../pipes/buildfilter.pipe";

@NgModule({
    imports: [
        CommonModule,
        RouterModule
    ],
    declarations: [
        FooterComponent,
        NavbarComponent,
        SidebarComponent,
        IpfilterPipe,
        BuildfilterPipe
    ],
    exports: [
        SidebarComponent,
        NavbarComponent,
        FooterComponent,

        IpfilterPipe,
        BuildfilterPipe
    ]
})
export class SharedModule {
}
