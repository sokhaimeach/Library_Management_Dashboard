import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilterDropdown } from '../../shared/components/filter-dropdown/filter-dropdown';
import { Inputs } from '../../shared/components/inputs/inputs';
declare const bootstrap: any;

@Component({
  selector: 'app-penalty',
  imports: [FormsModule, CommonModule, FilterDropdown],
  templateUrl: './penalty.html',
  styleUrl: './penalty.css',
})
export class Penalty implements OnInit{
  statuses: PenaltyStatus[] = ['paid', 'replaced', 'returned'];

  item = {
    borrow_id: "",
    penalty_type: "",
    amount: 0,
    note: "",
  }

  searchText = '';
filterBorrowData: any[] = [];

borrowData = [
  { borrow_id: "69319012ef89b4da2f56e321", member_name: "Sophea"},
  { borrow_id: "69319012ef89b4da2f56e322", member_name: "Rithy"},
  { borrow_id: "69319012ef89b4da2f56e323", member_name: "Vanna"},
  { borrow_id: "69319012ef89b4da2f56e324", member_name: "Sreymao"},
  { borrow_id: "69319012ef89b4da2f56e325", member_name: "Dara"},
  { borrow_id: "69319012ef89b4da2f56e326", member_name: "Chenda"},
  { borrow_id: "69319012ef89b4da2f56e327", member_name: "Sokun"},
  { borrow_id: "69319012ef89b4da2f56e328", member_name: "Maly"},
];


openDropdown() {
  // keep dropdown open by ensuring it has items
  this.filterBorrowData = this.borrowData;
}

onSearchChange() {
  const q = (this.searchText || '').toLowerCase().trim();
  this.filterBorrowData = !q
    ? [...this.borrowData]
    : this.borrowData.filter(b =>
        b.member_name.toLowerCase().includes(q) ||
        b.borrow_id.toLowerCase().includes(q)
      );
}

selectBorrowId(borrow: any) {
  this.searchText = borrow.member_name;
  this.item.borrow_id = borrow.borrow_id;
  // Bootstrap will auto-close dropdown after click (autoClose=true)
}



  // filters
  q = '';
  statusFilter: 'all' | PenaltyStatus = 'all';

  // data
  penalties: PenaltyListItem[] = [
    {
      _id: '69351b761f34e4d5156f6a2d',
      penalty_type: 'lost',
      amount: { $numberDecimal: '4.5' },
      status: 'pending',
      note: 'Book lost',
      received_at: null,
      created_at: '2025-12-07T06:15:18.888Z',
      member_name: 'Makara1',
      phone_number: '0123456789',
    },
    // add more demo items if you want
  ];

  filtered: PenaltyListItem[] = [];

  detail: PenaltyDetail | null = null;

  createForm = {
    member_name: '',
    phone_number: '',
    penalty_type: 'lost',
    amount: 0,
    note: '',
  };

  ngOnInit(): void {
    this.applyFilter();
    this.filterBorrowData = [...this.borrowData];
  }

  trackById(_: number, item: PenaltyListItem) {
    return item._id;
  }

  applyFilter() {
    const q = this.q.trim().toLowerCase();

    this.filtered = this.penalties.filter((p) => {
      const matchesQ =
        !q ||
        p.member_name.toLowerCase().includes(q) ||
        p.phone_number.toLowerCase().includes(q) ||
        p._id.toLowerCase().includes(q);

      const matchesStatus = this.statusFilter === 'all' ? true : p.status === this.statusFilter;

      return matchesQ && matchesStatus;
    });
  }

  // --- UI helpers (style like screenshot) ---
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
    // Replace with API call:
    // this.penaltyService.getPenaltyDetail(id).subscribe(res => this.detail = res)

    // demo detail using your provided structure
    this.detail = {
      _id: '69351b761f34e4d5156f6a2d',
      penalty_type: 'lost',
      amount: { $numberDecimal: '4.5' },
      status: 'pending',
      note: 'Book lost',
      received_at: null,
      created_at: '2025-12-07T06:15:18.888Z',
      member: {
        _id: '692dbe226422a173616fcc4e',
        name: 'Makara1',
        contact: { phone_number: '0123456789', email: 'makara1@gmail.com' },
        member_type: 'blacklist',
        join_date: '2025-12-01T16:11:14.339Z',
      },
      borrow_info: {
        return_date: null,
        status: 'lost',
        borrow_date: '2025-12-06T04:08:16.831Z',
        due_date: '2025-12-20T04:08:16.831Z',
      },
      book: {
        title: 'Kolab Pailin',
        cover_url: 'https://www.elibraryofcambodia.org/wp-content/uploads/2014/04/Kolab-Pailin-book-cover.jpg',
        price: { $numberDecimal: '4.5' },
        total_copies: 3,
        category: 'Dramatic',
        author_name: 'Long',
      },
    };

    const modalEl = document.getElementById('penaltyDetailModal');
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  }

  saveDetailStatus() {
    if (!this.detail) return;
    this.setStatus(this.detail._id, this.detail.status);
  }

  setStatus(id: string, status: PenaltyStatus) {
    const p = this.penalties.find((x) => x._id === id);
    if (p) {
      p.status = status;
      p.received_at = status === 'paid' ? new Date().toISOString() : p.received_at;
    }

    if (this.detail && this.detail._id === id) {
      this.detail.status = status;
      this.detail.received_at = status === 'paid' ? new Date().toISOString() : this.detail.received_at;
    }

    this.applyFilter();

    // Replace with API call:
    // this.penaltyService.updateStatus(id, status).subscribe(...)
  }

  deletePenalty(id: string) {
    // Replace with confirm modal if you want
    this.penalties = this.penalties.filter((x) => x._id !== id);
    this.applyFilter();

    // close detail modal if needed
    if (this.detail?._id === id) this.detail = null;

    // Replace with API call:
    // this.penaltyService.deletePenalty(id).subscribe(...)
  }

  openCreateModal() {
    this.createForm = {
      member_name: '',
      phone_number: '',
      penalty_type: 'lost',
      amount: 0,
      note: '',
    };

    const modalEl = document.getElementById('createPenaltyModal');
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  }

  createPenalty() {
    const newItem: PenaltyListItem = {
      _id: crypto?.randomUUID?.() ?? `id_${Date.now()}`,
      penalty_type: this.createForm.penalty_type,
      amount: { $numberDecimal: String(this.createForm.amount ?? 0) },
      status: 'pending',
      note: this.createForm.note,
      received_at: null,
      created_at: new Date().toISOString(),
      member_name: this.createForm.member_name,
      phone_number: this.createForm.phone_number,
    };

    this.penalties = [newItem, ...this.penalties];
    this.applyFilter();

    // close modal
    const modalEl = document.getElementById('createPenaltyModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal?.hide();

    // Replace with API call:
    // this.penaltyService.createPenalty(newItem).subscribe(...)
  }


  // delete modal
  deletePenaltyId: string = '';
  openDeleteModal(id: string){
    this.deletePenaltyId = id;
  }




  // design filter options
  genreFilters = [
    { key: 'Khmer', label: 'Khmer', checked: false },
    { key: 'American', label: 'American', checked: false },
    { key: 'Chinese', label: 'Chinese', checked: false }
  ];

onFilterChange(selected: string[]) {
  // call API here
  console.log(selected);
}
}



type PenaltyStatus = 'pending' | 'paid' | 'replaced' | 'returned';

interface MoneyDecimal {
  $numberDecimal: string;
}

interface PenaltyListItem {
  _id: string;
  penalty_type: string;
  amount: MoneyDecimal;
  status: PenaltyStatus;
  note: string;
  received_at: string | null;
  created_at: string;
  member_name: string;
  phone_number: string;
}

interface PenaltyDetail {
  _id: string;
  penalty_type: string;
  amount: MoneyDecimal;
  status: PenaltyStatus;
  note: string;
  received_at: string | null;
  created_at: string;
  member: {
    _id: string;
    name: string;
    contact: { phone_number: string; email: string };
    member_type: string;
    join_date: string;
  };
  borrow_info: {
    return_date: string | null;
    status: string;
    borrow_date: string;
    due_date: string;
  };
  book: {
    title: string;
    cover_url: string;
    price: MoneyDecimal;
    total_copies: number;
    category: string;
    author_name: string;
  };
}