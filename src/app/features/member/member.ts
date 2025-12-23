import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FilterDropdown } from '../../shared/components/filter-dropdown/filter-dropdown';
import { MemberTypePipe } from '../../shared/pipes/member-type.pipe';
import { FormsModule } from '@angular/forms';
import { MemberI, MemberItem } from '../models/member.modal';
import { AlertSuccess } from '../../shared/components/alert-success/alert-success';
import { Alertservice } from '../../shared/components/alert-success/alertservice';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-member',
  imports: [CommonModule, FilterDropdown, MemberTypePipe, FormsModule, AlertSuccess, RouterLink],
  templateUrl: './member.html',
  styleUrl: './member.css',
})
export class Member {

  constructor(private alert: Alertservice) {}


  item: MemberItem = {
    name: '',
    contact: {
      phone_number: '',
      email: ''
    }
  }


  members: MemberI[] = [
    {
      _id: '7933ab95048d8959faaab2b1',
      name: 'Vanna',
      member_type: 'regular',
      join_date: { $date: '2020-01-15T17:00:00.000Z' },
      contact: {
        phone_number: '012345678',
        email: 'vanna@gmail.com'
      }
    },
    {
      _id: '7933ab95048d8959faaab2b2',
      name: 'Srey',
      member_type: 'vip',
      join_date: { $date: '2019-06-20T17:00:00.000Z' },
      contact: {
        phone_number: '098765432',
        email: 'srey@gmail.com',
      }
    },
    {
      _id: '7933ab95048d8959faaab2b3',
      name: 'Chenda',
      member_type: 'regular',
      join_date: { $date: '2021-03-10T17:00:00.000Z' },
      contact: {
        phone_number: '011223344',
        email: 'chemda@gmail.com'
      }
    },
    {
      _id: '7933ab95048d8959faaab2b4',
      name: 'Ratha',
      member_type: 'vip',
      join_date: { $date: '2018-11-05T17:00:00.000Z' },
      contact: {
        phone_number: '022334455',
        email: 'ratha@gmail.com'
      }
    },
    {
      _id: '7933ab95048d8959faaab2b5',
      name: 'Sokun',
      member_type: 'blacklist',
      join_date: { $date: '2022-07-22T17:00:00.000Z' },
      contact: {
        phone_number: '033445566',
        email: 'sokun@gmail.com'
      }
    },
  ]

  // API Actions would go here
  onDeleteMember(){
    if(this.deleteMemberId === '') return;

    // call delete API here
    this.alert.showAlert('', 'Member deleted successfully!');
  }




  // open edit modal
  modalTitle: string = 'Add new Member';
  openEditModal(member: MemberI) {
    this.modalTitle = 'Edit Member';
    this.item = {
      name: member.name,
      contact: {
        phone_number: member.contact.phone_number,
        email: member.contact.email
      }
    };
  }

  clearItem() {
    this.modalTitle = 'Add new Member';
    this.item = {
      name: '',
      contact: {
        phone_number: '',
        email: ''
      }
    };
  }


  // open delete confirmation modal
  deleteMemberName: string = '';
  deleteMemberId: string = '';
  openDeleteModal(member: MemberI) {
    this.deleteMemberName = member.name;
    this.deleteMemberId = member._id;
  }




  // design filter options
  genreFilters = [
    { key: 'Regular', label: 'Regular', checked: false },
    { key: 'Vip', label: 'Vip', checked: false },
    { key: 'Blacklist', label: 'Blacklist', checked: false }
  ];

onFilterChange(selected: string[]) {
  // call API here
  console.log(selected);
}
}
