import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../../components/dashboard/dashboard.component';
import { UsersComponent } from '../../components/users/users.component';
import { UsersService } from '../../services/users.service';
import { HomeComponent } from './home.component';
import { SharedModule } from '../../shared/shared.module';
import { UsersListComponent } from '../../components/users-list/users-list.component';
import { UserFormComponent } from '../../components/user-form/user-form.component';
import { AuthGuard } from '../../auth.guard';
import { LogviewComponent } from '../../components/logview/logview.component';

const routes: Routes = [{
    path: '', canActivate: [AuthGuard],  component: HomeComponent, children: [
        { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
        { path: 'dashboard', component: DashboardComponent },
        { path: 'users', component: UsersComponent },
        { path: 'logs', component: LogviewComponent }
    ]
}];


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule],
    providers: [UsersService],
    declarations: [
        HomeComponent,
        DashboardComponent,
        UsersComponent,
        UsersListComponent,
        UserFormComponent,
        LogviewComponent
    ]
})
export class HomeModule { }
