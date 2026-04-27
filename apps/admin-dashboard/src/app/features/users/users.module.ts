import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersRoutingModule } from './users-routing.module';
import { SharedModule } from '../../shared/shared.module';

import { UsersListComponent } from './components/users-list/users-list.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ConfirmDialogComponent } from './components/users-list/users-list.component';

@NgModule({
    declarations: [
        UsersListComponent,
        UserFormComponent,
        UserProfileComponent,
        ConfirmDialogComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        UsersRoutingModule,
        SharedModule
    ],
    exports: [ConfirmDialogComponent]
})
export class UsersModule { }
