import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';
import { PermissionsService, Permission } from '../../services/permissions.service';
import { ConfirmDialogComponent } from '../../../users/components/users-list/users-list.component';

@Component({
    selector: 'app-permissions-list',
    standalone: false,
    templateUrl: './permissions-list.component.html',
    styleUrls: ['./permissions-list.component.scss']
})
export class PermissionsListComponent implements OnInit {
    permissions: Permission[] = [];
    totalRecords = 0;
    loading = false;
    page = 1;
    limit = 10;
    searchTerm = '';
    displayedColumns: string[] = ['code', 'name', 'module', 'description', 'status', 'actions'];

    constructor(
        private permissionsService: PermissionsService,
        private router: Router,
        private dialog: MatDialog,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit() {
        this.loadPermissions();
    }

    loadPermissions() {
        this.loading = true;
        this.permissionsService.getPermissions(this.page, this.limit, this.searchTerm).subscribe({
            next: (response) => {
                this.permissions = response.data;
                this.totalRecords = response.total;
                this.loading = false;
            },
            error: (error) => {
                this.snackBar.open('İzinler yüklenemedi', 'Kapat', {
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
        this.loadPermissions();
    }

    onSearch() {
        this.page = 1;
        this.loadPermissions();
    }

    createPermission() {
        this.router.navigate(['/permissions/new']);
    }

    editPermission(permission: Permission) {
        this.router.navigate(['/permissions/edit', permission._id]);
    }

    deletePermission(permission: Permission) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            data: {
                title: 'İzni Sil',
                message: `${permission.name} iznini silmek istediğinizden emin misiniz?`,
                confirmText: 'Sil',
                cancelText: 'İptal'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.permissionsService.deletePermission(permission._id!).subscribe({
                    next: () => {
                        this.snackBar.open('İzin başarıyla silindi', 'Kapat', {
                            duration: 3000,
                            horizontalPosition: 'end',
                            verticalPosition: 'top'
                        });
                        this.loadPermissions();
                    },
                    error: () => {
                        this.snackBar.open('İzin silinirken bir hata oluştu', 'Kapat', {
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
