import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Alertservice } from '../../shared/components/alert-success/alertservice';
import { FormsModule } from '@angular/forms';
import { AlertSuccess } from '../../shared/components/alert-success/alert-success';

type BorrowStatus = "overdue" | "returned" | "lost" | "late" | "damaged";

@Component({
  selector: 'app-member-history',
  imports: [CommonModule, FormsModule, AlertSuccess],
  templateUrl: './member-history.html',
  styleUrl: './member-history.css',
})
export class MemberHistory {

  constructor(private alert: Alertservice, private location: Location) {}

  statusItem = {
    status: '',
    damage_type: '',
    damage_fee: 0
  }

  borrowRecords = [
    {
      _id: '6933ac30048d8959faaab20b',
      return_date: null,
      status: 'lost',
      borrow_date: '2025-12-06T04:08:16.831Z',
      due_date: '2025-12-20T04:08:16.831Z',
      member_name: 'Makara1',
      book_title: 'Kolab Pailin',
    },
    {
      _id: '6933ac3a048d8959faaab20c',
      return_date: '2025-12-10T09:15:00.000Z',
      status: 'returned',
      borrow_date: '2025-12-01T03:20:00.000Z',
      due_date: '2025-12-08T03:20:00.000Z',
      member_name: 'Makara1',
      book_title: 'Sophea of Angkor',
    },
    {
      _id: '6933ac43048d8959faaab20d',
      return_date: null,
      status: 'overdue',
      borrow_date: '2025-12-12T02:05:30.000Z',
      due_date: '2025-12-26T02:05:30.000Z',
      member_name: 'Makara1',
      book_title: 'A History of Cambodia',
    },
    {
      _id: '6933ac4d048d8959faaab20e',
      return_date: '2025-12-15T06:40:12.000Z',
      status: 'late',
      borrow_date: '2025-11-20T04:10:00.000Z',
      due_date: '2025-12-04T04:10:00.000Z',
      member_name: 'Makara1',
      book_title: 'Khmer Folk Tales',
    },
    {
      _id: '6933ac57048d8959faaab20f',
      return_date: '2025-12-18T11:05:45.000Z',
      status: 'damaged',
      borrow_date: '2025-12-05T07:30:00.000Z',
      due_date: '2025-12-19T07:30:00.000Z',
      member_name: 'Makara1',
      book_title: "The River's Song",
    },
  ];

  penalties = [1];


  // selected for update modal
  selectedBorrowId = '';
  selectedStatus: BorrowStatus = 'returned';

  openUpdateStatus(b: any) {
    this.selectedBorrowId = b._id;
    this.removeFailed = false;
  }

  // damage type helpers
  removeFailed: boolean = false;
  isLittleDamage: boolean = true;
  checkDamageType(type: boolean) {
    this.isLittleDamage = type;

    if(type) {
      this.statusItem.damage_type = 'can';
    } else {
      this.statusItem.damage_type = 'cannot';
    }
  }

  saveStatus() {

    if(this.statusItem.damage_fee <=0 && this.selectedStatus === 'damaged' && this.isLittleDamage) {
      this.removeFailed = true;
      return;
    }

    this.statusItem.status = this.selectedStatus;
    this.alert.showAlert('','Borrow status updated successfully!');
    const row = this.borrowRecords.find((x) => x._id === this.selectedBorrowId);
    if (!row) return;

    row.status = this.selectedStatus;
  }



  // update penalty status
  selectPenaltyStatus: string = '';
  selectPenaltyId: string = '';
  openPenaltyModal(penalty: any){
    this.selectPenaltyId = penalty._id;
  }

  savePenaltySatus(){
    if(this.selectPenaltyStatus === '' || this.selectPenaltyId === '') return;

    this.alert.showAlert('','Penalty status updated successfully!');
  }


  // go back
  goBack() {
    this.location.back();
  }
}
