import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';
import { RolesService, Role } from '../../services/roles.service';
import { ConfirmDialogComponent } from '../../../users/components/users-list/users-list.component';

@Component({
    selector: 'app-roles-list',
    standalone: false,
    templateUrl: './roles-list.component.html',
    styleUrls: ['./roles-list.component.scss']
})
export class RolesListComponent implements OnInit {
    roles: Role[] = [];
    totalRecords = 0;
    loading = false;
    page = 1;
    limit = 10;
    searchTerm = '';
    displayedColumns: string[] = ['name', 'description', 'permissions', 'status', 'actions'];

    constructor(
        private rolesService: RolesService,
        private router: Router,
        private dialog: MatDialog,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit() {
        this.loadRoles();
    }

    loadRoles() {
        this.loading = true;
        this.rolesService.getRoles(this.page, this.limit, this.searchTerm).subscribe({
            next: (response) => {
                this.roles = response.data;
                this.totalRecords = response.total;
                this.loading = false;
            },
            error: (error) => {
                this.snackBar.open('Roller yüklenemedi', 'Kapat', {
                    duration: 3000,
                    horizontalPosition: 'end',
                    verticalPosition: 'top'
                });
                this.loading = false;
            }
        });
    }

    onPageChange(event: PageEvent) {
        this.page = event.pageIndex + 1;
        this.limit = event.pageSize;
        this.loadRoles();
    }

    onSearch() {
        this.page = 1;
        this.loadRoles();
    }

    createRole() {
        this.router.navigate(['/roles/new']);
    }

    editRole(role: Role) {
        this.router.navigate(['/roles/edit', role._id]);
    }

    deleteRole(role: Role) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            data: {
                title: 'Rolü Sil',
                message: `${role.name} rolünü silmek istediğinizden emin misiniz?`,
                confirmText: 'Sil',
                cancelText: 'İptal'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.rolesService.deleteRole(role._id!).subscribe({
                    next: () => {
                        this.snackBar.open('Rol başarıyla silindi', 'Kapat', {
                            duration: 3000,
                            horizontalPosition: 'end',
                            verticalPosition: 'top'
                        });
                        this.loadRoles();
                    },
                    error: () => {
                        this.snackBar.open('Rol silinirken bir hata oluştu', 'Kapat', {
                            duration: 3000,
                            horizontalPosition: 'end',
                            verticalPosition: 'top'
                        });
                    }
                });
            }
        });
    }
}
