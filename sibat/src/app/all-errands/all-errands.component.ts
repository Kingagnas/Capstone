import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-all-errands',
  templateUrl: './all-errands.component.html',
  styleUrls: ['./all-errands.component.css']
})
export class AllErrandsComponent implements OnInit {

  errands: any[] = [];
  filteredErrands: any[] = [];

  searchTerm = '';
  remittedFilter: string = 'ALL';

  isMobile = false;

  apiBaseUrl = 'https://sibatapi2.loophole.site/Capstone/backend/uploads/proof';

  // Statistics
  totalErrands = 0;
  totalRemitted = 0;
  totalPending = 0;
  totalNotYet = 0;



  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.checkMobile();
    window.addEventListener('resize', () => this.checkMobile());
    this.loadErrands();
  }

  checkMobile() {
    this.isMobile = window.innerWidth <= 768;
  }

  loadErrands() {
    this.dataService.getErrands().subscribe(
      (res: any[]) => {
        console.log('Admin errands:', res);
        this.errands = res;
        this.applyFilters();
      },
      err => console.error('Failed to load errands', err)
    );
  }

  applyFilters() {
    const term = this.searchTerm.toLowerCase().trim();

    this.filteredErrands = this.errands.filter(e => {
      const matchesSearch =
        !term ||
        e.errand_id?.toString().includes(term) ||
        e.user_name?.toLowerCase().includes(term) ||
        e.runner_name?.toLowerCase().includes(term) ||
        e.status?.toLowerCase().includes(term);

      const matchesRemitted =
        this.remittedFilter === 'ALL' || e.remitted === this.remittedFilter;

      return matchesSearch && matchesRemitted;
    });

     this.calculateStatistics();
  }


  calculateStatistics() {
    this.totalErrands = this.filteredErrands.length;
    this.totalRemitted = this.filteredErrands.filter(e => e.remitted === 'Remitted').length;
    this.totalPending = this.filteredErrands.filter(e => e.remitted === 'Pending').length;
    this.totalNotYet = this.filteredErrands.filter(e => e.remitted === 'Not Yet').length;
  }


  getProofUrl(proof: string | null): string | null {
    if (!proof) return null;
    return `${this.apiBaseUrl}/${proof}`;
  }

  viewDetails(e: any) {
    Swal.fire({
      title: `Errand #${e.errand_id}`,
      html: `
        <p><b>User:</b> ${e.user_name}</p>
        <p><b>Runner:</b> ${e.runner_name || '—'}</p>
        
        <p><b>Rating:</b> ${e.rating || '—'}/5</p>
        <p><b>Notes:</b> ${e.rate_notes || '—'}</p>
        <p><b>Base:</b> ₱${e.base_price}</p>
        <p><b>Delivery:</b> ₱${e.delivery_charge}</p>
        <p><b>Service:</b> ₱${e.service_charge}</p>
        <p><b>Total:</b> ₱${e.total_price}</p>
        <p><b>Remitted:</b> ${e.remitted}</p>
        ${e.proof ? `<img src="${this.getProofUrl(e.proof)}" style="width:100%;margin-top:10px;border-radius:8px;">` : '<p>No proof uploaded</p>'}
      `,
      width: '600px',
      confirmButtonText: 'Close'
    });
  }

markRemitted(errandId: number) {
  Swal.fire({
    title: 'Mark this errand as REMITTED?',
    text: "This action cannot be undone.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, mark as remitted',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      this.dataService.markAsRemitted(errandId).subscribe(
        (res: any) => {
          if (res.success) {
            Swal.fire(
              'Marked!',
              'Errand has been marked as remitted.',
              'success'
            );
            this.loadErrands(); // refresh table/cards
          } else {
            Swal.fire('Error', res.message || 'Failed to update', 'error');
          }
        },
        (err) => {
          console.error(err);
          Swal.fire('Error', 'Server error', 'error');
        }
      );
    }
  });
}





}
