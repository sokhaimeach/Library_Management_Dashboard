import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FilterDropdown } from '../../shared/components/filter-dropdown/filter-dropdown';
import { FormsModule } from '@angular/forms';
import { AuthorI, AuthorItem } from '../models/author.model';

@Component({
  selector: 'app-author',
  imports: [CommonModule, FilterDropdown, FormsModule],
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

  authors: AuthorI[] = [
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

  // delete author
  deleteAuthorId: string = '';
  deleteAuthorName: string = '';
  openDelete(b: any) {
    this.deleteAuthorId = b._id;
    this.deleteAuthorName = b.name;
  }

  // open edit author
  ModalTitle: string = 'Add new Author';
  openEdit(author: any) {
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
    console.log(selected);
  }
}
