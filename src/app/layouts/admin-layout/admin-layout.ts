import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref, RouterLinkActive, RouterLink, Router } from '@angular/router';
import { Authservice } from '../../core/auth/authservice';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLinkWithHref, RouterLinkActive, RouterLink, CommonModule],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout implements OnInit {

  user:any;
  present: string = new Date().toDateString();

  constructor(public auth: Authservice, private router: Router) {
    
  }

  ngOnInit():void {
    this.user = this.auth.getUserProfile();
  }

  logout(){
    this.auth.logout();
    setTimeout(() => {
      this.router.navigate(['/auth']);
    }, 100);
  }
}
