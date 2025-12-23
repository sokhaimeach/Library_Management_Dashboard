import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements AfterViewInit {
  @ViewChild('trendCanvas') trendCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('statusCanvas') statusCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('categoryCanvas') categoryCanvas!: ElementRef<HTMLCanvasElement>;

  searchText = '';

  // Replace these with backend calls
  recentBorrows: BorrowRecord[] = [
    {
      _id: '6933ac30048d8959faaab20b',
      member_name: 'Makara1',
      book_title: 'Kolab Pailin',
      borrow_date: '2025-12-06T04:08:16.831Z',
      due_date: '2025-12-20T04:08:16.831Z',
      status: 'damaged'
    },
    {
      _id: '694671033070e4a41546db90',
      member_name: 'Tri',
      book_title: 'Kolab Pailin',
      borrow_date: '2025-12-20T09:48:51.416Z',
      due_date: '2025-12-27T09:48:51.416Z',
      status: 'late'
    },
    {
      _id: '694671033070e4a41546db91',
      member_name: 'Sok',
      book_title: 'Angkor Story',
      borrow_date: '2025-12-19T07:10:10.000Z',
      due_date: '2025-12-21T07:10:10.000Z',
      status: 'overdue'
    },
    {
      _id: '694671033070e4a41546db92',
      member_name: 'Nita',
      book_title: 'Khmer Tales',
      borrow_date: '2025-12-18T06:00:00.000Z',
      due_date: '2025-12-25T06:00:00.000Z',
      status: 'returned'
    }
  ];

  penalties: PenaltyRecord[] = [
    { _id: 'p1', member_name: 'Makara1', penalty_type: 'lost', amount: 4.5, status: 'pending' },
    { _id: 'p2', member_name: 'Tri', penalty_type: 'late', amount: 1.0, status: 'paid' },
    { _id: 'p3', member_name: 'Sok', penalty_type: 'damaged', amount: 2.25, status: 'pending' }
  ];

  alerts: AlertItem[] = [
    {
      type: 'Overdue',
      title: '1 borrow overdue today',
      subtitle: 'Sok • Angkor Story • Due: Dec 21, 2025',
      refType: 'borrow',
      refId: '694671033070e4a41546db91'
    },
    {
      type: 'Overdue',
      title: '1 borrow overdue today',
      subtitle: 'Sok • Angkor Story • Due: Dec 21, 2025',
      refType: 'borrow',
      refId: '694671033070e4a41546db91'
    },
    {
      type: 'Overdue',
      title: '1 borrow overdue today',
      subtitle: 'Sok • Angkor Story • Due: Dec 21, 2025',
      refType: 'borrow',
      refId: '694671033070e4a41546db91'
    },
  ];

  inventory = {
    available: 260,
    borrowed: 40,
    borrowedPct: 0
  };

  kpis: Array<{ label: string; value: string | number; delta: number; deltaText: string; icon: string }> = [];

  private trendChart?: Chart;
  private statusChart?: Chart;
  private categoryChart?: Chart;

  modalTarget = {
    type: 'borrow' as 'borrow' | 'penalty',
    id: '',
    newStatus: '',
    allowed: [] as string[]
  };

  constructor() {
    this.recompute();
  }

  ngAfterViewInit(): void {
    this.initCharts();
  }

  // ---------- UI Helpers ----------
  statusChipClass(status: BorrowStatus): string {
    const map: Record<BorrowStatus, string> = {
      returned: 'chip-success',
      overdue: 'chip-danger',
      late: 'chip-warning',
      lost: 'chip-dark',
      damaged: 'chip-danger'
    };
    return map[status] || 'chip-gray';
  }

  penaltyChipClass(status: PenaltyStatus): string {
    const map: Record<PenaltyStatus, string> = {
      pending: 'chip-warning',
      paid: 'chip-success',
      replaced: 'chip-dark',
      returned: 'chip-success'
    };
    return map[status] || 'chip-gray';
  }

  chipClass(type: AlertItem['type']): string {
    const map: Record<AlertItem['type'], string> = {
      'Overdue': 'chip-danger',
      'Due Soon': 'chip-warning',
      'Penalty': 'chip-warning',
      'Damaged/Lost': 'chip-danger'
    };
    return map[type] || 'chip-gray';
  }

  alertIcon(type: AlertItem['type']): string {
    const map: Record<AlertItem['type'], string> = {
      'Overdue': 'bi-alarm',
      'Due Soon': 'bi-hourglass-split',
      'Penalty': 'bi-receipt',
      'Damaged/Lost': 'bi-shield-exclamation'
    };
    return map[type] || 'bi-info-circle';
  }

  // ---------- Actions (hook backend later) ----------
  onQuickAction(action: string): void {
    console.log('Quick action:', action);
    // Example: this.router.navigate(['/members']) etc...
  }

  openDetail(type: 'borrow' | 'penalty', id: string): void {
    console.log('Open detail:', type, id);
    // Example: navigate to detail page
  }

  openStatusModal(type: 'borrow' | 'penalty', id: string): void {
    this.modalTarget.type = type;
    this.modalTarget.id = id;

    if (type === 'borrow') {
      this.modalTarget.allowed = ['returned', 'overdue', 'late', 'lost', 'damaged'];
      this.modalTarget.newStatus = 'returned';
    } else {
      this.modalTarget.allowed = ['pending', 'paid', 'replaced', 'returned'];
      this.modalTarget.newStatus = 'paid';
    }

    // bootstrap modal (no extra TS library)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bootstrapAny = (window as any).bootstrap;
    const el = document.getElementById('statusModal');
    if (bootstrapAny && el) {
      bootstrapAny.Modal.getOrCreateInstance(el).show();
    }
  }

  confirmUpdateStatus(): void {
    console.log('Update status:', this.modalTarget);

    // You can call backend here
    // Example:
    // if (this.modalTarget.type === 'borrow') PATCH /borrows/:id { status }
    // if (this.modalTarget.type === 'penalty') PATCH /penalties/:id { status }

    // Close modal
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bootstrapAny = (window as any).bootstrap;
    const el = document.getElementById('statusModal');
    if (bootstrapAny && el) {
      bootstrapAny.Modal.getOrCreateInstance(el).hide();
    }
  }

  // ---------- Compute KPI / inventory ----------
  private recompute(): void {
    const borrowedNow = this.recentBorrows.filter(b => b.status !== 'returned').length;
    const overdue = this.recentBorrows.filter(b => b.status === 'overdue').length;
    const pendingPenalties = this.penalties.filter(p => p.status === 'pending').length;
    const pendingAmount = this.penalties
      .filter(p => p.status === 'pending')
      .reduce((s, p) => s + p.amount, 0);

    const totalBooks = 300;   // replace with API
    const totalMembers = 120; // replace with API

    this.inventory.available = Math.max(totalBooks - borrowedNow, 0);
    this.inventory.borrowed = borrowedNow;
    this.inventory.borrowedPct = totalBooks ? (borrowedNow / totalBooks) * 100 : 0;

    this.kpis = [
      { label: 'Total Books', value: totalBooks, delta: 3, deltaText: '+3 this week', icon: 'bi-book' },
      { label: 'Total Members', value: totalMembers, delta: 2, deltaText: '+2 this week', icon: 'bi-people' },
      { label: 'Borrowed Now', value: borrowedNow, delta: 1, deltaText: '+1 today', icon: 'bi-box-arrow-up-right' },
      { label: 'Overdue', value: overdue, delta: -1, deltaText: '-1 vs last week', icon: 'bi-alarm' },
      { label: 'Penalties Pending', value: pendingPenalties, delta: 0, deltaText: `$${pendingAmount.toFixed(2)} total`, icon: 'bi-receipt' },
      { label: 'Damaged/Lost', value: this.recentBorrows.filter(b => b.status === 'damaged' || b.status === 'lost').length, delta: 0, deltaText: 'needs action', icon: 'bi-shield-exclamation' }
    ];
  }

  // ---------- Charts ----------
  private initCharts(): void {
    // Destroy if rerender
    this.trendChart?.destroy();
    this.statusChart?.destroy();
    this.categoryChart?.destroy();

    // Trend (7 days)
    const trendLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const trendData = [8, 10, 6, 12, 9, 14, 11]; // replace with API

    this.trendChart = new Chart(this.trendCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: trendLabels,
        datasets: [
          {
            label: 'Borrows',
            data: trendData,
            tension: 0.35,
            fill: false,
            pointRadius: 3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: true } }
      }
    });

    // Status doughnut
    const statusCount = this.countBorrowStatuses(this.recentBorrows);
    this.statusChart = new Chart(this.statusCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: Object.keys(statusCount),
        datasets: [
          {
            label: 'Status',
            data: Object.values(statusCount)
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } }
      }
    });

    // Category bar (sample)
    this.categoryChart = new Chart(this.categoryCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Novel', 'History', 'Science', 'Kids', 'Poetry'],
        datasets: [
          { label: 'Borrows', data: [22, 14, 9, 17, 6] }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }
      }
    });
  }

  private countBorrowStatuses(rows: BorrowRecord[]): Record<BorrowStatus, number> {
    const base: Record<BorrowStatus, number> = {
      returned: 0, overdue: 0, late: 0, lost: 0, damaged: 0
    };
    for (const r of rows) base[r.status] = (base[r.status] || 0) + 1;
    return base;
  }
}


type BorrowStatus = 'returned' | 'overdue' | 'late' | 'lost' | 'damaged';
type PenaltyStatus = 'pending' | 'paid' | 'replaced' | 'returned';

interface BorrowRecord {
  _id: string;
  member_name: string;
  book_title: string;
  borrow_date: string | Date;
  due_date: string | Date;
  status: BorrowStatus;
}

interface PenaltyRecord {
  _id: string;
  member_name: string;
  penalty_type: 'lost' | 'damaged' | 'late';
  amount: number;
  status: PenaltyStatus;
}

interface AlertItem {
  type: 'Overdue' | 'Due Soon' | 'Penalty' | 'Damaged/Lost';
  title: string;
  subtitle: string;
  refType: 'borrow' | 'penalty';
  refId: string;
}