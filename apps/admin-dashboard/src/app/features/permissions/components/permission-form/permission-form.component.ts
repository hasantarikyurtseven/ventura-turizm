import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PermissionsService, Permission } from '../../services/permissions.service';

@Component({
    selector: 'app-permission-form',
    standalone: false,
    templateUrl: './permission-form.component.html',
    styleUrls: ['./permission-form.component.scss']
})
export class PermissionFormComponent implements OnInit {
    permissionForm: FormGroup;
    isEditMode = false;
    permissionId: string | null = null;
    loading = false;
    statuses = [
        { label: 'Aktif', value: 'active' },
        { label: 'Pasif', value: 'inactive' }
    ];

    constructor(
        private fb: FormBuilder,
        private permissionsService: PermissionsService,
        private route: ActivatedRoute,
        private router: Router,
        private snackBar: MatSnackBar
    ) {
        this.permissionForm = this.fb.group({
            code: ['', Validators.required],
            name: ['', Validators.required],
            module: ['', Validators.required],
            description: ['', Validators.required],
            status: ['active', Validators.required]
        });
    }

    ngOnInit() {
        this.permissionId = this.route.snapshot.paramMap.get('id');
        if (this.permissionId && this.permissionId !== 'new') {
            this.isEditMode = true;
            this.loadPermission();
        }
    }

    loadPermission() {
        this.loading = true;
        this.permissionsService.getPermission(this.permissionId!).subscribe({
            next: (permission) => {
                this.permissionForm.patchValue(permission);
                this.loading = false;
            },
            error: () => {
                this.snackBar.open('İzin yüklenemedi', 'Kapat', {
                    duration: 3000,
                    horizontalPosition: 'end',
                    verticalPosition: 'top'
                });
                this.loading = false;
            }
        });
    }

    onSubmit() {
        if (this.permissionForm.valid) {
            this.loading = true;
            const permissionData = this.permissionForm.value;

            const request = this.isEditMode
                ? this.permissionsService.updatePermission(this.permissionId!, permissionData)
                : this.permissionsService.createPermission(permissionData);

            request.subscribe({
                next: () => {
                    this.snackBar.open(
                        `İzin başarıyla ${this.isEditMode ? 'güncellendi' : 'oluşturuldu'}`,
                        'Kapat',
                        {
                            duration: 3000,
                            horizontalPosition: 'end',
                            verticalPosition: 'top'
                        }
                    );
                    this.router.navigate(['/permissions']);
                },
                error: () => {
                    this.snackBar.open(
                        `İzin ${this.isEditMode ? 'güncellenirken' : 'oluşturulurken'} bir hata oluştu`,
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
        this.router.navigate(['/permissions']);
    }
}
