import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AirlinesService, Airline } from '../../services/airlines.service';

@Component({
    selector: 'app-airline-form',
    standalone: false,
    templateUrl: './airline-form.component.html',
    styleUrls: ['./airline-form.component.scss']
})
export class AirlineFormComponent implements OnInit {
    airlineForm: FormGroup;
    isEditMode = false;
    airlineId: string | null = null;
    loading = false;
    statuses = [
        { label: 'Aktif', value: 'active' },
        { label: 'Pasif', value: 'passive' }
    ];

    constructor(
        private fb: FormBuilder,
        private airlinesService: AirlinesService,
        private route: ActivatedRoute,
        private router: Router,
        private snackBar: MatSnackBar
    ) {
        this.airlineForm = this.fb.group({
            code: ['', [Validators.required, Validators.maxLength(5)]],
            name: ['', Validators.required],
            logoUrl: [''],
            status: ['active', Validators.required]
        });
    }

    ngOnInit() {
        this.airlineId = this.route.snapshot.paramMap.get('id');
        if (this.airlineId && this.airlineId !== 'new') {
            this.isEditMode = true;
            this.loadAirline();
        }
    }

    loadAirline() {
        this.loading = true;
        this.airlinesService.getAirline(this.airlineId!).subscribe({
            next: (airline: Airline) => {
                this.airlineForm.patchValue({
                    code: airline.code,
                    name: airline.name,
                    logoUrl: airline.logoUrl || '',
                    status: airline.status || 'active'
                });
                if (this.isEditMode) {
                    this.airlineForm.get('code')?.disable();
                }
                this.loading = false;
            },
            error: () => {
                this.snackBar.open('Havayolu yüklenemedi', 'Kapat', {
                    duration: 3000,
                    horizontalPosition: 'end',
                    verticalPosition: 'top'
                });
                this.loading = false;
            }
        });
    }

    onSubmit() {
        if (this.airlineForm.invalid) {
            this.airlineForm.markAllAsTouched();
            return;
        }
        const value = this.airlineForm.getRawValue();
        const payload = {
            code: (value.code || '').trim().toUpperCase(),
            name: (value.name || '').trim(),
            logoUrl: (value.logoUrl || '').trim() || undefined,
            status: value.status
        };

        this.loading = true;
        if (this.isEditMode && this.airlineId) {
            this.airlinesService.updateAirline(this.airlineId, payload).subscribe({
                next: () => {
                    this.snackBar.open('Havayolu güncellendi', 'Kapat', {
                        duration: 3000,
                        horizontalPosition: 'end',
                        verticalPosition: 'top'
                    });
                    this.router.navigate(['/airlines']);
                },
                error: (err) => {
                    this.snackBar.open(err.error?.message || 'Güncelleme başarısız', 'Kapat', {
                        duration: 3000,
                        horizontalPosition: 'end',
                        verticalPosition: 'top'
                    });
                    this.loading = false;
                }
            });
        } else {
            this.airlinesService.createAirline(payload).subscribe({
                next: () => {
                    this.snackBar.open('Havayolu eklendi', 'Kapat', {
                        duration: 3000,
                        horizontalPosition: 'end',
                        verticalPosition: 'top'
                    });
                    this.router.navigate(['/airlines']);
                },
                error: (err) => {
                    this.snackBar.open(err.error?.message || 'Ekleme başarısız', 'Kapat', {
                        duration: 3000,
                        horizontalPosition: 'end',
                        verticalPosition: 'top'
                    });
                    this.loading = false;
                }
            });
        }
    }

    cancel() {
        this.router.navigate(['/airlines']);
    }
}
