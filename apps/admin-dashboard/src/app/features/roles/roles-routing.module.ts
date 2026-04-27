import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolesListComponent } from './components/roles-list/roles-list.component';
import { RoleFormComponent } from './components/role-form/role-form.component';

const routes: Routes = [
    { path: '', component: RolesListComponent },
    { path: 'new', component: RoleFormComponent },
    { path: 'edit/:id', component: RoleFormComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RolesRoutingModule { }
