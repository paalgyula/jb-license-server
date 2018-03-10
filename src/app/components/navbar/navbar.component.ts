import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs/observable';
import { Observer } from 'rxjs/Observer';

@Component({
    selector: 'admin-navbar',
    templateUrl: './navbar.component.html',
    styles: []
})
export class NavbarComponent implements OnInit {

    username: string;
    public currentUser: any;

    constructor(private authService: AuthService) { }

    ngOnInit() {
        this.getUsername()
    }

    public getTitle(): string {
        return ""
    }

    public getUsername() {
        this.authService.getCurrentUser().subscribe((user) => {
            this.username = user.displayName;
        })
    }

    public logout(): void {
        this.authService.logout()
    }
}
