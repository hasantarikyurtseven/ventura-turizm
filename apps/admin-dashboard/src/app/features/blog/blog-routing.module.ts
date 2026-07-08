import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogListComponent } from './components/blog-list/blog-list.component';
import { BlogEditorComponent } from './components/blog-editor/blog-editor.component';

const routes: Routes = [
  { path: '', component: BlogListComponent },
  { path: 'create', component: BlogEditorComponent },
  { path: 'edit/:id', component: BlogEditorComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BlogRoutingModule {}
