import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FilterDropdown } from '../../shared/components/filter-dropdown/filter-dropdown';
import { FormsModule } from '@angular/forms';
import { RouterLink } from "@angular/router";
import { UserI } from '../models/user.model';
import { Userservice } from '../services/userservice/userservice';
import { AlertSuccess } from '../../shared/components/alert-success/alert-success';
import { Alertservice } from '../../shared/components/alert-success/alertservice';

@Component({
  selector: 'app-user',
  imports: [CommonModule, FilterDropdown, FormsModule, RouterLink, AlertSuccess],
  templateUrl: './user.html',
  styleUrl: './user.css',
})
export class User implements OnInit {

  item: UserI = {
    username: '',
    password: '',
    role: 'librarian',
    image_url: '',
    contact: {
      phone_number: '',
      email: '',
    },
    address: {
      city: '',
      district: '',
      commune: '',
      village: '',
    },
  };

  users = signal<UserI[]>([]);
  // handle error
  errorMessage: string = '';
  isError:boolean = false;

  constructor(
    private userservice: Userservice,
    private alert: Alertservice,
    ) {}

  ngOnInit(): void {
    this.getAllUserInfo();
  }

  // get all users
  async getAllUserInfo(){
    await this.userservice.getAllUsers().subscribe({
      next: (res) => {
        this.users.set(res);
      },
      error: (err) => {
        this.isError = true;
        this.errorMessage = err.error?.message;
      }
    });
  }

  // create user
  createNewUser() {
    this.userservice.createUser(this.item).subscribe({
      next: (res) => {
        this.alert.showAlert('success', res?.message);
        this.getAllUserInfo();
      },
      error: (err) => {
        this.alert.showAlert('error', err.error?.message);
      }
    });
  }

  // editt user info
  async editUserInfo(){
    let {_id:_, role, status, start_date, password,...userInfo} = this.item;
    await this.userservice.updateUser(this.editUserId, userInfo).subscribe({
      next: (res) => {
        this.alert.showAlert('success', res?.message);
        setTimeout(() => {
          this.getAllUserInfo();
        }, 1000);
      },
      error: (err) => {
        this.alert.showAlert('error', err.error?.message);
      }
    });
  }

  // edit modal
  modalTitle = 'Add New User';
  isEditModalOpen = false;
  editUserId: string = '';
  openEditModal(user: any) {
    this.isEditModalOpen = true;
    this.modalTitle = 'Edit User';
    this.item = { ...user };
    this.editUserId = user._id;
  }

  clearItem() {
    this.modalTitle = 'Add New User';
    this.isEditModalOpen = false;
    this.item = {
      username: '',
      password: '',
      role: 'librarian',
      image_url: '',
      contact: {
        phone_number: '',
        email: '',
      },
      address: {
        city: '',
        district: '',
        commune: '',
        village: '',
      },
    };
  }



  // design filter options
  genreFilters = [
    { key: 'admin', label: 'Admin', checked: false },
    { key: 'librarian', label: 'Librarian', checked: false },
    { key: 'stock-keeper', label: 'Stock-keeper', checked: false },
  ];

  onFilterChange(selected: string[]) {
    // call API here
    console.log(selected);
  }
}
