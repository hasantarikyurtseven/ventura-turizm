import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';
import { AirlinesService, Airline } from '../../services/airlines.service';
import { ConfirmDialogComponent } from '../../../users/components/users-list/users-list.component';

@Component({
    selector: 'app-airlines-list',
    standalone: false,
    templateUrl: './airlines-list.component.html',
    styleUrls: ['./airlines-list.component.scss']
})
export class AirlinesListComponent implements OnInit {
    airlines: Airline[] = [];
    totalRecords = 0;
    loading = false;
    page = 1;
    limit = 10;
    searchTerm = '';
    displayedColumns: string[] = ['logo', 'code', 'name', 'status', 'actions'];

    constructor(
        private airlinesService: AirlinesService,
        private router: Router,
        private dialog: MatDialog,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit() {
        this.loadAirlines();
    }

    loadAirlines() {
        this.loading = true;
        this.airlinesService.getAirlines(this.page, this.limit, this.searchTerm).subscribe({
            next: (response) => {
                this.airlines = response.data;
                this.totalRecords = response.total;
                this.loading = false;
            },
            error: () => {
                this.snackBar.open('Havayolları yüklenemedi', 'Kapat', {
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
        this.loadAirlines();
    }

    onSearch() {
        this.page = 1;
        this.loadAirlines();
    }

    createAirline() {
        this.router.navigate(['/airlines/new']);
    }

    editAirline(airline: Airline) {
        this.router.navigate(['/airlines/edit', airline._id]);
    }

    deleteAirline(airline: Airline) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            data: {
                title: 'Havayolunu Sil',
                message: `${airline.name} (${airline.code}) silmek istediğinizden emin misiniz?`,
                confirmText: 'Sil',
                cancelText: 'İptal'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result && airline._id) {
                this.airlinesService.deleteAirline(airline._id).subscribe({
                    next: () => {
                        this.snackBar.open('Havayolu silindi', 'Kapat', {
                            duration: 3000,
                            horizontalPosition: 'end',
                            verticalPosition: 'top'
                        });
                        this.loadAirlines();
                    },
                    error: () => {
                        this.snackBar.open('Silme işlemi başarısız', 'Kapat', {
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
