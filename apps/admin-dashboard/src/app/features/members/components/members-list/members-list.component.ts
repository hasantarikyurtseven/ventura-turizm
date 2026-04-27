import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MembersService, Member, MemberStats } from '../../services/members.service';

@Component({
  selector: 'app-members-list',
  standalone: false,
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.scss'],
})
export class MembersListComponent implements OnInit {
  members: Member[] = [];
  totalRecords = 0;
  loading = false;
  page = 1;
  limit = 10;
  searchTerm = '';

  displayedColumns: string[] = [
    'member',
    'email',
    'phone',
    'emailVerified',
    'status',
    'createdAt',
    'actions',
  ];

  // Filter
  statusFilter = '';
  emailVerifiedFilter = '';
  showFilters = false;

  statusOptions = [
    { value: '', label: 'Tüm Durumlar' },
    { value: 'active', label: 'Aktif' },
    { value: 'pending', label: 'Beklemede' },
    { value: 'suspended', label: 'Askıya Alınmış' },
  ];

  emailVerifiedOptions = [
    { value: '', label: 'Tümü' },
    { value: 'true', label: 'Doğrulanmış' },
    { value: 'false', label: 'Doğrulanmamış' },
  ];

  stats: MemberStats | null = null;

  constructor(
    private membersService: MembersService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadMembers();
  }

  loadStats(): void {
    this.membersService.getStats().subscribe({
      next: (stats) => (this.stats = stats),
      error: () => {},
    });
  }

  loadMembers(): void {
    this.loading = true;
    this.membersService
      .getMembers(
        this.page,
        this.limit,
        this.searchTerm || undefined,
        this.statusFilter || undefined,
        this.emailVerifiedFilter || undefined,
      )
      .subscribe({
        next: (response) => {
          this.members = response.data;
          this.totalRecords = response.total;
          this.loading = false;
        },
        error: () => {
          this.snackBar.open('Müşteriler yüklenemedi', 'Kapat', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
          });
          this.loading = false;
        },
      });
  }

  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.limit = event.pageSize;
    this.loadMembers();
  }

  onSearch(): void {
    this.page = 1;
    this.loadMembers();
  }

  onFilterChange(): void {
    this.page = 1;
    this.loadMembers();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = '';
    this.emailVerifiedFilter = '';
    this.page = 1;
    this.loadMembers();
  }

  hasActiveFilters(): boolean {
    return !!(this.statusFilter || this.emailVerifiedFilter);
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'active':
        return 'Aktif';
      case 'pending':
        return 'Beklemede';
      case 'suspended':
        return 'Askıda';
      default:
        return status;
    }
  }

  changeStatus(member: Member, newStatus: string): void {
    this.membersService.updateStatus(member._id, newStatus).subscribe({
      next: () => {
        this.snackBar.open('Müşteri durumu güncellendi', 'Kapat', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
        });
        this.loadMembers();
        this.loadStats();
      },
      error: () => {
        this.snackBar.open('Durum güncellenirken hata oluştu', 'Kapat', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
        });
      },
    });
  }
}
