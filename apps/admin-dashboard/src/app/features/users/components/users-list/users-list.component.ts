import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';
import { UsersService, User } from '../../services/users.service';
import { RolesService } from '../../../roles/services/roles.service';

@Component({
    selector: 'app-users-list',
    standalone: false,
    templateUrl: './users-list.component.html',
    styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
    users: User[] = [];
    totalRecords = 0;
    loading = false;
    page = 1;
    limit = 10;
    searchTerm = '';
    displayedColumns: string[] = ['user', 'email', 'phone', 'roles', 'status', 'lastActive', 'actions'];
    
    // Filter properties
    statusFilter: string = '';
    roleFilter: string = '';
    showFilters = false;
    
    statusOptions = [
        { value: '', label: 'Tüm Durumlar' },
        { value: 'active', label: 'Aktif' },
        { value: 'passive', label: 'Pasif' }
    ];
    
    roleOptions: any[] = [
        { value: '', label: 'Tüm Roller' }
    ];

    constructor(
        private usersService: UsersService,
        private rolesService: RolesService,
        private router: Router,
        private dialog: MatDialog,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit() {
        this.loadRoles();
        this.loadUsers();
    }

    loadRoles() {
        this.rolesService.getRoles(1, 100).subscribe({
            next: (response) => {
                this.roleOptions = [
                    { value: '', label: 'Tüm Roller' },
                    ...response.data.map(role => ({
                        value: role._id,
                        label: role.name
                    }))
                ];
            },
            error: (err) => {
                console.error('Roller yüklenirken hata oluştu:', err);
                // Hata durumunda varsayılan değer
                this.roleOptions = [{ value: '', label: 'Tüm Roller' }];
            }
        });
    }

    loadUsers() {
        this.loading = true;
        this.usersService.getUsers(this.page, this.limit, this.searchTerm).subscribe({
            next: (response) => {
                let filteredData = response.data;
                
                // Apply status filter
                if (this.statusFilter) {
                    filteredData = filteredData.filter(user => user.status === this.statusFilter);
                }
                
                // Apply role filter
                if (this.roleFilter) {
                    filteredData = filteredData.filter(user => 
                        user.roles.some((role: any) => {
                            if (typeof role === 'string') {
                                return role === this.roleFilter;
                            }
                            // Check UserRole structure
                            if (role.roleId && typeof role.roleId === 'object') {
                                return role.roleId._id === this.roleFilter;
                            }
                            // Check direct Role object
                            return role._id === this.roleFilter;
                        })
                    );
                }
                
                this.users = filteredData;
                this.totalRecords = (this.statusFilter || this.roleFilter) ? filteredData.length : response.total;
                this.loading = false;
            },
            error: (error) => {
                this.snackBar.open('Kullanıcılar yüklenemedi', 'Kapat', {
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
        this.loadUsers();
    }

    onSearch() {
        this.page = 1;
        this.loadUsers();
    }

    onFilterChange() {
        this.page = 1;
        this.loadUsers();
    }

    clearFilters() {
        this.searchTerm = '';
        this.statusFilter = '';
        this.roleFilter = '';
        this.page = 1;
        this.loadUsers();
    }

    hasActiveFilters(): boolean {
        return !!(this.statusFilter || this.roleFilter);
    }

    toggleFilters() {
        this.showFilters = !this.showFilters;
    }

    getRoleName(role: any): string {
        if (typeof role === 'string') {
            return role;
        }
        if (role && typeof role === 'object') {
            // Check if it's a UserRole structure { roleId: {...}, assignedAt: ... }
            if (role.roleId && typeof role.roleId === 'object') {
                return role.roleId.name || role.roleId._id || 'Unknown';
            }
            // Check if it's a direct Role object
            return role.name || role._id || 'Unknown';
        }
        return 'Unknown';
    }

    createUser() {
        this.router.navigate(['/users/new']);
    }

    editUser(user: User) {
        this.router.navigate(['/users/edit', user._id]);
    }

    deleteUser(user: User) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            data: {
                title: 'Kullanıcıyı Sil',
                message: `${user.username} kullanıcısını silmek istediğinizden emin misiniz?`,
                confirmText: 'Sil',
                cancelText: 'İptal'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.usersService.deleteUser(user._id!).subscribe({
                    next: () => {
                        this.snackBar.open('Kullanıcı başarıyla silindi', 'Kapat', {
                            duration: 3000,
                            horizontalPosition: 'end',
                            verticalPosition: 'top'
                        });
                        this.loadUsers();
                    },
                    error: () => {
                        this.snackBar.open('Kullanıcı silinirken bir hata oluştu', 'Kapat', {
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

// Confirm Dialog Component (inline for simplicity)
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Inject } from '@angular/core';

@Component({
    selector: 'app-confirm-dialog',
    template: `
        <h2 mat-dialog-title>{{data.title}}</h2>
        <mat-dialog-content>
            <p>{{data.message}}</p>
        </mat-dialog-content>
        <mat-dialog-actions align="end">
            <button mat-button (click)="onCancel()">{{data.cancelText}}</button>
            <button mat-raised-button color="warn" (click)="onConfirm()">{{data.confirmText}}</button>
        </mat-dialog-actions>
    `,
    styles: [`
        mat-dialog-content {
            padding: 20px 0;
        }
        mat-dialog-actions {
            padding: 0;
            margin-top: 20px;
        }
    `],
    standalone: false
})
export class ConfirmDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<ConfirmDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    onCancel(): void {
        this.dialogRef.close(false);
    }

    onConfirm(): void {
        this.dialogRef.close(true);
    }
}
