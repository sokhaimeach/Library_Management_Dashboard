import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';
import { Authservice } from '../../core/auth/authservice';
import { ActivatedRoute } from '@angular/router';
import { Role, UserDetail } from '../models/account.model';
import { Userservice } from '../services/userservice/userservice';
declare const bootstrap: any; // Bootstrap modal

@Component({
  selector: 'app-user-account',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-account.html',
  styleUrl: './user-account.css',
})
export class UserAccount {
  userProfile: any;
  userId: string | null = '';

  user: UserDetail | null = null;

  changePwForm!: FormGroup;
  resetPwForm!: FormGroup;
  statusForm!: FormGroup;

  loading = {
    changePw: false,
    resetPw: false,
    updateStatus: false,
  };

  private changePwModal: any;

  constructor(
    private fb: FormBuilder,
    private auth: Authservice,
    private route: ActivatedRoute,
    private location: Location,
    private userservice: Userservice
  ) {

    this.userProfile = this.auth.getUserProfile();
    
    this.changePwForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(4)]],
      confirmPassword: ['', Validators.required],
    });

    this.resetPwForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(4)]],
    });

    this.statusForm = this.fb.group({
      status: [true, Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.userId = params.get('id');
      this.getUserDetailInfo(this.userId);
    });


    

    // init modal after view is ready (small hack using setTimeout)
    setTimeout(() => {
      const el = document.getElementById('changePwConfirmModal');
      if (el) this.changePwModal = new bootstrap.Modal(el);
    });
  }

  getUserDetailInfo(id: string | any){
      this.userservice.getUserDetail(id).subscribe({
        next: (res) => {
          this.user = res;
          // patch status form with user value
          this.statusForm.patchValue({ status: this.user.status });
        },
        error: (err) => {
          this.user = null;
        }
      });
  }





  get pwMismatch(): boolean {
    const { newPassword, confirmPassword } = this.changePwForm.value;
    return (
      !!newPassword && !!confirmPassword && newPassword !== confirmPassword
    );
  }

  // Admin only update status
  // get canUpdateStatus(): boolean {
  //   return this.currentUser.role === 'admin';
  // }

  // Admin reset password (usually for other users)
  get canResetPassword(): boolean {
    if (!this.user) return false;
    const isAdmin = this.userProfile.role === 'admin';
    const isOtherUser = this.userProfile._id !== this.user._id;
    return isAdmin && isOtherUser;
  }

  isInvalid(form: FormGroup, controlName: string): boolean {
    const c = form.get(controlName);
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  formatAddress(addr: UserDetail['address'] | null | undefined): string {
    if (!addr) return '-';
    const parts = [addr.village, addr.commune, addr.district, addr.city].filter(
      Boolean
    );
    return parts.length ? parts.join(', ') : '-';
  }


  // open confirm modal for changing password
  openChangePwConfirm(): void {
    if (this.changePwForm.invalid || this.pwMismatch) {
      this.changePwForm.markAllAsTouched();
      return;
    }
    this.changePwModal?.show();
  }

  async onChangePasswordConfirmed(): Promise<void> {
    if (this.changePwForm.invalid || this.pwMismatch) return;

    this.loading.changePw = true;
    try {
      const payload = {
        currentPassword: this.changePwForm.value.currentPassword,
        newPassword: this.changePwForm.value.newPassword,
      };

      console.log('change password payload', payload);
      // await userService.changeMyPassword(payload);

      this.changePwForm.reset();
      this.changePwModal?.hide();
    } finally {
      this.loading.changePw = false;
    }
  }

  async onResetPassword(): Promise<void> {
    if (!this.user || !this.canResetPassword) return;

    if (this.resetPwForm.invalid) {
      this.resetPwForm.markAllAsTouched();
      return;
    }

    this.loading.resetPw = true;
    try {
      const payload = { newPassword: this.resetPwForm.value.newPassword };

      console.log('reset password for user', this.user._id, payload);
      // await userService.resetUserPassword(this.user._id, payload);

      this.resetPwForm.reset();
    } finally {
      this.loading.resetPw = false;
    }
  }

  async onUpdateStatus(): Promise<void> {
    if (!this.user || this.userProfile !== 'admin') return;

    this.loading.updateStatus = true;
    try {
      const newStatus = this.statusForm.value.status as boolean;

      console.log('update status', this.user._id, newStatus);
      // await userService.updateStatus(this.user._id, { status: newStatus });

      // update UI
      this.user = { ...this.user, status: newStatus };
    } finally {
      this.loading.updateStatus = false;
    }
  }

  copyText(text?: string | null) {
    if (!text) return;
    navigator.clipboard.writeText(text);
  }

  goBack() {
    this.location.back();
  }
}
