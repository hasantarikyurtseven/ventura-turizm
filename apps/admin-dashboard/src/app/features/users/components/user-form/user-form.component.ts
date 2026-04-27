import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersService, User } from '../../services/users.service';
import { RolesService } from '../../../roles/services/roles.service';

@Component({
    selector: 'app-user-form',
    standalone: false,
    templateUrl: './user-form.component.html',
    styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
    userForm: FormGroup;
    isEditMode = false;
    userId: string | null = null;
    loading = false;
    hidePassword = true;
    statuses = [
        { label: 'Aktif', value: 'active' },
        { label: 'Pasif', value: 'passive' }
    ];
    availableRoles: any[] = [];

    constructor(
        private fb: FormBuilder,
        private usersService: UsersService,
        private rolesService: RolesService,
        private route: ActivatedRoute,
        private router: Router,
        private snackBar: MatSnackBar
    ) {
        this.userForm = this.fb.group({
            name: ['', Validators.required],
            surName: ['', Validators.required],
            username: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phone: [''],
            passwordHash: [''],
            status: ['active', Validators.required],
            roles: [[]]
        });
    }

    ngOnInit() {
        this.loadRoles();
        
        this.userId = this.route.snapshot.paramMap.get('id');
        if (this.userId && this.userId !== 'new') {
            this.isEditMode = true;
            this.loadUser();
            // Password not required for edit
            this.userForm.get('passwordHash')?.clearValidators();
        } else {
            // Password required for create
            this.userForm.get('passwordHash')?.setValidators([Validators.required, Validators.minLength(6)]);
        }
        this.userForm.get('passwordHash')?.updateValueAndValidity();
    }

    loadRoles() {
        this.rolesService.getRoles(1, 100).subscribe({
            next: (response) => {
                this.availableRoles = response.data.filter(role => role.status === 'active');
            },
            error: (error) => {
                console.error('Error loading roles:', error);
                this.availableRoles = [];
            }
        });
    }

    loadUser() {
        this.loading = true;
        this.usersService.getUser(this.userId!).subscribe({
            next: (user) => {
                this.userForm.patchValue(user);
                this.loading = false;
            },
            error: () => {
                this.snackBar.open('Kullanıcı yüklenirken hata oluştu', 'Kapat', {
                    duration: 3000,
                    horizontalPosition: 'end',
                    verticalPosition: 'top'
                });
                this.loading = false;
            }
        });
    }

    onSubmit() {
        if (this.userForm.valid) {
            this.loading = true;
            const userData = this.userForm.value;

            // Remove password if empty in edit mode
            if (this.isEditMode && !userData.passwordHash) {
                delete userData.passwordHash;
            }

            const request = this.isEditMode
                ? this.usersService.updateUser(this.userId!, userData)
                : this.usersService.createUser(userData);

            request.subscribe({
                next: () => {
                    this.snackBar.open(
                        `Kullanıcı başarıyla ${this.isEditMode ? 'güncellendi' : 'oluşturuldu'}`,
                        'Kapat',
                        {
                            duration: 3000,
                            horizontalPosition: 'end',
                            verticalPosition: 'top'
                        }
                    );
                    this.router.navigate(['/users']);
                },
                error: () => {
                    this.snackBar.open(
                        `Kullanıcı ${this.isEditMode ? 'güncellenirken' : 'oluşturulurken'} hata oluştu`,
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
        this.router.navigate(['/users']);
    }
}
