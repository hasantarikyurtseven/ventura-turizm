import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HelpAdminComponent } from './components/help-admin/help-admin.component';

const routes: Routes = [{ path: '', component: HelpAdminComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HelpRoutingModule {}
