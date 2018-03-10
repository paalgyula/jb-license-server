import { Component, OnInit } from '@angular/core';
import { AngularFireAuth, AUTH_PROVIDERS } from 'angularfire2/auth';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'admin-login',
    templateUrl: './login.component.html',
    styleUrls: ['login.component.css']
})
export class LoginComponent implements OnInit {

    constructor(public af: AngularFireAuth, private router: Router, private authService: AuthService) {
    }

    ngOnInit(): void {
        this.authService.isAuthenticated().subscribe((user) => {
            if (user)
                this.router.navigate(['/home'])
        })
    }


    public loginGoogle() {
        var provider = new firebase.auth.GoogleAuthProvider();

        this.af.auth.signInWithPopup(provider).then(
            (success) => {
                this.router.navigate(['/home'])
            }).catch(
                (err) => {
                    console.error(err)
                })
    }
}
