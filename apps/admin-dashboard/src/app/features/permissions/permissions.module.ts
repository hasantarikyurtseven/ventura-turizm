import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PermissionsRoutingModule } from './permissions-routing.module';
import { SharedModule } from '../../shared/shared.module';

import { PermissionsListComponent } from './components/permissions-list/permissions-list.component';
import { PermissionFormComponent } from './components/permission-form/permission-form.component';

@NgModule({
    declarations: [
        PermissionsListComponent,
        PermissionFormComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        PermissionsRoutingModule,
        SharedModule
    ]
})
export class PermissionsModule { }
