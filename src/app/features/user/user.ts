import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FilterDropdown } from '../../shared/components/filter-dropdown/filter-dropdown';
import { FormsModule } from '@angular/forms';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-user',
  imports: [CommonModule, FilterDropdown, FormsModule, RouterLink],
  templateUrl: './user.html',
  styleUrl: './user.css',
})
export class User {

  item = {
    username: '',
    password: '',
    role: '',
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

  users = [
    {
      _id: '692c42b48ece5c4ecd48dcb8',
      username: 'Sokhai',
      role: 'admin',
      image_url: null,
      status: false,
      contact: { phone_number: '0123456789', email: 'vannak@gmail.com' },
      start_date: '2025-11-30T13:12:20.417Z',
      address: {
        village: null,
        commune: null,
        district: null,
        city: null,
      },
    },
    {
      _id: '69498aa3300c1e05752bac12',
      username: 'Tola',
      role: 'librarian',
      image_url: 'https://i.pravatar.cc/150?img=12',
      status: true,
      contact: { phone_number: '010222333', email: 'vannak@gmail.com' },
      start_date: '2025-10-15T09:22:10.000Z',
      address: {
        village: null,
        commune: null,
        district: null,
        city: null,
      },
    },
    {
      _id: '692c42b48ece5c4ecd48dcba',
      username: 'Sreymom',
      role: 'stock-keeper',
      image_url: 'https://i.pravatar.cc/150?img=32',
      status: true,
      contact: { phone_number: '096888777', email: 'vannak@gmail.com' },
      start_date: '2025-12-01T02:10:00.000Z',
      address: {
        village: null,
        commune: null,
        district: null,
        city: null,
      },
    },
    {
      _id: '692c42b48ece5c4ecd48dcbb',
      username: 'Vannak',
      role: 'librarian',
      image_url: null,
      status: false,
      contact: {
        phone_number: '078111222',
        email: 'vannak@gmail.com',
      },
      start_date: '2025-09-20T14:05:44.000Z',
      address: {
        village: null,
        commune: null,
        district: null,
        city: null,
      },
    },
    {
      _id: '692c42b48ece5c4ecd48dcbc',
      username: 'Piseth',
      role: 'stock-keeper',
      image_url: 'https://i.pravatar.cc/150?img=5',
      status: true,
      contact: { phone_number: '070555444', email: 'vannak@gmail.com' },
      start_date: '2025-11-05T18:30:00.000Z',
      address: {
        village: null,
        commune: null,
        district: null,
        city: null,
      },
    },
  ];

  // edit modal
  modalTitle = 'Add New User';
  isEditModalOpen = false;
  openEditModal(user: any) {
    this.isEditModalOpen = true;
    this.modalTitle = 'Edit User';
    this.item = { ...user };
    console.log(this.item);
  }

  clearItem() {
    this.modalTitle = 'Add New User';
    this.isEditModalOpen = false;
    this.item = {
      username: '',
      password: '',
      role: '',
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
