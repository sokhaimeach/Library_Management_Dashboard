import { Routes } from '@angular/router';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { Book } from './features/book/book';
import { Author } from './features/author/author';
import { Category } from './features/category/category';
import { Member } from './features/member/member';
import { MemberHistory } from './features/member-history/member-history';
import { Penalty } from './features/penalty/penalty';
import { User } from './features/user/user';
import { UserAccount } from './features/user-account/user-account';
import { BorrowReturn } from './features/borrow-return/borrow-return';
import { authguardGuard } from './core/guards/authguard/authguard-guard';
import { BorrowRecord } from './features/borrow-record/borrow-record';
import { Dashboard } from './features/dashboard/dashboard';
import { Recycle } from './features/recycle/recycle';
import { loginGuard } from './core/guards/loginguard/login-guard';

export const routes: Routes = [
    { path: '', redirectTo: 'auth', pathMatch: 'full'},
    { path: 'auth', canActivate: [loginGuard], component: AuthLayout},
    { path: 'admin', canActivate: [authguardGuard], component: AdminLayout, children: [
        {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
        {path: 'dashboard', component: Dashboard},
        {path: 'book', component: Book},
        {path: 'author', component: Author},
        {path: 'category', component: Category},
        {path: 'member', component: Member},
        {path: 'member/history/:id', component: MemberHistory},
        {path: 'penalty', component: Penalty},
        {path: 'user', component: User},
        {path: 'user/account/:id', component: UserAccount},
        {path: 'borrow-return', component: BorrowReturn},
        {path: 'borrow-record', component: BorrowRecord},
        {path: 'book/recycle', component: Recycle}
    ]}
];
