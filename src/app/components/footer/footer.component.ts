import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'admin-footer',
    templateUrl: './footer.component.html',
    styles: []
})
export class FooterComponent implements OnInit {

    test: Date;

    constructor() { }

    ngOnInit() {
        this.test = new Date()
    }

}
