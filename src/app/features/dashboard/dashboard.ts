import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  signal,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { Authservice } from '../../core/auth/authservice';
import { AvaiVsBorI, KpiI } from '../models/report.model';
import { Reportservice } from '../services/reportservice/reportservice';
import { BorrowI, BorrowStatus, ReturnI } from '../models/borrow.model';
import { PenaltyListItem, PenaltyStatus, PenaltyType } from '../models/penalty.model';
import { Borrowservice } from '../services/borrowservice/borrowservice';
import { Alertservice } from '../../shared/components/alert-success/alertservice';
import { Penaltyservice } from '../services/penaltyservice/penaltyservice';
import { AlertSuccess } from '../../shared/components/alert-success/alert-success';
import { TruncatePipe } from '../../shared/pipes/truncate-pipe';
import { LoadingService } from '../../core/services/loading.service';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader/skeleton-loader';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, AlertSuccess, TruncatePipe, SkeletonLoaderComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements AfterViewInit {
  @ViewChild('trendCanvas') trendCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('statusCanvas') statusCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('categoryCanvas') categoryCanvas!: ElementRef<HTMLCanvasElement>;


  recentBorrows = signal<BorrowI[]>([]);
  recentPenalties = signal<PenaltyListItem[]>([]);
  overdueBorrows = signal<BorrowI[]>([]);
  inventory = signal<AvaiVsBorI>({ available: 0, borrowed: 0, borrowedPct: 0 });
  kpis = signal<KpiI[]>([]);
  trendData = signal<number[]>([]);
  statusBreakdown = signal<{ labels: string[]; data: number[] }>({
    labels: ['', '', '', '', ''],
    data: [0, 0, 0, 0, 0],
  });
  topCategories = signal<{ labels: string[]; data: number[] }>({
    labels: [],
    data: [],
  });

  private trendChart?: Chart;
  private statusChart?: Chart;
  private categoryChart?: Chart;

  constructor(
    private router: Router,
    private auth: Authservice,
    private reportservice: Reportservice,
    private borrowservice: Borrowservice,
    private alert: Alertservice,
    private penaltyservice: Penaltyservice,
    public loading: LoadingService
  ) { }

  ngOnInit(): void {
    this.loading.show();
    this.getTrend();
    this.getStatusBreakdownData();
    this.getTopCategoriesData();
    this.getKpis();
    this.getOverdueData();
    this.getAvaiVsBor();
    this.getRecentBorrowData();
    this.getRecentPenaltyData();
  }

  ngAfterViewInit(): void {
    this.initCharts();
  }

  // get kpis data
  getKpis() {
    this.reportservice.getKpiData().subscribe({
      next: (res) => {
        this.kpis.set(res);
      },
    });
  }

  // get overdue borrows
  getOverdueData() {
    this.reportservice.getOverdueBorrows().subscribe({
      next: (res) => {
        this.overdueBorrows.set(res);
      },
    });
  }

  // get available vs borrowed
  getAvaiVsBor() {
    this.reportservice.getAvailableVsBorrowed().subscribe({
      next: (res) => {
        this.inventory.set(res);
      },
    });
  }

  // get borrow trend data
  getTrend() {
    this.reportservice.getTrendBorrow().subscribe({
      next: (res) => {
        this.trendData.set(res);
        console.log(this.trendData());
      },
    });
  }

  // get status breakdown
  getStatusBreakdownData() {
    this.reportservice.getStatusBreakdown().subscribe({
      next: (res) => {
        this.statusBreakdown.set(res);
      },
    });
  }

  // get top categories
  getTopCategoriesData() {
    this.reportservice.getTopCategory().subscribe({
      next: (res) => {
        this.topCategories.set(res);
      },
    });
  }

  // get recent borrows
  getRecentBorrowData() {
    this.reportservice.getRecentBorrows().subscribe({
      next: (res) => {
        this.recentBorrows.set(res);
        this.loading.hide();
      },
      error: (err) => {
        this.loading.hide();
      }
    });
  }

  // get recent penalties
  getRecentPenaltyData() {
    this.reportservice.getRecentPenalty().subscribe({
      next: (res) => {
        this.recentPenalties.set(res);
      },
    });
  }

  // ================= UPDATE BORROW STATUS =====================
  item: ReturnI = {
    status: '',
    damage_type: 'can',
    damage_fee: 0,
  };
  selectedBorrowId = '';
  selectedStatus: BorrowStatus = 'returned';

  openUpdateStatus(b: any) {
    this.selectedBorrowId = b._id;
    this.removeFailed = false;
    console.log(this.selectedBorrowId);
  }

  // damage type helpers
  removeFailed: boolean = false;
  isLittleDamage: boolean = true;
  checkDamageType(type: boolean) {
    this.isLittleDamage = type;

    if (type) {
      this.item.damage_type = 'can';
    } else {
      this.item.damage_type = 'cannot';
    }
  }

  saveStatus() {
    if (
      this.item.damage_fee &&
      this.item.damage_fee <= 0 &&
      this.selectedStatus === 'damaged' &&
      this.isLittleDamage
    ) {
      this.removeFailed = true;
      return;
    }

    this.item.status = this.selectedStatus;
    this.borrowservice
      .updateBorrowStatus(this.selectedBorrowId, this.item)
      .subscribe({
        next: (res) => {
          this.alert.showAlert('success', res.message);
          this.getRecentBorrowData();
          this.getOverdueData();
        },
        error: (err) => {
          this.alert.showAlert('error', err.error.message);
        },
      });
  }

  // ============== UPDATE PENALTY STATUS ===============
  selectPenaltyStatus: string = 'paid';
  selectPenaltyId: string = '';
  selectPenaltyType: PenaltyType = 'lost';
  openPenaltyModal(penalty: PenaltyListItem) {
    this.selectPenaltyId = penalty._id;
    this.selectPenaltyType = penalty.penalty_type;
  }

  savePenaltySatus() {
    if (this.selectPenaltyStatus === '' || this.selectPenaltyId === '') return;

    this.penaltyservice
      .updatePenaltyStatus(this.selectPenaltyId, this.selectPenaltyStatus)
      .subscribe({
        next: (res) => {
          this.alert.showAlert('success', res.message);
          this.getRecentPenaltyData();
        },
        error: (err) => {
          this.alert.showAlert('error', err.error?.message);
        },
      });
  }

  // return status
  returnStatus(status: PenaltyType): PenaltyStatus[] {
    if (status === 'lost') {
      return ['paid', 'replaced', 'returned'];
    } else if (status === 'late') {
      return ['paid'];
    } else {
      return ['paid', 'replaced'];
    }
  }

  // ---------- UI Helpers ----------

  chipClass(date: string): string {
    return this.calculateDate(date) < 0 ? 'chip-warning' : 'chip-danger';
  }

  alertIcon(date: string): string {
    return this.calculateDate(date) < 0 ? 'bi-hourglass-split' : 'bi-alarm';
  }

  calculateDate(date: string): number {
    const due = new Date(date);
    due.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (today.getTime() - due.getTime()) / (1000 * 24 * 60 * 60);
  }

  toKHR(usd: number): number {
    return usd * 4018;
  }

  overdueTitle(date: string): string {
    const over_day = this.calculateDate(date);
    if (over_day == 0) {
      return 'Due today';
    } else if (over_day > 0) {
      return `Overdue by ${over_day} ${over_day === 1 ? 'day' : 'days'}`;
    } else {
      return `Due in ${-over_day} ${over_day === -1 ? 'day' : 'days'} more`;
    }
  }

  statusClass(status: string) {
    return {
      'status-borrowed': status === 'borrowed',
      'status-returned': status === 'returned',
      'status-late': status === 'late',
      'status-overdue': status === 'overdue',
      'status-lost': status === 'lost',
      'status-damaged': status === 'damaged' || status === 'damage',
      'status-pending': status === 'pending',
      'status-replaced': status === 'replaced',
      'status-paid': status === 'paid',
    };
  }

  statusIcon(status: string) {
    const map: any = {
      borrowed: 'bi-box-arrow-in-right',
      returned: 'bi-check-circle-fill',
      late: 'bi-exclamation-circle-fill',
      overdue: 'bi-alarm-fill',
      lost: 'bi-x-circle-fill',
      damaged: 'bi-tools',
      damage: 'bi-tools',
      pending: 'bi-hourglass-split',
      paid: 'bi-check-circle-fill',
      replaced: 'bi-arrow-repeat',
    };
    return map[status] || 'bi-dot';
  }

  // ---------- Actions (hook backend later) ----------
  onQuickAction(action: string): void {
    console.log('Quick action:', action);
    this.router.navigate([action]);
  }

  // ---------- Charts ----------
  private initCharts(): void {
    if (!this.trendCanvas || !this.statusCanvas || !this.categoryCanvas) return;

    // Destroy if rerender
    this.trendChart?.destroy();
    this.statusChart?.destroy();
    this.categoryChart?.destroy();

    // Trend (7 days)
    const trendLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    this.trendChart = new Chart(this.trendCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: trendLabels,
        datasets: [
          {
            label: 'Borrows',
            data: this.trendData(),
            tension: 0.35,
            fill: false,
            pointRadius: 3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: true } },
      },
    });

    // Status doughnut
    this.statusChart = new Chart(this.statusCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: this.statusBreakdown().labels,
        datasets: [
          {
            label: 'Status',
            data: this.statusBreakdown().data,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } },
      },
    });

    // Category bar (sample)
    this.categoryChart = new Chart(this.categoryCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: this.topCategories().labels,
        datasets: [{ label: 'Borrows', data: this.topCategories().data }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
      },
    });
  }

  private _syncChart = effect(() => {
    const data = this.trendData();
    const statusData = this.statusBreakdown();
    const topData = this.topCategories();
    const isLoading = this.loading.isLoading();

    if (isLoading) return;

    // Use a small timeout to ensure the DOM has updated via @else
    setTimeout(() => {
      if (!this.trendChart) {
        this.initCharts();
      }

      if (this.trendChart) {
        this.trendChart.data.datasets[0].data = data;
        this.trendChart.update();
      }

      if (this.statusChart) {
        this.statusChart.data.labels = statusData.labels;
        this.statusChart.data.datasets[0].data = statusData.data;
        this.statusChart.update();
      }

      if (this.categoryChart) {
        this.categoryChart.data.labels = topData.labels;
        this.categoryChart.data.datasets[0].data = topData.data;
        this.categoryChart.update();
      }
    }, 0);
  });
}
