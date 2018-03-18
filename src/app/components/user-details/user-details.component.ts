import {Component, OnDestroy, OnInit} from '@angular/core';
import {User, UsersService} from "../../services/users.service";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs/Subscription";

@Component({
    selector: 'admin-user-details',
    templateUrl: './user-details.component.html',
    styles: []
})
export class UserDetailsComponent implements OnInit, OnDestroy {
    private user: User;

    private sub: Subscription;

    constructor(private usersService: UsersService, private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.sub = this.route.params.subscribe(params => {
            this.usersService.getUser( params['username'] )
                .subscribe(user => this.user = user)
        });
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe()
    }

}
