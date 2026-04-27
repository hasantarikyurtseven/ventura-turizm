import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../../core/services/auth.service';
import { UsersService } from '../../services/users.service';

@Component({
    selector: 'app-user-profile',
    standalone: false,
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
    profileForm: FormGroup;
    passwordForm: FormGroup;
    loading = false;
    hidePassword = true;
    hideNewPassword = true;
    hideConfirmPassword = true;
    currentUser: any = null;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private usersService: UsersService,
        private router: Router,
        private snackBar: MatSnackBar
    ) {
        this.profileForm = this.fb.group({
            name: ['', Validators.required],
            surName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phone: ['']
        });

        this.passwordForm = this.fb.group({
            currentPassword: ['', Validators.required],
            newPassword: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required]
        }, { validators: this.passwordMatchValidator });
    }

    ngOnInit() {
        this.authService.currentUser$.subscribe(user => {
            if (user) {
                this.currentUser = user;
                this.loadUserProfile();
            }
        });
    }

    loadUserProfile() {
        if (!this.currentUser?.id) return;

        this.loading = true;
        this.usersService.getUser(this.currentUser.id).subscribe({
            next: (user) => {
                this.profileForm.patchValue({
                    name: user.name,
                    surName: user.surName,
                    email: user.email,
                    phone: user.phone || ''
                });
                this.loading = false;
            },
            error: (err) => {
                this.snackBar.open('Profil bilgileri yüklenirken hata oluştu', 'Kapat', {
                    duration: 3000
                });
                this.loading = false;
            }
        });
    }

    passwordMatchValidator(form: FormGroup) {
        const newPassword = form.get('newPassword');
        const confirmPassword = form.get('confirmPassword');
        
        if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
            confirmPassword.setErrors({ passwordMismatch: true });
        } else if (confirmPassword) {
            confirmPassword.setErrors(null);
        }
        return null;
    }

    onUpdateProfile() {
        if (this.profileForm.invalid) {
            this.profileForm.markAllAsTouched();
            return;
        }

        if (!this.currentUser?.id) return;

        this.loading = true;
        const formData = this.profileForm.value;
        
        this.usersService.updateUser(this.currentUser.id, formData).subscribe({
            next: (updatedUser) => {
                this.snackBar.open('Profil başarıyla güncellendi', 'Kapat', {
                    duration: 3000
                });
                // Update auth service with new user data
                this.authService.updateCurrentUser({
                    name: updatedUser.name,
                    surName: updatedUser.surName,
                    email: updatedUser.email
                });
                this.currentUser = this.authService.getCurrentUser();
                this.loading = false;
            },
            error: (err) => {
                this.snackBar.open('Profil güncellenirken hata oluştu', 'Kapat', {
                    duration: 3000
                });
                this.loading = false;
            }
        });
    }

    onChangePassword() {
        if (this.passwordForm.invalid) {
            this.passwordForm.markAllAsTouched();
            return;
        }

        if (!this.currentUser?.id) return;

        this.loading = true;
        const { currentPassword, newPassword } = this.passwordForm.value;
        
        this.usersService.changePassword(this.currentUser.id, currentPassword, newPassword).subscribe({
            next: () => {
                this.snackBar.open('Şifre başarıyla değiştirildi', 'Kapat', {
                    duration: 3000
                });
                this.passwordForm.reset();
                this.loading = false;
            },
            error: (err) => {
                this.snackBar.open('Şifre değiştirilirken hata oluştu', 'Kapat', {
                    duration: 3000
                });
                this.loading = false;
            }
        });
    }

    getInitials(name: string | undefined, surname: string | undefined): string {
        if (!name && !surname) return '';
        const n = name ? name.charAt(0).toUpperCase() : '';
        const s = surname ? surname.charAt(0).toUpperCase() : '';
        return `${n}${s}`;
    }
}
