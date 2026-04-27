import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionsListComponent } from './components/permissions-list/permissions-list.component';
import { PermissionFormComponent } from './components/permission-form/permission-form.component';

const routes: Routes = [
    { path: '', component: PermissionsListComponent },
    { path: 'new', component: PermissionFormComponent },
    { path: 'edit/:id', component: PermissionFormComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PermissionsRoutingModule { }
