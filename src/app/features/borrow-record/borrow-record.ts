import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilterDropdown } from '../../shared/components/filter-dropdown/filter-dropdown';
import { AlertSuccess } from '../../shared/components/alert-success/alert-success';
import { Alertservice } from '../../shared/components/alert-success/alertservice';

@Component({
  selector: 'app-borrow-record',
  imports: [CommonModule, FormsModule, FilterDropdown, AlertSuccess],
  templateUrl: './borrow-record.html',
  styleUrl: './borrow-record.css',
})
export class BorrowRecord {

  constructor(private alert: Alertservice) {}

  item = {
    status: '',
    damage_type: '',
    damage_fee: 0
  }



  q = '';
  statusFilter = 'all';

  // borrow data
  borrows: BorrowRow[] = [
    {
      _id: '6933ac30048d8959faaab20b',
      return_date: null,
      status: 'damaged',
      borrow_date: '2025-12-06T04:08:16.831Z',
      due_date: '2025-12-20T04:08:16.831Z',
      member_name: 'Makara1',
      book_title: 'Kolab Pailin',
    },
    {
      _id: '694671033070e4a41546db90',
      return_date: null,
      status: 'damaged',
      borrow_date: '2025-12-20T09:48:51.416Z',
      due_date: '2025-12-27T09:48:51.416Z',
      member_name: 'Tri',
      book_title: 'Kolab Pailin',
    },
  ];

  // detail sample (you can replace by API later)
  detail: any = {
    _id: '694671033070e4a41546db90',
    member: {
      _id: '692dbfa43ca0f71609d7e265',
      name: 'Tri',
      contact: { phone_number: '0123456789', email: 'tri@gmail.com' },
      member_type: 'regular',
      join_date: '2025-12-01T16:17:40.255Z',
    },
    book: {
      title: 'Kolab Pailin',
      cover_url:
        'https://www.elibraryofcambodia.org/wp-content/uploads/2014/04/Kolab-Pailin-book-cover.jpg',
      price: { $numberDecimal: '4.5' },
      total_copies: 3,
      category: 'Dramatic',
      author_name: 'Long',
    },
    user: {
      username: 'Sokhai',
      contact: { phone_number: '0123456789', email: 'sokhai@gmail.com' },
    },
  };

  // selected for update modal
  selectedBorrowId = '';
  selectedStatus: BorrowStatus = 'returned';

  // for detail modal display
  selectedBorrowStatusDisplay = '';

  // actions
  openDetail(id: string) {
    // later: call API to load detail by id
    // now: just update a label based on list
    const row = this.borrows.find((x) => x._id === id);
    this.selectedBorrowStatusDisplay = row ? this.titleCase(row.status) : '—';
  }

  openUpdateStatus(b: any) {
    this.selectedBorrowId = b._id;
    this.removeFailed = false;
  }

  // damage type helpers
  removeFailed: boolean = false;
  isLittleDamage: boolean = true;
  checkDamageType(type: boolean) {
    this.isLittleDamage = type;

    if(type) {
      this.item.damage_type = 'can';
    } else {
      this.item.damage_type = 'cannot';
    }
  }

  saveStatus() {

    if(this.item.damage_fee <=0 && this.selectedStatus === 'damaged' && this.isLittleDamage) {
      this.removeFailed = true;
      return;
    }

    this.item.status = this.selectedStatus;
    this.alert.showAlert('','Borrow status updated successfully!');
    const row = this.borrows.find((x) => x._id === this.selectedBorrowId);
    if (!row) return;

    row.status = this.selectedStatus;
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

  private toDateInput(iso: string) {
    // convert ISO to yyyy-mm-dd for input[type=date]
    const d = new Date(iso);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
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
    // call API here
    console.log(selected);
  }
}

type BorrowStatus = "overdue" | "returned" | "lost" | "late" | "damaged";

interface BorrowRow {
  _id: string;
  return_date: string | null;  // ✅ important
  status: BorrowStatus;
  borrow_date: string;
  due_date: string;
  member_name: string;
  book_title: string;
}