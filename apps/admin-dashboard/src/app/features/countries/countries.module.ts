import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CountriesRoutingModule } from './countries-routing.module';
import { SharedModule } from '../../shared/shared.module';

import { CountriesListComponent } from './components/countries-list/countries-list.component';

@NgModule({
    declarations: [
        CountriesListComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CountriesRoutingModule,
        SharedModule
    ]
})
export class CountriesModule { }
