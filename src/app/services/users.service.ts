import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2/database';

export class User {
    name: string
    alias: string
    seats: number
}

@Injectable()
export class UsersService {
    private usersRef = this.firebase.database.ref('/users')

    constructor(private firebase: AngularFireDatabase) {
    }

    /**
     * getUsers
     */
    public getUsers(): Observable<User[]> {
        return Observable.create(observable => {
            this.usersRef.on("value", (snapshot) => {
                var users: User[] = []
                var data = snapshot.val();

                // Mapping
                for (var key in data) {
                    users.push(Object.assign(data[key], { name: key }))
                }

                observable.next(users);
            }, function (errorObject) {
                console.error("The read failed from usersRef: " + errorObject.code);
            });
        });
    }

    /**
     * addUser
     * @param user {User} user to be added
     */
    public addUser(user: User): void {
        var username = user.name;
        delete user.name;

        this.usersRef.child(username).set(user, (error) => {
            if (error)
                alert(error)
        })
    }

    /**
     * delUser
     */
    public delUser(username: string): void {
        this.usersRef.child(username).remove();
    }
}
