import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertSuccess } from '../../shared/components/alert-success/alert-success';
import { Alertservice } from '../../shared/components/alert-success/alertservice';
import { CategoryI, CategoryItem } from '../models/category.model';
import { Categoryservice } from '../services/categoryservice/categoryservice';
import { LoadingService } from '../../core/services/loading.service';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader/skeleton-loader';

@Component({
  selector: 'app-category',
  imports: [CommonModule, FormsModule, AlertSuccess, SkeletonLoaderComponent],
  templateUrl: './category.html',
  styleUrl: './category.css',
})
export class Category {

  item: CategoryItem = {
    name: '',
    description: '',
  };

  categories = signal<CategoryI[]>([]);
  searchQuery: string = "";

  constructor(private alert: Alertservice, private categoryservice: Categoryservice, public loading: LoadingService) { }
  ngOnInit(): void {
    this.getAllCategoriesInfo();
  }

  // get all categories
  getAllCategoriesInfo() {
    this.loading.show();
    this.categoryservice.getAllCategories(this.searchQuery).subscribe({
      next: (res) => {
        this.categories.set(res);
        this.loading.hide();
      },
      error: (err) => {
        this.loading.hide();
      }
    });
  }

  // create new category
  createCategory() {
    this.categoryservice.createNewCategory(this.item).subscribe({
      next: (res) => {
        this.alert.showAlert("success", res.message);
        this.getAllCategoriesInfo();
      },
      error: (err) => {
        this.alert.showAlert("error", err.error?.message);
      }
    });
  }

  // edit category info
  editCategory() {
    this.categoryservice.updateCategory(this.updateCategoryId, this.item).subscribe({
      next: (res) => {
        this.alert.showAlert("success", res.message);
        this.getAllCategoriesInfo();
      },
      error: (err) => {
        this.alert.showAlert("error", err.error?.message);
      }
    });
  }


  // API Actions would go here
  onDeleteCategory() {
    if (this.deleteCategoryId === '') return;
    // call delete API here
    this.categoryservice.deleteCategory(this.deleteCategoryId).subscribe({
      next: (res) => {
        this.alert.showAlert('success', res.message);
        this.getAllCategoriesInfo();
      },
      error: (err) => {
        this.alert.showAlert("error", err.error?.message);
      }
    });
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
  updateCategoryId: string = "";
  opneEdit(category: any) {
    this.updateCategoryId = category._id;
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
}
