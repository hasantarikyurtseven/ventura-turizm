import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AirlinesListComponent } from './components/airlines-list/airlines-list.component';
import { AirlineFormComponent } from './components/airline-form/airline-form.component';

const routes: Routes = [
    { path: '', component: AirlinesListComponent },
    { path: 'new', component: AirlineFormComponent },
    { path: 'edit/:id', component: AirlineFormComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AirlinesRoutingModule { }
