import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2/database';
import { UsersService, User } from '../../services/users.service';

@Component({
    selector: 'admin-users-list',
    templateUrl: './users-list.component.html',
    styles: []
})
export class UsersListComponent implements OnInit {

    users: User[] = []

    @Output()
    public modify: EventEmitter<User> = new EventEmitter<User>();

    constructor(private usersService: UsersService) { }

    ngOnInit() {
        this.usersService
            .getUsers()
            .subscribe(data => this.users = data)
    }

    public edit(user:User) : void {
        // Cloning, not referencing!!!
        this.modify.next(Object.assign({}, user))
    }
}
