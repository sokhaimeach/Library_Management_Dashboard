import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertSuccess } from '../../shared/components/alert-success/alert-success';
import { Alertservice } from '../../shared/components/alert-success/alertservice';
import { Bookservices } from '../services/bookservices/bookservices';
import { Book as BookI } from '../models/book.model';

type BorrowStatus = 'returned' | 'late' | 'overdue' | 'lost' | 'damaged';

interface Book {
  _id: string;
  title: string;
  cover_url: string;
  available_copies: number;
  author_name: string;
  category_name: string;
  price?: { $numberDecimal: string };
}

interface Member {
  _id: string;
  name: string;
  member_type: 'regular' | 'blacklist';
  contact: { phone_number: string; email: string };
}

interface BorrowRecord {
  _id: string;
  return_date: string | null;
  status: BorrowStatus;
  borrow_date: string;
  due_date: string;
  member_name: string;
  book_title: string;
}

@Component({
  selector: 'app-borrow-return',
  imports: [CommonModule, FormsModule, AlertSuccess],
  templateUrl: './borrow-return.html',
  styleUrl: './borrow-return.css',
})
export class BorrowReturn {

  constructor(private alert: Alertservice, private bookservice: Bookservices) {}

  memberItem = {
    name: '',
    contact: {
      phone_number: '',
      email: ''
    }
  }

  // ===== Dummy data (replace with backend later) =====
  books: BookI[] = [];

  members: Member[] = [
    {
      _id: '692dbe226422a173616fcc4e',
      name: 'Makara1',
      member_type: 'blacklist',
      contact: { phone_number: '0123456789', email: 'makara1@gmail.com' },
    },
    {
      _id: '692dbfa43ca0f71609d7e265',
      name: 'Tri',
      member_type: 'regular',
      contact: { phone_number: '0123456789', email: 'tri@gmail.com' },
    },
    {
      _id: '692dbfa43ca0f71609d7e266',
      name: 'Somnang',
      member_type: 'regular',
      contact: { phone_number: '0123456789', email: 'somnag@gmail.com' },
    },
  ];

  borrowRecords: BorrowRecord[] = [
    {
      _id: '6933ac30048d8959faaab20b',
      return_date: null,
      status: 'overdue',
      borrow_date: '2025-12-06T04:08:16.831Z',
      due_date: '2025-12-20T04:08:16.831Z',
      member_name: 'Makara1',
      book_title: 'Kolab Pailin',
    },
    {
      _id: '694671033070e4a41546db90',
      return_date: null,
      status: 'overdue',
      borrow_date: '2025-12-20T09:48:51.416Z',
      due_date: '2025-12-27T09:48:51.416Z',
      member_name: 'Tri',
      book_title: 'Kolab Pailin',
    },
  ];

  ngOnInit(): void {
    this.getAllBook();
  }

  getAllBook() {
    this.bookservice.getAllBooks("", "").subscribe({
      next: (res: any) => {
        this.books = res.data;
        console.log(this.books)
      }
    });
  }

  // ===== UI State =====
  tab: 'borrow' | 'return' = 'borrow';

  // search
  memberQuery = '';
  bookQuery = '';
  availabilityFilter: 'all' | 'available' = 'all';

  returnSearch = '';

  // selections
  selectedMember: Member | null = null;
  selectedBorrow: BorrowRecord | null = null;
  selectedBook: Book | null = null;

  // small modal update status
  statusModalBorrow: BorrowRecord | null = null;
  statuses: BorrowStatus[] = ['returned', 'late', 'lost', 'damaged'];

  // update status form (simple)
  updateStatus: BorrowStatus = 'returned';
  // damage_type: '' | 'can' | 'torn' | 'wet' | 'other' = '';
  // damage_fee: number | null = null;

  // damage type helpers
  statusItem = {
    status: '',
    damage_type: '',
    damage_fee: 0
  }
  removeFailed: boolean = false;
  isLittleDamage: boolean = true;
  checkDamageType(type: boolean) {
    this.isLittleDamage = type;

    if(type) {
      this.statusItem.damage_type = 'can';
    } else {
      this.statusItem.damage_type = 'cannot';
    }
  }

  selectStatus(b: BorrowStatus){
    this.statusItem.status = b;
    this.updateStatus = b;
  }

  // save status change
  saveStatus() {
    if(this.statusItem.damage_fee <=0 && this.updateStatus === 'damaged' && this.isLittleDamage) {
      this.removeFailed = true;
      return;  
    }

    if(this.selectedBorrow === null) return;


    this.alert.showAlert('','Update status successfully!');

    this.clearSelectUpdate();
    
  }

  clearSelectUpdate() {
    this.updateStatus = 'returned';
    this.statusItem = {
      status: '',
      damage_type: '',
      damage_fee: 0
    }
    this.isLittleDamage = true;
    this.removeFailed = false;
    this.statusModalBorrow = null;

    this.selectedBorrow = null;
  }


  // ===== Derived Lists =====
  get filteredMembers(): Member[] {
    const q = this.memberQuery.trim().toLowerCase();
    if (!q) return [];
    return this.members.filter(m =>
      m.name.toLowerCase().includes(q) || m._id.toLowerCase().includes(q)
    );
  }

  get filteredBooks(): BookI[] {
    const q = this.bookQuery.trim().toLowerCase();
    return this.books.filter(b => {
      const matchText =
        !q ||
        b.title.toLowerCase().includes(q) ||
        b.author_name.toLowerCase().includes(q) ||
        b.category_name.toLowerCase().includes(q);

      const matchAvail =
        this.availabilityFilter === 'all' ||
        (this.availabilityFilter === 'available' && b.available_copies > 0);

      return matchText && matchAvail;
    });
  }

  get activeBorrowRecords(): BorrowRecord[] {
    // active = not returned_date yet
    return this.borrowRecords.filter(r => r.return_date === null);
  }

  get filteredBorrowRecords(): BorrowRecord[] {
    const q = this.returnSearch.trim().toLowerCase();
    const list = this.activeBorrowRecords;

    if (!q) return list;

    return list.filter(r =>
      r._id.toLowerCase().includes(q) ||
      r.member_name.toLowerCase().includes(q) ||
      r.book_title.toLowerCase().includes(q) ||
      r.status.toLowerCase().includes(q)
    );
  }

  // ===== Borrow rules (simple) =====
  get memberHasActiveBorrow(): boolean {
    if (!this.selectedMember) return false;
    return this.borrowRecords.some(r => r.return_date === null && r.member_name === this.selectedMember!.name);
  }

  canBorrowThisBook(book: Book): boolean {
    if (!this.selectedMember) return false;
    if (this.selectedMember.member_type === 'blacklist') return false;
    if (this.memberHasActiveBorrow) return false;
    if (book.available_copies <= 0) return false;
    return true;
  }

  // ===== Actions =====
  selectMember(m: Member) {
    this.selectedMember = m;
    this.memberQuery = m.name;
  }

  clearMember() {
    this.selectedMember = null;
    this.memberQuery = '';

    this.selectedBook = null;
  }

  borrowBook(book: Book) {
    if (!this.selectedMember) return;

    this.selectedBook = book;
  }


  selectBorrowRecord(r: BorrowRecord) {
    this.selectedBorrow = r;
  }


  // ===== UI helpers =====
  statusBadge(status: BorrowStatus): string {
    if (status === 'returned') return 'text-bg-success';
    if (status === 'lost' || status === 'damaged') return 'text-bg-danger';
    if (status === 'late' || status === 'overdue') return 'text-bg-warning';
    return 'text-bg-secondary';
  }
}
