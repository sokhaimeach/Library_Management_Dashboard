import { Component, signal } from '@angular/core';
import { FilterDropdown } from '../../shared/components/filter-dropdown/filter-dropdown';
import { Bookservices } from '../services/bookservices/bookservices';
import { Book as B, BookItem } from '../models/book.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AlertSuccess } from '../../shared/components/alert-success/alert-success';
import { Alertservice } from '../../shared/components/alert-success/alertservice';
import { RouterLink } from '@angular/router';
import { AuthorI, AuthorItem } from '../models/author.model';
import { CategoryI, CategoryItem } from '../models/category.model';
import { Authorservice } from '../services/authorservice/authorservice';
import { Categoryservice } from '../services/categoryservice/categoryservice';

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

  authorItem:AuthorItem = {
    name: '',
    birth_date: '',
    nationality: 'Khmer',
    biography: '',
  };

  categoryItem: CategoryItem = {
    name: '',
    description: '',
  };

  books = signal<B[]>([]);
  authors = signal<AuthorI[]>([]);
  categories = signal<CategoryI[]>([]);
  searchQuery: string = "";
  filter: string = "";

  // remove quantity
  removeQuantity: number = 0;
  availableCopiesToRemove: number = 0;
  removeFailed: boolean = false;
  removeMessage: string = '';
  removeId: string = '';

  constructor(private bookservice: Bookservices,
    private alert: Alertservice,
    private authorservice: Authorservice,
    private categoryservice: Categoryservice) {}
  ngOnInit(): void {
    this.getAllBooks();
    this.getAllAuthors();
    this.getAllCategories();
  }

  //get all books
  getAllBooks() {
    this.bookservice.getAllBooks(this.filter, this.searchQuery).subscribe({
      next: (res: any) => {
        this.books.set(res.data);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  // get all author
  getAllAuthors() {
    this.authorservice.getAllAuthors("", "").subscribe({
      next: (res) => {
        this.authors.set(res);
      }
    });
  }

  // get all categories
  getAllCategories() {
    this.categoryservice.getAllCategories("").subscribe({
      next: (res) => {
        this.categories.set(res);
        this.combineFilters(this.categories());
      }
    });
  }

  // create new book
  createBook() {
    this.bookservice.createNewBook(this.item).subscribe({
      next: (res) => {
        this.alert.showAlert("success", res.message);
        this.getAllBooks();
      },
      error: (err) => {
        this.alert.showAlert('error', err.error?.message);
      }
    });
  }

  // edit book infomation
  editBookInfo() {
    const { total_copies: _, ...book } = this.item;
    this.bookservice.updateBook(this.updateBookId, book).subscribe({
      next: (res) => {
        this.alert.showAlert('success', res.message);
        this.getAllBooks();
      },
      error: (err) => {
        this.alert.showAlert('error', err.error?.message);
      }
    });
  }

  onRemove() {
    if (
      this.removeQuantity <= 0 ||
      this.removeQuantity > this.availableCopiesToRemove
    ) {
      this.removeFailed = true;
      return;
    }

    this.bookservice.moveToRecycleBin(this.removeId, this.removeQuantity).subscribe({
      next: (res) => {
        this.alert.showAlert('success', res.message);
        this.getAllBooks();
      },
      error: (err) => {
        this.alert.showAlert('error', err.error?.message);
      }
    });
    
  }


  // submit author 
  onSubmitAuthor() {
    this.authorservice.createNewAuthor(this.authorItem).subscribe({
      next: (res) => {
        this.searchAuthorText.set(this.authorItem.name);
        this.item.author_id = res.id;

        this.alert.showAlert('success', res.message);
        this.getAllAuthors();
      },
      error: (err) => {
        this.alert.showAlert('error', err.error?.message);
      }
    });
  }

  // submit category
  onSubmitCategory() {
    this.categoryservice.createNewCategory(this.categoryItem).subscribe({
      next: (res) => {
        this.searchCategoryText.set(this.categoryItem.name);
        this.item.category_id = res.id;

        this.alert.showAlert('success', res.message);
        this.getAllCategories();
      },
      error: (err) => {
        this.alert.showAlert('error', err.error?.message);
      }
    });
  }

  modalTitle: string = 'Add New Book';
  updateBookId: string = "";
  isEdit: boolean = false;
  openModal(book: B){
    this.isEdit = true;
    this.modalTitle = 'Edit Book Information';
    this.updateBookId = book._id;
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
    this.searchAuthorText.set(book.author_name);
    this.searchCategoryText.set(book.category_name);
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
    this.searchAuthorText.set('');
    this.searchCategoryText.set("");
    this.isEdit = false;
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
    console.log(this.removeQuantity);
  }


  // design filter options
  genreFilters = signal<Filter[]>([]);
  combineFilters(cate: CategoryI[]) {
    let filter: Filter[] = [];
    cate.forEach(category => {
      filter.push({
        key: category._id,
        label: category.name,
        checked: false
      });
    });
    this.genreFilters.set(filter);
  }

  onFilterChange(selected: string[]) {
    this.filter = "";
    selected.forEach((select) => {
      this.filter += select + ",";
    });
    console.log(this.filter);
    this.getAllBooks();
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
  searchAuthorText = signal<string>("");
  filterAuthorData: any[] = [];
  openDropdown() {
    // keep dropdown open by ensuring it has items
    this.filterAuthorData = this.authors();
  }

  onSearchChange() {
    const q = (this.searchAuthorText() || '').toLowerCase().trim();
    this.filterAuthorData = !q
      ? [...this.authors()]
      : this.authors().filter(
          (b) =>
            b.name.toLowerCase().includes(q) ||
            b._id.toLowerCase().includes(q)
        );
  }

  selectAuthorId(author: any) {
    this.searchAuthorText.set(author.name);
    this.item.author_id = author._id;
  }



  // category dropdown search
  searchCategoryText = signal<string>('');
  filterCategoryData: any[] = [];
  openDropdownCategory() {
    // keep dropdown open by ensuring it has items
    this.filterCategoryData = this.categories();
  }

  onSearchChangeCategory() {
    const q = (this.searchCategoryText() || '').toLowerCase().trim();
    this.filterCategoryData = !q
      ? [...this.categories()]
      : this.categories().filter(
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

interface Filter {
  key: string;
  label: string;
  checked: boolean;
}