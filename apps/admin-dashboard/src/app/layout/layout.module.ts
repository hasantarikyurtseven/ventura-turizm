import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    declarations: [
        AdminLayoutComponent,
        AuthLayoutComponent
    ],
    imports: [
        SharedModule,
        RouterModule
    ],
    exports: [
        AdminLayoutComponent,
        AuthLayoutComponent
    ]
})
export class LayoutModule { }
