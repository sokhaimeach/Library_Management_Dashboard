import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-recycle',
  imports: [CommonModule, FormsModule],
  templateUrl: './recycle.html',
  styleUrl: './recycle.css',
})
export class Recycle {

  constructor(private location: Location) {}

  goBack() {
    this.location.back();
  }



  q = '';

  deletedBooks: DeletedBook[] = [
    {
      _id: "6933ab95048d8959faaab1fb",
      title: "Kolab Pailin",
      cover_url: "https://www.elibraryofcambodia.org/wp-content/uploads/2014/04/Kolab-Pailin-book-cover.jpg",
      total_copies: 0,
      deleted_copies: 3,
      deleted_at: "2025-12-21T14:38:13.609Z"
    }
  ];

  restoreBook: DeletedBook | null = null;
  deleteBook: DeletedBook | null = null;

  deleteText = '';

  get filteredBooks() {
    const q = (this.q || '').toLowerCase().trim();
    if (!q) return this.deletedBooks;
    return this.deletedBooks.filter(b => b.title.toLowerCase().includes(q));
  }

  openRestore(b: DeletedBook) {
    this.restoreBook = b;
  }

  openDelete(b: DeletedBook) {
    this.deleteBook = b;
    this.deleteText = '';
  }

  confirmRestore() {
    if (!this.restoreBook) return;

    // simulate restore: move deleted copies back into total
    this.restoreBook.total_copies += this.restoreBook.deleted_copies;
    this.restoreBook.deleted_copies = 0;

    // remove from restore list (optional, common for restore page)
    this.deletedBooks = this.deletedBooks.filter(x => x._id !== this.restoreBook!._id);

    this.restoreBook = null;
  }

  confirmDelete() {
    if (!this.deleteBook) return;
    if (this.deleteText !== 'DELETE') return;

    // simulate permanent delete: remove from list
    this.deletedBooks = this.deletedBooks.filter(x => x._id !== this.deleteBook!._id);

    this.deleteBook = null;
    this.deleteText = '';
  }
}

type DeletedBook = {
  _id: string;
  title: string;
  cover_url: string;
  total_copies: number;
  deleted_copies: number;
  deleted_at: string;
};