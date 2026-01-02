import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FilterDropdown } from '../../shared/components/filter-dropdown/filter-dropdown';
import { MemberTypePipe } from '../../shared/pipes/member-type.pipe';
import { FormsModule } from '@angular/forms';
import { MemberI, MemberItem } from '../models/member.modal';
import { AlertSuccess } from '../../shared/components/alert-success/alert-success';
import { Alertservice } from '../../shared/components/alert-success/alertservice';
import { RouterLink } from '@angular/router';
import { Memberservice } from '../services/memberservice/memberservice';

@Component({
  selector: 'app-member',
  imports: [
    CommonModule,
    FilterDropdown,
    MemberTypePipe,
    FormsModule,
    AlertSuccess,
    RouterLink,
  ],
  templateUrl: './member.html',
  styleUrl: './member.css',
})
export class Member {
  item: MemberItem = {
    name: '',
    contact: {
      phone_number: '',
      email: '',
    },
  };

  members = signal<MemberI[]>([]);
  searchQuery: string = '';
  filter: string = '';

  constructor(
    private alert: Alertservice,
    private memberservice: Memberservice
  ) {}
  ngOnInit(): void {
    this.getAllMemberInfo();
  }

  // API Actions would go here
  // get all members
  getAllMemberInfo() {
    this.memberservice.getAllMembers(this.filter, this.searchQuery).subscribe({
      next: (res) => {
        this.members.set(res);
      },
    });
  }

  // create new member
  createMember() {
    this.memberservice.createNewMember(this.item).subscribe({
      next: (res) => {
        this.alert.showAlert('success', res.message);
        this.getAllMemberInfo();
      },
      error: (err) => {
        this.alert.showAlert('error', err.error?.message);
      },
    });
  }

  // update member info
  editMember() {
    this.memberservice.updateMember(this.updateMemberId, this.item).subscribe({
      next: (res) => {
        this.alert.showAlert('success', res.message);
        this.getAllMemberInfo();
      },
      error: (err) => {
        this.alert.showAlert('error', err.error?.message);
      },
    });
  }

  onDeleteMember() {
    if (this.deleteMemberId === '') return;

    // call delete API here
    this.alert.showAlert('', 'Member deleted successfully!');
  }

  // open edit modal
  modalTitle: string = 'Add new Member';
  updateMemberId: string = '';
  openEditModal(member: MemberI) {
    this.modalTitle = 'Edit Member';
    this.updateMemberId = member._id;
    this.item = {
      name: member.name,
      contact: {
        phone_number: member.contact.phone_number,
        email: member.contact.email,
      },
    };
  }

  clearItem() {
    this.modalTitle = 'Add new Member';
    this.item = {
      name: '',
      contact: {
        phone_number: '',
        email: '',
      },
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
    { key: 'regular', label: 'Regular', checked: false },
    { key: 'vip', label: 'Vip', checked: false },
    { key: 'blacklist', label: 'Blacklist', checked: false },
  ];

  onFilterChange(selected: string[]) {
    // call API here
    this.filter = '';
    selected.forEach((select) => {
      this.filter += select + ',';
    });
    this.getAllMemberInfo();
  }
}
