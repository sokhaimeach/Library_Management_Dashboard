import { Component, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Alertservice } from '../../shared/components/alert-success/alertservice';
import { FormsModule } from '@angular/forms';
import { AlertSuccess } from '../../shared/components/alert-success/alert-success';
import { Memberhistoryservice } from '../services/memberhistoryservice/memberhistoryservice';
import { MemberI } from '../models/member.modal';
import { ActivatedRoute } from '@angular/router';
import { BorrowI, ReturnI } from '../models/borrow.model';
import { PenaltyListItem } from '../models/penalty.model';
import { Borrowservice } from '../services/borrowservice/borrowservice';
import { Penaltyservice } from '../services/penaltyservice/penaltyservice';

type BorrowStatus = "overdue" | "returned" | "lost" | "late" | "damaged";

@Component({
  selector: 'app-member-history',
  imports: [CommonModule, FormsModule, AlertSuccess],
  templateUrl: './member-history.html',
  styleUrl: './member-history.css',
})
export class MemberHistory {

  statusItem: ReturnI = {
    status: '',
    damage_type: '',
    damage_fee: 0
  }

  member = signal<MemberI | null>(null);
  memberId: any = "";
  changeType: string = "";

  borrowRecords = signal<BorrowI[]>([]);

  penalties = signal<PenaltyListItem[]>([]);


  constructor(private alert: Alertservice,
    private location: Location,
    private memberservice: Memberhistoryservice,
    private route: ActivatedRoute,
    private borrowservice: Borrowservice,
    private penaltyservice: Penaltyservice) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.memberId = params.get('id');
      this.getMemberInfo();
      this.getBorrowHistory();
      this.getPenaltyHistory();
    });
  }

  // get member Detail
  getMemberInfo(){
    this.memberservice.getMemberById(this.memberId).subscribe({
      next: (res) => {
        this.member.set(res);
      }
    });
  }

  // change memberType
  updateMemberType() {
    if(!this.changeType) return;

    this.memberservice.changeMemberType(this.memberId, this.changeType).subscribe({
      next: (res) => {
        this.alert.showAlert("success", res.message);
        this.getMemberInfo();
      },
      error: (err) => {
        this.alert.showAlert("error", err.error?.message);
      }
    });
  }

  // get borrow history
  filterBorrow: string = "";
  searchBorrow: string = "";
  getBorrowHistory(){
    this.memberservice.getBorrow(this.memberId, this.filterBorrow, this.searchBorrow).subscribe({
      next: (res) => {
        this.borrowRecords.set(res);
      }
    });
  }

  // get penalty history
  filterPenalty: string = "";
  searchPenalty: string = "";
  getPenaltyHistory() {
    this.memberservice.getPenalty(this.memberId, this.filterPenalty, this.searchPenalty).subscribe({
      next: (res) => {
        this.penalties.set(res);
      }
    });
  }



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

  saveBorrowStatus() {

    if(this.statusItem.damage_fee && this.statusItem.damage_fee <= 0 && 
      this.selectedStatus === 'damaged' && this.isLittleDamage) {
      this.removeFailed = true;
      return;
    }

    this.statusItem.status = this.selectedStatus;
    console.log(this.statusItem)
    this.borrowservice.updateBorrowStatus(this.selectedBorrowId, this.statusItem).subscribe({
      next: (res) => {
        this.alert.showAlert('success',res.message);
        this.getBorrowHistory();
      },
      error: (err) => {
        this.alert.showAlert('error', err.error?.message);
      }
    });
  }



  // update penalty status
  selectPenaltyStatus: string = 'paid';
  selectPenaltyId: string = '';
  openPenaltyModal(penalty: PenaltyListItem){
    this.selectPenaltyId = penalty._id;
  }

  savePenaltySatus(){
    if(this.selectPenaltyStatus === '' || this.selectPenaltyId === '') return;

    console.log(this.selectPenaltyId, this.selectPenaltyStatus)
    this.penaltyservice.updatePenaltyStatus(this.selectPenaltyId, this.selectPenaltyStatus).subscribe({
      next: (res) => {
        this.alert.showAlert('success', res.message);
        this.getPenaltyHistory();
      },
      error: (err) => {
        this.alert.showAlert('error', err.error?.message);
      }
    });
  }


  // go back
  goBack() {
    this.location.back();
  }
}
