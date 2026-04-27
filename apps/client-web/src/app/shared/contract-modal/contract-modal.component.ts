import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ContractsService } from '../../core/contracts.service';

export interface ContractModalData {
  slug: string;
}

@Component({
  selector: 'app-contract-modal',
  templateUrl: './contract-modal.component.html',
  standalone: false,
  styleUrl: './contract-modal.component.scss',
})
export class ContractModalComponent implements OnInit {
  title = '';
  content: string | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private dialogRef: MatDialogRef<ContractModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ContractModalData,
    private contractsService: ContractsService
  ) {}

  ngOnInit(): void {
    const slug = this.data?.slug || '';
    if (!slug) {
      this.error = 'Sözleşme bulunamadı.';
      this.loading = false;
      return;
    }
    this.contractsService.getBySlug(slug).subscribe({
      next: (contract) => {
        this.loading = false;
        if (contract) {
          this.title = contract.title;
          this.content = contract.content;
        } else {
          this.error = 'Sözleşme içeriği yüklenemedi.';
        }
      },
      error: () => {
        this.loading = false;
        this.error = 'Sözleşme yüklenirken bir hata oluştu.';
      },
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
