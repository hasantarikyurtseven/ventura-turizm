import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AirlinesRoutingModule } from './airlines-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { UsersModule } from '../users/users.module';

import { AirlinesListComponent } from './components/airlines-list/airlines-list.component';
import { AirlineFormComponent } from './components/airline-form/airline-form.component';

@NgModule({
    declarations: [
        AirlinesListComponent,
        AirlineFormComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AirlinesRoutingModule,
        SharedModule,
        UsersModule
    ]
})
export class AirlinesModule { }
