import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContractsListComponent } from './components/contracts-list/contracts-list.component';
import { ContractEditorComponent } from './components/contract-editor/contract-editor.component';

const routes: Routes = [
    { path: '', component: ContractsListComponent },
    { path: 'new', component: ContractEditorComponent },
    { path: 'edit/:id', component: ContractEditorComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ContractsRoutingModule { }
