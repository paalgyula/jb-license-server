import {Component, Inject, OnInit} from '@angular/core';
import {DOCUMENT} from "@angular/common";

@Component({
    selector: 'admin-dashboard',
    templateUrl: 'dashboard.component.html',
    styles: []
})
export class DashboardComponent implements OnInit {
    public hostname: string;

    constructor(@Inject(DOCUMENT) private document) {
        this.hostname = document.location.protocol +'//'+ document.location.hostname;
        if ( document.location.port && (document.location.port !== 443 || document.local.port !== 80))
            this.hostname += `:${document.location.port}`;
    }

    ngOnInit() {
    }

}
