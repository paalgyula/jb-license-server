import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../services/users.service';

@Component({
    selector: 'admin-users',
    templateUrl: './users.component.html',
    styles: []
})
export class UsersComponent implements OnInit {
    name: string
    newUser: boolean = true

    public editUser : User;

    constructor(private route: ActivatedRoute) { }

    ngOnInit() {
        this.route.queryParams
            .filter(params => params.name)
            .subscribe(params => {
                console.log(params) // {order: "popular"}

                this.name = params.name
                if (this.name) this.newUser = false
            });
    }

}
