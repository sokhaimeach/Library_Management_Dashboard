import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertSuccess } from '../../shared/components/alert-success/alert-success';
import { Alertservice } from '../../shared/components/alert-success/alertservice';
import { CategoryI, CategoryItem } from '../models/category.model';

@Component({
  selector: 'app-category',
  imports: [CommonModule, FormsModule, AlertSuccess],
  templateUrl: './category.html',
  styleUrl: './category.css',
})
export class Category {

  constructor(private alert: Alertservice) {}

  item: CategoryItem = {
    name: '',
    description: '',
  };

  categories: CategoryI[] = [
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

  // API Actions would go here
  onDeleteCategory(){
    if(this.deleteCategoryId === '') return;
    // call delete API here
    this.alert.showAlert('', 'Category deleted successfully!');


  }


  // delete modal
  deleteCategoryName: string = '';
  deleteCategoryId: string = '';
  openDeleteModal(category: CategoryI) {
    this.deleteCategoryName = category.name;
    this.deleteCategoryId = category._id;
  }


  // edit modal
  modalTitle: string = 'Add New Category';
  opneEdit(category: any) {
    this.modalTitle = 'Edit Category';
    this.item = { ...category };
  }

  clearItem() {
    this.modalTitle = 'Add New Category';
    this.item = {
      name: '',
      description: '',
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
