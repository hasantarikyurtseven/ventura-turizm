import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
    },
    {
        path: 'users',
        loadChildren: () => import('./users/users.module').then(m => m.UsersModule)
    },
    {
        path: 'roles',
        loadChildren: () => import('./roles/roles.module').then(m => m.RolesModule)
    },
    {
        path: 'permissions',
        loadChildren: () => import('./permissions/permissions.module').then(m => m.PermissionsModule)
    },
    {
        path: 'airlines',
        loadChildren: () => import('./airlines/airlines.module').then(m => m.AirlinesModule)
    },
    {
        path: 'contracts',
        loadChildren: () => import('./contracts/contracts.module').then(m => m.ContractsModule)
    },
    {
        path: 'members',
        loadChildren: () => import('./members/members.module').then(m => m.MembersModule)
    },
    {
        path: 'reservations',
        loadChildren: () => import('./reservations/reservations.module').then(m => m.ReservationsModule)
    }
];

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ]
})
export class FeaturesModule { }
