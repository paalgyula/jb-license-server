import { Component, OnInit } from '@angular/core';
import * as jQuery from 'jquery'

@Component({
    selector: 'admin-sidebar',
    templateUrl: 'sidebar.component.html',
    styles: []
})
export class SidebarComponent implements OnInit {

    menuItems: any[] = [
        { path: '/home/dashboard', title: 'Dashboard',  icon: 'dashboard', class: '' },
        { path: '/home/users', title: 'Users',  icon:'people', class: '' },
        { path: '/home/logs', title: 'Log viewer',  icon:'subject', class: '' },
        // { path: 'typography', title: 'Typography',  icon:'library_books', class: '' },
        // { path: 'icons', title: 'Icons',  icon:'bubble_chart', class: '' },
        // { path: 'maps', title: 'Maps',  icon:'location_on', class: '' },
        // { path: 'notifications', title: 'Notifications',  icon:'notifications', class: '' }
    ];

    constructor() { }

    ngOnInit() {
        jQuery.getScript('../../assets/js/sidebar-moving-tab.js');
    }

}
