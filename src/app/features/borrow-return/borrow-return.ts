import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertSuccess } from '../../shared/components/alert-success/alert-success';
import { Alertservice } from '../../shared/components/alert-success/alertservice';
import { Bookservices } from '../services/bookservices/bookservices';
import { Book as BookI } from '../models/book.model';
import { Memberservice } from '../services/memberservice/memberservice';
import { MemberI, MemberItem } from '../models/member.modal';
import { Borrowservice } from '../services/borrowservice/borrowservice';
import { BorrowI } from '../models/borrow.model';

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

  constructor(private alert: Alertservice,
    private bookservice: Bookservices,
    private memberservice: Memberservice,
    private borrowservice: Borrowservice) {}

  memberItem: MemberItem = {
    name: '',
    contact: {
      phone_number: '',
      email: ''
    }
  }

  // ===== Dummy data (replace with backend later) =====
  books: BookI[] = [];

  members = signal<MemberI[]>([]);

  borrowRecords = signal<BorrowI[]>([]);

  ngOnInit(): void {
    this.getAllBook();
    this.getAllMemberInfo();
    this.getBorrowRecord();
  }

  getAllBook() {
    this.bookservice.getAllBooks("", "").subscribe({
      next: (res: any) => {
        this.books = res.data;
      }
    });
  }

  // get all members
  getAllMemberInfo() {
    this.memberservice.getAllMembers("", "").subscribe({
      next: (res) => {
        this.members.set(res);
      }
    });
  }

  // create new member
  createMember() {
    this.memberservice.createNewMember(this.memberItem).subscribe({
      next: (res) => {
        this.alert.showAlert("success", res.message);
        this.getAllMemberInfo();
        this.selectMember(res.member);
      },
      error: (err) => {
        this.alert.showAlert("error", err.error?.message);
      }
    });
  }

  // craete new borrow
  createBorrow() {
    const member_id = this.selectedMember()?._id || "";
    const book_id = this.selectedBook()?._id || "";

    if(!member_id || !book_id) return;

    this.borrowservice.createNewBorrow({member_id, book_id}).subscribe({
      next: (res) => {
        this.alert.showAlert('success', res.message);
        this.clearMember();
        this.getBorrowRecord();
        this.getAllBook();
      },
      error: (err) => {
        this.alert.showAlert("error", err.error?.message);
      }
    });
  }

  // get all borrow record that has status overdue
  getBorrowRecord() {
    this.borrowservice.getAllBorrows("overdue", "").subscribe({
      next: (res) => {
        this.borrowRecords.set(res);
      }
    })
  }





  // ===== UI State =====

  // search
  memberQuery: string = "";
  bookQuery = '';
  availabilityFilter: 'all' | 'available' = 'all';

  returnSearch = '';

  // selections
  selectedMember = signal<MemberI | null>(null);
  selectedBorrow: BorrowI | null = null;
  selectedBook = signal<BookI | null>(null);

  // small modal update status
  statusModalBorrow: BorrowRecord | null = null;
  statuses: BorrowStatus[] = ['returned', 'lost', 'damaged'];

  // update status form (simple)
  updateStatus: BorrowStatus = 'returned';

  // damage type helpers
  statusItem = {
    status: 'returned',
    damage_type: 'can',
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

    if(b === "damaged") {
      this.checkDamageType(true);
    }
  }

  // save status change
  saveStatus() {
    if(this.statusItem.damage_fee <=0 && this.updateStatus === 'damaged' && this.isLittleDamage) {
      this.removeFailed = true;
      return;  
    }

    if(this.selectedBorrow === null) return;

    this.borrowservice.updateBorrowStatus(this.selectedBorrow._id, this.statusItem).subscribe({
      next: (res) => {
        this.alert.showAlert("success", res.message);
        this.getBorrowRecord();
      },
      error: (err) => {
        this.alert.showAlert("error", err.error?.message);
      }
    })

    this.clearSelectUpdate();
    
  }

  clearSelectUpdate() {
    this.updateStatus = 'returned';
    this.statusItem = {
      status: '',
      damage_type: 'can',
      damage_fee: 0
    }
    this.isLittleDamage = true;
    this.removeFailed = false;
    this.statusModalBorrow = null;

    this.selectedBorrow = null;
  }


  // ===== Derived Lists =====
  get filteredMembers(): MemberI[] {
    const q = this.memberQuery.trim().toLowerCase();
    if (!q) return [];
    return this.members().filter(m =>
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

  get activeBorrowRecords(): BorrowI[] {
    // active = not returned_date yet
    return this.borrowRecords().filter(r => r.return_date === null);
  }

  get filteredBorrowRecords(): BorrowI[] {
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
    return this.borrowRecords().some(r => r.return_date === null && r.member_name === this.selectedMember!.name);
  }

  canBorrowThisBook(book: BookI): boolean {
    if (!this.selectedMember()) return false;
    if (this.selectedMember()?.member_type === 'blacklist') return false;
    if (this.memberHasActiveBorrow) return false;
    if (book.available_copies <= 0) return false;
    return true;
  }

  // ===== Actions =====
  selectMember(m: MemberI) {
    this.selectedMember.set(m)
    this.memberQuery = m.name;
  }

  clearMember() {
    this.selectedMember.set(null);
    this.memberQuery = "";

    this.selectedBook.set(null);
  }

  borrowBook(book: BookI) {
    if (!this.selectedMember()) return;

    this.selectedBook.set(book);
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
