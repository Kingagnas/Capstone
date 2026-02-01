import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { PaymentDialogComponent } from '../payment-dialog/payment-dialog.component';

interface Errand {
  history_id: number;
  chat_id: number;
  runner_id: number;
  user_id: number;
  status: string;
  rating?: number;
  created_at: string;
  updated_at?: string;
  errand_id: number;
  rate_notes?: string;
  tip: number;
  service_charge: number;
  base_price: number;
  delivery_charge: number;
  total_price: number;
  customer_first_name: string;
  customer_last_name: string;
 remitted: 'Not Yet' | 'Pending' | 'Remitted';
  proof?: string;  
}

interface WeekRange {
  start: Date;
  end: Date;
  display: string;
}

@Component({
  selector: 'app-remitance',
  templateUrl: './remitance.component.html',
  styleUrls: ['./remitance.component.css']
})
export class RemitanceComponent implements OnInit {

  errands: Errand[] = [];
  filteredErrands: Errand[] = [];
  weeklyRemittance: number = 0;
  weeklyEarnings: number = 0;

  weeks: WeekRange[] = [];
  selectedWeek?: WeekRange;

  constructor(private dataService: DataService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.fetchErrands();
  }

  fetchErrands() {
    this.dataService.getErrandsHistory().subscribe(
      (res: any) => {
        // Ensure numeric fields are numbers (API may return strings)
        this.errands = (res.chat_history || []).map((r: any) => ({
          ...r,
          tip: Number(r.tip) || 0,
          service_charge: Number(r.service_charge) || 0,
          base_price: Number(r.base_price) || 0,
          delivery_charge: Number(r.delivery_charge) || 0,
          total_price: Number(r.total_price) || 0
        }));
        this.generateWeeks();
        // default to most recent week
        if (this.weeks.length > 0) {
          this.selectWeek(this.weeks[0]);
        }
      },
      err => console.error('Error fetching errands', err)
    );
  }

  generateWeeks() {
    const now = new Date();
    const errandsSorted = [...this.errands].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const firstErrandDate = errandsSorted.length > 0 ? new Date(errandsSorted[errandsSorted.length -1].created_at) : new Date();
    const weeks: WeekRange[] = [];

    let currentEnd = new Date(now);
    currentEnd.setHours(23, 59, 59, 999);

    while (currentEnd >= firstErrandDate) {
      const currentStart = new Date(currentEnd);
      currentStart.setDate(currentEnd.getDate() - 6);
      currentStart.setHours(0,0,0,0);

      const display = `${this.formatMonthDay(currentStart)} - ${this.formatMonthDay(currentEnd)}, ${currentEnd.getFullYear()}`;
      weeks.push({ start: currentStart, end: currentEnd, display });

      currentEnd = new Date(currentStart);
      currentEnd.setDate(currentEnd.getDate() - 1);
      currentEnd.setHours(23, 59, 59, 999);
    }

    this.weeks = weeks;
  }

  selectWeek(week: WeekRange) {
    this.selectedWeek = week;
    this.filteredErrands = this.errands.filter(e => {
      const created = new Date(e.created_at);
      return created >= week.start && created <= week.end;
    });
    this.calculateWeeklyStats();
  }

  calculateWeeklyStats() {
    const earnings = this.filteredErrands.reduce((sum, e) => {
      const v = Number(e.base_price) || 0;
      return sum + v;
    }, 0);

    const remittance = this.filteredErrands.reduce((sum, e) => {
      const v = Number(e.service_charge) || 0;
      return sum + v;
    }, 0);

    this.weeklyEarnings = Number(earnings.toFixed(2));
    this.weeklyRemittance = Number(remittance.toFixed(2));
  }

  formatDate(date: string): string {
    const d = new Date(date);
    return d.toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour:'2-digit', minute:'2-digit', hour12: true });
  }

  formatMonthDay(date: Date): string {
    return date.toLocaleString('en-US', { month: 'short', day: 'numeric' });
  }

openPaymentDialog() {
  if (!this.selectedWeek) {
    alert('Please select a week first');
    return;
  }

  const runnerId = Number(localStorage.getItem('userId')); // get logged-in runner ID

  const dialogRef = this.dialog.open(PaymentDialogComponent, {
    width: '400px',
    data: {
      amount: this.weeklyRemittance,
      weekStart: this.selectedWeek.start.toISOString(),
      weekEnd: this.selectedWeek.end.toISOString(),
      runnerId: runnerId
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.fetchErrands(); // reload the errands table after uploading proof
    }
  });
}


}
