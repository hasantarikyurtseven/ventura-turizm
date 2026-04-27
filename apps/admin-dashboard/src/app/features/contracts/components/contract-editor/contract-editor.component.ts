import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContractsService, Contract } from '../../services/contracts.service';

@Component({
    selector: 'app-contract-editor',
    standalone: false,
    templateUrl: './contract-editor.component.html',
    styleUrls: ['./contract-editor.component.scss']
})
export class ContractEditorComponent implements OnInit {
    form: FormGroup;
    isEditMode = false;
    contractId: string | null = null;
    loading = false;
    saving = false;
    editorModules = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ header: [1, 2, 3, false] }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link'],
            ['clean']
        ]
    };

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private contractsService: ContractsService,
        private snackBar: MatSnackBar
    ) {
        this.form = this.fb.group({
            title: ['', [Validators.required, Validators.maxLength(200)]],
            content: ['']
        });
    }

    ngOnInit() {
        this.contractId = this.route.snapshot.paramMap.get('id');
        this.isEditMode = !!this.contractId;
        if (this.isEditMode) {
            this.loadContract(this.contractId!);
        }
    }

    loadContract(id: string) {
        this.loading = true;
        this.contractsService.getContract(id).subscribe({
            next: (c: Contract) => {
                this.form.patchValue({
                    title: c.title || '',
                    content: c.content || ''
                });
                this.loading = false;
            },
            error: () => {
                this.loading = false;
                this.snackBar.open('Sözleşme yüklenemedi', 'Kapat', { duration: 3000 });
                this.router.navigate(['/contracts']);
            }
        });
    }

    save() {
        if (this.form.invalid || this.saving) return;
        this.saving = true;
        const title = this.form.get('title')?.value?.trim() ?? '';
        const content = this.form.get('content')?.value ?? '';

        if (this.isEditMode && this.contractId) {
            this.contractsService.updateContract(this.contractId, { title, content }).subscribe({
                next: () => {
                    this.snackBar.open('Sözleşme güncellendi', 'Kapat', { duration: 3000 });
                    this.saving = false;
                },
                error: () => {
                    this.snackBar.open('Güncelleme başarısız', 'Kapat', { duration: 3000 });
                    this.saving = false;
                }
            });
        } else {
            this.contractsService.createContract({ title, content }).subscribe({
                next: () => {
                    this.snackBar.open('Sözleşme oluşturuldu', 'Kapat', { duration: 3000 });
                    this.saving = false;
                    this.router.navigate(['/contracts']);
                },
                error: () => {
                    this.snackBar.open('Oluşturma başarısız', 'Kapat', { duration: 3000 });
                    this.saving = false;
                }
            });
        }
    }

    back() {
        this.router.navigate(['/contracts']);
    }
}
