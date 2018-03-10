import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanLoad } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './services/auth.service';
import { Route } from '@angular/router';
import { Observer } from 'rxjs/Observer';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {

    constructor(private authService: AuthService, private router: Router) { }

    canLoad(route: Route): boolean | Observable<boolean> | Promise<boolean> {
        return Observable.create((obs:Observer<boolean>) => {
            this.authService.isAuthenticated().subscribe((user) => {
                if (user) {
                    obs.next(true)
                    obs.complete()
                } else {
                    // Navigate to the login page with extras
                    this.router.navigate(['/login']);
                    obs.next(false)
                    obs.complete()
                }
            });
        })
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return this.canLoad(null)
    }
}
