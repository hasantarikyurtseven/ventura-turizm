import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RolesService, Role } from '../../services/roles.service';
import { PermissionsService, Permission } from '../../../permissions/services/permissions.service';

@Component({
    selector: 'app-role-form',
    standalone: false,
    templateUrl: './role-form.component.html',
    styleUrls: ['./role-form.component.scss']
})
export class RoleFormComponent implements OnInit {
    roleForm: FormGroup;
    isEditMode = false;
    roleId: string | null = null;
    loading = false;
    availablePermissions: Permission[] = [];
    selectedPermissions: Permission[] = [];
    statuses = [
        { label: 'Aktif', value: 'active' },
        { label: 'Pasif', value: 'inactive' }
    ];

    constructor(
        private fb: FormBuilder,
        private rolesService: RolesService,
        private permissionsService: PermissionsService,
        private route: ActivatedRoute,
        private router: Router,
        private snackBar: MatSnackBar
    ) {
        this.roleForm = this.fb.group({
            name: ['', Validators.required],
            description: ['', Validators.required],
            status: ['active', Validators.required],
            permissions: [[]]
        });
    }

    ngOnInit() {
        this.loadPermissions();
        this.roleId = this.route.snapshot.paramMap.get('id');
        if (this.roleId && this.roleId !== 'new') {
            this.isEditMode = true;
            this.loadRole();
        }
    }

    loadPermissions() {
        this.permissionsService.getPermissions(1, 100).subscribe({
            next: (response) => {
                this.availablePermissions = response.data;
            },
            error: () => {
                this.snackBar.open('İzinler yüklenemedi', 'Kapat', {
                    duration: 3000,
                    horizontalPosition: 'end',
                    verticalPosition: 'top'
                });
            }
        });
    }

    loadRole() {
        this.loading = true;
        this.rolesService.getRole(this.roleId!).subscribe({
            next: (role) => {
                this.roleForm.patchValue({
                    name: role.name,
                    description: role.description,
                    status: role.status
                });
                this.selectedPermissions = role.permissions || [];
                this.loading = false;
            },
            error: () => {
                this.snackBar.open('Rol yüklenemedi', 'Kapat', {
                    duration: 3000,
                    horizontalPosition: 'end',
                    verticalPosition: 'top'
                });
                this.loading = false;
            }
        });
    }

    removePermission(permission: Permission) {
        this.selectedPermissions = this.selectedPermissions.filter(p => p._id !== permission._id);
    }

    onSubmit() {
        if (this.roleForm.valid) {
            this.loading = true;
            const roleData = {
                ...this.roleForm.value,
                permissions: this.selectedPermissions.map(p => ({ permissionId: p._id }))
            };

            const request = this.isEditMode
                ? this.rolesService.updateRole(this.roleId!, roleData)
                : this.rolesService.createRole(roleData);

            request.subscribe({
                next: () => {
                    this.snackBar.open(
                        `Rol başarıyla ${this.isEditMode ? 'güncellendi' : 'oluşturuldu'}`,
                        'Kapat',
                        {
                            duration: 3000,
                            horizontalPosition: 'end',
                            verticalPosition: 'top'
                        }
                    );
                    this.router.navigate(['/roles']);
                },
                error: () => {
                    this.snackBar.open(
                        `Rol ${this.isEditMode ? 'güncellenirken' : 'oluşturulurken'} bir hata oluştu`,
                        'Kapat',
                        {
                            duration: 3000,
                            horizontalPosition: 'end',
                            verticalPosition: 'top'
                        }
                    );
                    this.loading = false;
                }
            });
        }
    }

    cancel() {
        this.router.navigate(['/roles']);
    }
}
