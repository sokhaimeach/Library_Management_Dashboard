import { CommonModule, Location } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RemoveBookI } from '../models/book.model';
import { Bookservices } from '../services/bookservices/bookservices';
import { Alertservice } from '../../shared/components/alert-success/alertservice';
import { AlertSuccess } from '../../shared/components/alert-success/alert-success';

@Component({
  selector: 'app-recycle',
  imports: [CommonModule, FormsModule, AlertSuccess],
  templateUrl: './recycle.html',
  styleUrl: './recycle.css',
})
export class Recycle {

  goBack() {
    this.location.back();
  }


  deletedBooks = signal<RemoveBookI[]>([]);

  restoreBook: RemoveBookI | null = null;
  deleteBook: RemoveBookI | null = null;

  searchQuery: string = "";

  deleteText = '';

  constructor(private location: Location,
    private bookservice: Bookservices,
    private alert: Alertservice) {}
  ngOnInit(): void {
    this.getAllRemoveBooks();
  }

  // get all remove books
  getAllRemoveBooks() {
    this.bookservice.getRemoveBook(this.searchQuery).subscribe({
      next: (res) => {
        this.deletedBooks.set(res.data);
      }
    });
  }







  openRestore(b: RemoveBookI) {
    this.restoreBook = b;
  }

  openDelete(b: RemoveBookI) {
    this.deleteBook = b;
    this.deleteText = '';
  }

  confirmRestore() {
    if (!this.restoreBook?._id) return;

    this.bookservice.restoreBook(this.restoreBook._id).subscribe({
      next: (res) => {
        this.alert.showAlert('success', res.message);
        this.getAllRemoveBooks();
      },
      error: (err) => {
        this.alert.showAlert('error', err.error?.message);
      }
    });
  }

  confirmDelete() {
    if (!this.deleteBook) return;
    if (this.deleteText !== 'DELETE') return;

    this.bookservice.deletePermanently(this.deleteBook._id).subscribe({
      next: (res) => {
        this.alert.showAlert("success", res.message);
        this.getAllRemoveBooks();
      },
      error: (err) => {
        this.alert.showAlert('error', err.error?.message);
      }
    });

    this.deleteBook = null;
    this.deleteText = '';
  }
}
