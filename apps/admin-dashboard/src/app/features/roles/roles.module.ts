import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RolesRoutingModule } from './roles-routing.module';
import { SharedModule } from '../../shared/shared.module';

import { RolesListComponent } from './components/roles-list/roles-list.component';
import { RoleFormComponent } from './components/role-form/role-form.component';

@NgModule({
    declarations: [
        RolesListComponent,
        RoleFormComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RolesRoutingModule,
        SharedModule
    ]
})
export class RolesModule { }
