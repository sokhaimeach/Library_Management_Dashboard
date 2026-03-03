import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilterDropdown } from '../../shared/components/filter-dropdown/filter-dropdown';
import {
  PenaltyDetail,
  PenaltyItem,
  PenaltyListItem,
  PenaltyStatus,
  PenaltyType,
} from '../models/penalty.model';
import { Penaltyservice } from '../services/penaltyservice/penaltyservice';
import { BorrowI } from '../models/borrow.model';
import { Borrowservice } from '../services/borrowservice/borrowservice';
import { Alertservice } from '../../shared/components/alert-success/alertservice';
import { AlertSuccess } from '../../shared/components/alert-success/alert-success';
import { TruncatePipe } from '../../shared/pipes/truncate-pipe';
import { LoadingService } from '../../core/services/loading.service';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader/skeleton-loader';
declare const bootstrap: any;

@Component({
  selector: 'app-penalty',
  imports: [FormsModule, CommonModule, FilterDropdown, AlertSuccess, TruncatePipe, SkeletonLoaderComponent],
  templateUrl: './penalty.html',
  styleUrl: './penalty.css',
})
export class Penalty implements OnInit {
  statuses: PenaltyStatus[] = ['paid', 'replaced', 'returned'];

  item: PenaltyItem = {
    borrow_id: '',
    penalty_type: 'lost',
    amount: 0,
    note: '',
  };

  penalties = signal<PenaltyListItem[]>([]);
  searchQuery: string = '';
  filter: string = '';

  detail = signal<PenaltyDetail>({
    _id: '',
    penalty_type: 'lost',
    amount: 0,
    status: 'pending',
    note: '',
    received_at: null,
    created_at: '',
    member: {
      _id: '',
      name: '',
      contact: { phone_number: '', email: '' },
      member_type: '',
      join_date: '',
    },
    borrow_info: {
      return_date: null,
      status: '',
      borrow_date: '',
      due_date: '',
    },
    book: {
      title: '',
      cover_url: '',
      price: 0,
      total_copies: 0,
      category: '',
      author_name: '',
    },
  });
  detailStatus: PenaltyStatus = "paid";

  searchText = '';
  filterBorrowData: BorrowI[] = [];

  borrowData: BorrowI[] = [];

  constructor(
    private penaltyservice: Penaltyservice,
    private borrowservice: Borrowservice,
    private alert: Alertservice,
    public loading: LoadingService
  ) { }
  ngOnInit(): void {
    this.getAllPenalties();
    this.getAllBorrow();
    // this.applyFilter();
  }

  getAllPenalties() {
    this.loading.show();
    this.penaltyservice
      .getAllPenalties(this.filter, this.searchQuery)
      .subscribe({
        next: (res) => {
          this.penalties.set(res.data);
          this.loading.hide();
        },
        error: (err) => {
          console.error(err);
          this.loading.hide();
        }
      });
  }

  createPenalty() {
    this.penaltyservice.createNewPenalty(this.item).subscribe({
      next: (res) => {
        this.alert.showAlert('success', res.message);
        this.getAllPenalties();
      },
      error: (err) => {
        this.alert.showAlert('error', err.error?.message);
      },
    });

    // close modal
    const modalEl = document.getElementById('createPenaltyModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal?.hide();
  }

  // get all borrows
  getAllBorrow() {
    this.borrowservice.getAllBorrows('overdue', '').subscribe({
      next: (res) => {
        this.borrowData = res;
        this.filterBorrowData = [...this.borrowData];
      },
    });
  }

  saveDetailStatus() {
    if (!this.detail() || !this.detailStatus) return;

    this.setStatus(this.detail()._id, this.detailStatus);
  }

  setStatus(id: string, status: PenaltyStatus) {
    this.penaltyservice.updatePenaltyStatus(id, status).subscribe({
      next: (res) => {
        this.alert.showAlert("success", res.message);
        this.getAllPenalties();
      },
      error: (err) => {
        this.alert.showAlert("error", err.error?.message);
      }
    });
  }

  deletePenalty(id: string) {
    this.penaltyservice.deletePenalty(id).subscribe({
      next: (res) => {
        this.alert.showAlert("success", res.message);
        this.getAllPenalties();
      },
      error: (err) => {
        this.alert.showAlert("error", err.error?.message);
      }
    });
  }



  openDropdown() {
    // keep dropdown open by ensuring it has items
    this.filterBorrowData = this.borrowData;
  }

  onSearchChange() {
    const q = (this.searchText || '').toLowerCase().trim();
    this.filterBorrowData = !q
      ? [...this.borrowData]
      : this.borrowData.filter(
        (b) =>
          b.member_name.toLowerCase().includes(q) ||
          b._id.toLowerCase().includes(q)
      );
  }

  selectBorrowId(borrow: BorrowI) {
    this.searchText = borrow.member_name;
    this.item.borrow_id = borrow._id;
  }


  trackById(_: number, item: PenaltyListItem) {
    return item._id;
  }

  // --- UI helpers ---
  shortId(id: string) {
    return id?.slice(-6) || id;
  }

  code(p: PenaltyListItem) {
    // like "A4", "B2" style
    const first = (p.member_name?.[0] || 'M').toUpperCase();
    const last = (p._id?.slice(-1) || '0').toUpperCase();
    return `${first}${last}`;
  }

  codeColor(p: PenaltyListItem) {
    const map: Record<PenaltyStatus, string> = {
      pending: '#0ea5a4',
      paid: '#2563eb',
      replaced: '#f59e0b',
      returned: '#16a34a',
    };
    return map[p.status];
  }

  statusMeta(status: PenaltyStatus) {
    const meta: Record<PenaltyStatus, { pillClass: string; icon: string }> = {
      pending: { pillClass: 'pill-pending', icon: 'bi-hourglass-split' },
      paid: { pillClass: 'pill-paid', icon: 'bi-check-circle' },
      replaced: { pillClass: 'pill-replaced', icon: 'bi-arrow-repeat' },
      returned: { pillClass: 'pill-returned', icon: 'bi-box-arrow-in-left' },
    };
    return meta[status];
  }

  formatTime(iso: string) {
    try {
      const d = new Date(iso);
      const time = d.toLocaleString().split(', ');
      return time[1];
    } catch {
      return iso;
    }
  }

  formatDate(iso: string) {
    try {
      const d = new Date(iso);
      return d.toLocaleString();
    } catch {
      return iso;
    }
  }

  // --- actions ---
  openDetail(id: string) {
    this.penaltyservice.getPenaltyDetail(id).subscribe({
      next: (res) => {
        this.detail.set(res.data);
      },
    });
  }

  openCreateModal() {
    const modalEl = document.getElementById('createPenaltyModal');
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  }

  // delete modal
  deletePenaltyId: string = '';
  openDeleteModal(id: string) {
    this.deletePenaltyId = id;
  }

  // return status 
  returnStatus(status: PenaltyType): PenaltyStatus[] {
    if (status === "lost") {
      return ["paid", "replaced", "returned"];
    } else if (status === "late") {
      return ["paid"];
    } else {
      return ["paid", "replaced"];
    }
  }

  // design filter options
  genreFilters = [
    { key: 'pending', label: 'Pending', checked: false },
    { key: 'paid', label: 'Paid', checked: false },
    { key: 'returned', label: 'Returned', checked: false },
    { key: 'replaced', label: 'Replaced', checked: false },
  ];

  onFilterChange(selected: string[]) {
    this.filter = '';
    selected.forEach((select) => {
      this.filter += select + ',';
    });
    this.getAllPenalties();
  }
}
