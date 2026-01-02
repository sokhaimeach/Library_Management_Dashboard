import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilterDropdown } from '../../shared/components/filter-dropdown/filter-dropdown';
import { AlertSuccess } from '../../shared/components/alert-success/alert-success';
import { Alertservice } from '../../shared/components/alert-success/alertservice';
import { BorrowDatail, BorrowI, BorrowStatus, ReturnI } from '../models/borrow.model';
import { Borrowservice } from '../services/borrowservice/borrowservice';
declare const bootstrap: any;

@Component({
  selector: 'app-borrow-record',
  imports: [CommonModule, FormsModule, FilterDropdown, AlertSuccess],
  templateUrl: './borrow-record.html',
  styleUrl: './borrow-record.css',
})
export class BorrowRecord {
  item:ReturnI = {
    status: '',
    damage_type: 'can',
    damage_fee: 0,
  };

  // borrow data
  borrows = signal<BorrowI[]>([]);
  detail = signal<BorrowDatail | null>(null);
  filter: string = '';
  searchQuery: string = '';

  constructor(
    private alert: Alertservice,
    private borrowservice: Borrowservice
  ) {}
  ngOnInit(): void {
    this.getAllBorrowRecords();
  }

  // get all borrow records
  getAllBorrowRecords() {
    this.borrowservice.getAllBorrows(this.filter, this.searchQuery).subscribe({
      next: (res) => {
        this.borrows.set(res);
      },
    });
  }

  // selected for update modal
  selectedBorrowId = '';
  selectedStatus: BorrowStatus = 'returned';

  // for detail modal display
  selectedBorrowStatusDisplay = '';

  // actions
  openDetail(id: string) {
    this.borrowservice.getBorrowDetail(id).subscribe({
      next: (res) => {
        this.detail.set(res);

        const modalEl = document.getElementById('borrowDetailModal');
        if (!modalEl) return;

        const modal = new bootstrap.Modal(modalEl);
        modal.show();
      },
    });
  }

  openUpdateStatus(b: any) {
    this.selectedBorrowId = b._id;
    this.removeFailed = false;
    console.log(this.selectedBorrowId)
  }

  // damage type helpers
  removeFailed: boolean = false;
  isLittleDamage: boolean = true;
  checkDamageType(type: boolean) {
    this.isLittleDamage = type;

    if (type) {
      this.item.damage_type = 'can';
    } else {
      this.item.damage_type = 'cannot';
    }
  }

  saveStatus() {
    if (
      this.item.damage_fee && this.item.damage_fee <= 0 &&
      this.selectedStatus === 'damaged' &&
      this.isLittleDamage
    ) {
      this.removeFailed = true;
      return;
    }

    this.item.status = this.selectedStatus;
    this.borrowservice.updateBorrowStatus(this.selectedBorrowId, this.item).subscribe({
      next: (res) => {
        this.alert.showAlert('success', res.message);
        this.getAllBorrowRecords();
      },
      error: (err) => {
        this.alert.showAlert('error', err.error.message);
      }
    });
  }

  // helpers for UI badges
  statusClass(status: string) {
    return {
      'status-borrowed': status === 'borrowed',
      'status-returned': status === 'returned',
      'status-late': status === 'late',
      'status-overdue': status === 'overdue',
      'status-lost': status === 'lost',
      'status-damaged': status === 'damaged',
    };
  }

  statusIcon(status: string) {
    const map: any = {
      borrowed: 'bi-box-arrow-in-right',
      returned: 'bi-check-circle-fill',
      late: 'bi-exclamation-circle-fill',
      overdue: 'bi-alarm-fill',
      lost: 'bi-x-circle-fill',
      damaged: 'bi-tools',
    };
    return map[status] || 'bi-dot';
  }

  private titleCase(s: string) {
    if (!s) return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  // design filter options
  genreFilters = [
    { key: 'overdue', label: 'Overdue', checked: false },
    { key: 'returned', label: 'Returned', checked: false },
    { key: 'lost', label: 'Lost', checked: false },
    { key: 'late', label: 'Late', checked: false },
    { key: 'damaged', label: 'Damaged', checked: false },
  ];

  onFilterChange(selected: string[]) {
    this.filter = "";
    selected.forEach((select) => {
      this.filter += select + ",";
    });
    this.getAllBorrowRecords();
  }
}
