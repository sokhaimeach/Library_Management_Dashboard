import { Component } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref, RouterLinkActive, RouterLink, Router } from '@angular/router';
import { Authservice } from '../../core/auth/authservice';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLinkWithHref, RouterLinkActive, RouterLink],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout {

  userProfile: any;
  constructor(private auth: Authservice, private router: Router) {
    this.userProfile = this.auth.getUserProfile;
  }

  logout(){
    this.auth.logout();
    setTimeout(() => {
      this.router.navigate(['/auth']);
    }, 100);
  }
}
