import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContractsService, Contract } from '../../services/contracts.service';

@Component({
    selector: 'app-contracts-list',
    standalone: false,
    templateUrl: './contracts-list.component.html',
    styleUrls: ['./contracts-list.component.scss']
})
export class ContractsListComponent implements OnInit {
    contracts: Contract[] = [];
    loading = false;
    displayedColumns: string[] = ['title', 'slug', 'actions'];

    constructor(
        private contractsService: ContractsService,
        private router: Router,
        private snackBar: MatSnackBar
    ) { }

    createContract() {
        this.router.navigate(['/contracts/new']);
    }

    editContract(contract: Contract) {
        if (contract._id) {
            this.router.navigate(['/contracts/edit', contract._id]);
        }
    }

    ngOnInit() {
        this.loadContracts();
    }

    loadContracts() {
        this.loading = true;
        this.contractsService.getContracts().subscribe({
            next: (response) => {
                this.contracts = response.data || [];
                this.loading = false;
            },
            error: () => {
                this.snackBar.open('Sözleşmeler yüklenemedi', 'Kapat', {
                    duration: 3000,
                    horizontalPosition: 'end',
                    verticalPosition: 'top'
                });
                this.loading = false;
            }
        });
    }
}
