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
import { roleGuard } from './core/guards/roleguard/role-guard';

export const routes: Routes = [
    { path: '', redirectTo: 'auth', pathMatch: 'full'},
    { path: 'auth', canActivate: [loginGuard], component: AuthLayout},
    { path: 'admin', canActivate: [authguardGuard], component: AdminLayout, children: [
        {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
        {path: 'dashboard', component: Dashboard},
        {path: 'book', canActivate: [roleGuard], data: {roles: ['admin', 'stock-keeper']}, component: Book},
        {path: 'author', canActivate: [roleGuard], data: {roles: ['admin', 'stock-keeper']}, component: Author},
        {path: 'category', canActivate: [roleGuard], data: {roles: ['admin', 'stock-keeper']}, component: Category},
        {path: 'member', canActivate: [roleGuard], data: {roles: ['admin', 'librarian']}, component: Member},
        {path: 'member/history/:id', canActivate: [roleGuard], data: {roles: ['admin', 'librarian']}, component: MemberHistory},
        {path: 'penalty', canActivate: [roleGuard], data: {roles: ['admin', 'librarian']}, component: Penalty},
        {path: 'user', canActivate: [roleGuard], data: {roles: ['admin']}, component: User},
        {path: 'user/account/:id', component: UserAccount},
        {path: 'borrow-return', canActivate: [roleGuard], data: {roles: ['admin', 'librarian']}, component: BorrowReturn},
        {path: 'borrow-record', canActivate: [roleGuard], data: {roles: ['admin', 'librarian']}, component: BorrowRecord},
        {path: 'book/recycle', canActivate: [roleGuard], data: {roles: ['admin', 'stock-keeper']}, component: Recycle}
    ]}
];
