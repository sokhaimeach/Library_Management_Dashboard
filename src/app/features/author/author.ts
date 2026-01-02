import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FilterDropdown } from '../../shared/components/filter-dropdown/filter-dropdown';
import { FormsModule } from '@angular/forms';
import { AuthorI, AuthorItem } from '../models/author.model';
import { Authorservice } from '../services/authorservice/authorservice';
import { AlertSuccess } from '../../shared/components/alert-success/alert-success';
import { Alertservice } from '../../shared/components/alert-success/alertservice';

@Component({
  selector: 'app-author',
  imports: [CommonModule, FilterDropdown, FormsModule, AlertSuccess],
  templateUrl: './author.html',
  styleUrl: './author.css',
})
export class Author {
  item: AuthorItem = {
    name: '',
    birth_date: '',
    nationality: 'Khmer',
    biography: '',
  };

  filter: string = "";
  searchQuery: string = "";

  authors = signal<AuthorI[]>([]);

  constructor(
    private authorservice: Authorservice,
    private alert: Alertservice
  ) {}
  ngOnInit(): void {
    this.getAllAuthorInfo(this.filter, this.searchQuery);
  }

  // get all authors
  getAllAuthorInfo(query: string, search: string) {
    this.authorservice.getAllAuthors(query, search).subscribe({
      next: (res) => {
        this.authors.set(res);
        console.log(this.authors())
      },
    });
  }

  // create new author
  createAuthor() {
    this.authorservice.createNewAuthor(this.item).subscribe({
      next: (res) => {
        this.alert.showAlert('success', res.message);
        this.getAllAuthorInfo(this.filter, this.searchQuery);
      },
      error: (err) => {
        this.alert.showAlert('error', err.error.message);
      },
    });
  }

  // edite author info
  editAuthor() {
    this.authorservice.putAuthor(this.updateAuthorId, this.item).subscribe({
      next: (res) => {
        this.alert.showAlert('success', res.message);
        this.getAllAuthorInfo(this.filter, this.searchQuery);
      },
      error: (err) => {
        this.alert.showAlert('error', err.error.message);
      },
    });
  }

  // remove author
  removeAuthor() {
    this.authorservice.deleteAuthor(this.deleteAuthorId).subscribe({
      next: (res) => {
        this.alert.showAlert('success', res.message);
        this.getAllAuthorInfo(this.filter, this.searchQuery);
      },
      error: (err) => {
        this.alert.showAlert('error', err.error.message);
      },
    });
  }

  // seaerch
  search(){
    this.getAllAuthorInfo(this.filter, this.searchQuery);
  }

  // delete author
  deleteAuthorId: string = '';
  deleteAuthorName: string = '';
  openDelete(b: any) {
    this.deleteAuthorId = b._id;
    this.deleteAuthorName = b.name;
  }

  // open edit author
  updateAuthorId: string = '';
  ModalTitle: string = 'Add new Author';
  openEdit(author: any) {
    this.updateAuthorId = author._id;
    console.log(this.updateAuthorId);
    this.ModalTitle = 'Edit Author';
    this.item = {
      name: author.name,
      birth_date: author.birth_date,
      nationality: author.nationality,
      biography: author.biography,
    };
  }

  // clear modal
  clearModal() {
    this.ModalTitle = 'Add new Author';
    this.item = {
      name: '',
      birth_date: '',
      nationality: 'Khmer',
      biography: '',
    };
  }

  // design filter options
  genreFilters = [
    { key: 'Khmer', label: 'Khmer', checked: false },
    { key: 'American', label: 'American', checked: false },
    { key: 'Chinese', label: 'Chinese', checked: false },
  ];

  onFilterChange(selected: string[]) {
    // call API here
    this.filter = "";
    this.genreFilters.forEach(gen => {
      if(gen.checked){
        this.filter += (gen.key + ",");
      }
    });

    this.getAllAuthorInfo(this.filter, this.searchQuery);

    console.log(this.filter);
  }
}
