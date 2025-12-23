import { Component } from '@angular/core';
import { FilterDropdown } from '../../shared/components/filter-dropdown/filter-dropdown';
import { Bookservices } from '../services/bookservices/bookservices';
import { Book as B } from '../models/book.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AlertSuccess } from '../../shared/components/alert-success/alert-success';
import { Alertservice } from '../../shared/components/alert-success/alertservice';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-book',
  imports: [FilterDropdown, FormsModule, CommonModule, AlertSuccess, RouterLink],
  templateUrl: './book.html',
  styleUrl: './book.css',
})
export class Book {
  item: BookItem = {
    title: '',
    author_id: '',
    category_id: '',
    published_date: '',
    price: 0,
    total_copies: 0,
    description: '',
    cover_url: '',
  };

  authorItem = {
    name: '',
    birth_date: '',
    nationality: '',
    biography: '',
  };

  categoryItem = {
    name: '',
    description: '',
  };

  authors = [
    {
      _id: '6933ab95048d8959faaab1a1',
      name: 'Long',
      birth_date: { $date: '2015-10-11T17:00:00.000Z' },
      nationality: 'Khmer',
      biography: 'Nothing',
    },
    {
      _id: '6933ab95048d8959faaab1a2',
      name: 'Sokha',
      birth_date: { $date: '1998-03-22T17:00:00.000Z' },
      nationality: 'Khmer',
      biography: 'Writes modern Khmer short stories and essays.',
    },
    {
      _id: '6933ab95048d8959faaab1a3',
      name: 'Dara',
      birth_date: { $date: '2001-07-08T17:00:00.000Z' },
      nationality: 'Khmer',
      biography: 'Focuses on education and self-development books.',
    },
    {
      _id: '6933ab95048d8959faaab1a4',
      name: 'Sopheak',
      birth_date: { $date: '1995-12-01T17:00:00.000Z' },
      nationality: 'Khmer',
      biography: 'Enjoys writing romance novels and poetry.',
    },
    {
      _id: '6933ab95048d8959faaab1a5',
      name: 'Rithy',
      birth_date: { $date: '1989-05-14T17:00:00.000Z' },
      nationality: 'Khmer',
      biography: 'Researcher and author of Cambodian history content.',
    },
  ];

  categories = [
    {
      _id: '6933ab95048d8959faaab1a1',
      name: 'Dramatic',
      description:
        'Fictional works that focus on emotional and relational development of characters.',
    },
    {
      _id: '6933ab95048d8959faaab1a2',
      name: 'Science Fiction',
      description:
        'Fiction based on imagined future scientific or technological advances and major social or environmental changes.',
    },
    {
      _id: '6933ab95048d8959faaab1a3',
      name: 'Biography',
      description: "An account of someone's life written by someone else.",
    },
    {
      _id: '6933ab95048d8959faaab1a4',
      name: 'Self-Help',
      description:
        'Books intended to instruct readers on solving personal problems.',
    },
    {
      _id: '6933ab95048d8959faaab1a5',
      name: 'History',
      description: 'Books that explore past events and contexts.',
    },
  ];

  books: B[] = [];
  // remove quantity
  removeQuantity: number = 0;
  availableCopiesToRemove: number = 0;
  removeFailed: boolean = false;
  removeMessage: string = '';
  removeId: string = '';

  constructor(private bookservice: Bookservices, private alert: Alertservice) {}
  ngOnInit(): void {
    this.combineFilters();
    // fetch initial book data from API here
    this.bookservice.getAllBooks().subscribe({
      next: (res: any) => {
        this.books = res.data;
        console.log(this.books);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  onEdit(id: string) {
    /* open edit modal */
  }
  onRemove() {
    if (
      this.removeQuantity <= 0 ||
      this.removeQuantity > this.availableCopiesToRemove
    ) {
      this.removeFailed = true;
      return;
    }

    this.alert.showAlert('Success', 'Book copies removed successfully.');
    /* call API to remove book copies */
  }


  // submit author 
  onSubmitAuthor() {
    this.searchAuthorText = this.authorItem.name
  }

  // submit category
  onSubmitCategory() {
    this.searchCategoryText = this.item.category_id
  }

  modalTitle: string = 'Add New Book';
  openModal(book: B){
    this.modalTitle = 'Edit Book Information';
    this.item = {
      title: book.title,
      author_id: book.author_id,
      category_id: book.category_id,
      published_date: book.published_date,
      price: book.price,
      total_copies: book.total_copies,
      description: book.description,
      cover_url: book.cover_url,
    }
    this.searchAuthorText = book.author_name;
    this.searchCategoryText = book.category_name;
  }
  // clear modal data
  clearModalData() {
    this.item = {
      title: '',
      author_id: '',
      category_id: '',
      published_date: '',
      price: 0,
      total_copies: 0,
      description: '',
      cover_url: '',
    };
    this.searchAuthorText = '';
    this.searchCategoryText = '';
  }


  isCustom: boolean = false;
  checkRemoveType(value: boolean) {
    if (value) {
      this.isCustom = true;
    } else {
      this.isCustom = false;
      this.removeQuantity = this.availableCopiesToRemove;
    }
    console.log('Remove quantity :', this.removeQuantity);
  }

  openRemoveModal(id: string, availableCopies: number) {
    this.availableCopiesToRemove = availableCopies;
    this.removeId = id;
    this.removeFailed = false;
    if (!this.isCustom) {
      this.removeQuantity = availableCopies;
    }
  }


  // design filter options
  genreFilters: Filter[] = [];
  combineFilters() {
    this.categories.forEach(category => {
      this.genreFilters.push({
        key: category._id,
        label: category.name,
        checked: false
      });
    });
  }

  onFilterChange(selected: string[]) {
    // call API here
    console.log(selected);
  }

  secondModalTitle: string = 'Add New Author';
  isAuthorModal: boolean = true;
  showSecondModal = false;
  openSecondModal(isAuthor: boolean) {
    this.isAuthorModal = isAuthor;
    this.secondModalTitle = isAuthor ? 'Add New Author' : 'Add New Category';

    this.showSecondModal = true;
  }

  closeSecondModal() {
    this.showSecondModal = false;
  }


  // author dropdown search
  searchAuthorText: string = '';
  filterAuthorData: any[] = [];
  openDropdown() {
    // keep dropdown open by ensuring it has items
    this.filterAuthorData = this.authors;
  }

  onSearchChange() {
    const q = (this.searchAuthorText || '').toLowerCase().trim();
    this.filterAuthorData = !q
      ? [...this.authors]
      : this.authors.filter(
          (b) =>
            b.name.toLowerCase().includes(q) ||
            b._id.toLowerCase().includes(q)
        );
  }

  selectAuthorId(author: any) {
    this.searchAuthorText = author.name;
    this.item.author_id = author._id;
    // Bootstrap will auto-close dropdown after click (autoClose=true)
  }



  // category dropdown search
  searchCategoryText: string = '';
  filterCategoryData: any[] = [];
  openDropdownCategory() {
    // keep dropdown open by ensuring it has items
    this.filterCategoryData = this.categories;
  }

  onSearchChangeCategory() {
    const q = (this.searchCategoryText || '').toLowerCase().trim();
    this.filterCategoryData = !q
      ? [...this.categories]
      : this.categories.filter(
          (b) =>
            b.name.toLowerCase().includes(q) ||
            b._id.toLowerCase().includes(q)
        );
  }

  selectCategoryId(category: any) {
    this.searchCategoryText = category.name;
    this.item.category_id = category._id;
    // Bootstrap will auto-close dropdown after click (autoClose=true)
  }
}


interface BookItem {
  title: string;
  author_id: string;
  category_id: string;
  published_date: string | null;
  price: { $numberDecimal: string } | number;
  total_copies: number;
  description: string | null;
  cover_url: string;
}

interface Filter {
  key: string;
  label: string;
  checked: boolean;
}