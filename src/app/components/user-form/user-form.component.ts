import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User, UsersService } from '../../services/users.service';

@Component({
    selector: 'admin-user-form',
    templateUrl: './user-form.component.html',
    styles: []
})
export class UserFormComponent implements OnInit {

    @Input()
    public user: User

    constructor(private userService: UsersService) { }

    ngOnInit() {
        this.reset()
    }

    private reset(): void {
        this.user = { name: '', alias: '', seats: 1 }
    }

    public save(): void {
        this.userService
            .addUser(this.user)
        this.reset()
    }

    public delete(username: string) {
        if (confirm("Do you really want to delete this user?")) {
            this.userService
                .delUser(username);
        }
    }

}
