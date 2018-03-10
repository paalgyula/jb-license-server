import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable'
import * as firebase from 'firebase';

@Injectable()
export class AuthService {

    constructor(private auth: AngularFireAuth,
        private router: Router) {
        firebase.auth().onAuthStateChanged((user) => {
            if (!user)
                this.router.navigate(['/login'])
        })
    }

    public isAuthenticated(): Observable<boolean> {
        return Observable.create((obs) => {
            this.auth.authState.subscribe((user) => {
                obs.next(user != null)
            })
        })
    }

    public logout(): void {
        this.auth.auth.signOut()
        this.router.navigate(['/login'])
    }

    public getCurrentUser() {
        return this.auth.authState;
    }
}
